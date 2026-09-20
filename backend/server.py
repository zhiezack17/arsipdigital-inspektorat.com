"""
Portal Arsip Digital Inspektorat Kab. Rokan Hilir - Backend API.
FastAPI + MongoDB + JWT authentication.
"""
from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, File, UploadFile
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import re
import unicodedata
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Literal
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# ---------------- Configuration ----------------
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ.get('JWT_SECRET', 'inspektorat-rohil-secret-key-change-in-production-2025')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRES_HOURS = 12

# ---------------- App setup ----------------
app = FastAPI(title="Portal Arsip Digital Inspektorat Rokan Hilir", version="1.0.0")
api_router = APIRouter(prefix="/api")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login", auto_error=False)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_NEWS_DIR = UPLOAD_DIR / "news"
UPLOAD_MEDIA_DIR = UPLOAD_DIR / "media"

UPLOAD_NEWS_DIR.mkdir(parents=True, exist_ok=True)
UPLOAD_MEDIA_DIR.mkdir(parents=True, exist_ok=True)

app.mount("/api/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")


# ---------------- Utility helpers ----------------
def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def iso(dt: datetime) -> str:
    if isinstance(dt, str):
        return dt
    return dt.astimezone(timezone.utc).isoformat()


def serialize_doc(doc: dict) -> dict:
    """Recursively serialize datetimes and remove Mongo _id."""
    if not doc:
        return doc
    out = {}
    for k, v in doc.items():
        if k == "_id":
            continue
        if isinstance(v, datetime):
            out[k] = iso(v)
        elif isinstance(v, dict):
            out[k] = serialize_doc(v)
        elif isinstance(v, list):
            out[k] = [serialize_doc(x) if isinstance(x, dict) else (iso(x) if isinstance(x, datetime) else x) for x in v]
        else:
            out[k] = v
    return out


def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode('utf-8'), hashed.encode('utf-8'))
    except Exception:
        return False


def create_token(user_id: str, username: str, role: str) -> str:
    payload = {
        'sub': user_id,
        'username': username,
        'role': role,
        'iat': int(now_utc().timestamp()),
        'exp': int((now_utc() + timedelta(hours=JWT_EXPIRES_HOURS)).timestamp()),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])


# ---------------- Slug utilities ----------------
def slugify(text: str) -> str:
    """Convert a title string to a URL-safe slug.

    Uses NFKD normalization to transliterate accented characters (é→e, ö→o, etc.)
    before stripping non-ASCII bytes. This works well for Indonesian text, which is
    primarily Latin-based. Pure non-Latin scripts would be stripped entirely; add a
    transliteration library if those are expected in titles.
    """
    text = unicodedata.normalize('NFKD', text)
    text = text.encode('ascii', 'ignore').decode('ascii').lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    text = text.strip('-')
    return text or 'berita'


async def generate_unique_slug(title: str, exclude_id: Optional[str] = None) -> str:
    """Generate a slug from title, ensuring uniqueness in the news collection."""
    base = slugify(title)
    slug = base
    counter = 2
    while True:
        query: dict = {"slug": slug}
        if exclude_id:
            query["id"] = {"$ne": exclude_id}
        existing = await db.news.find_one(query)
        if not existing:
            return slug
        slug = f"{base}-{counter}"
        counter += 1


# ---------------- Models ----------------
Role = Literal['super_admin', 'admin', 'admin_media', 'auditor']


class UserPublic(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    username: str
    full_name: str
    role: Role
    is_active: bool = True
    created_at: Optional[str] = None


class LoginPayload(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic


class ChangePasswordPayload(BaseModel):
    old_password: str
    new_password: str = Field(min_length=6)


class CreateUserPayload(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    full_name: str = Field(min_length=2, max_length=120)
    password: str = Field(min_length=6)
    role: Role = 'auditor'


class UpdateUserPayload(BaseModel):
    full_name: Optional[str] = None
    role: Optional[Role] = None
    is_active: Optional[bool] = None


class ResetPasswordPayload(BaseModel):
    new_password: str = Field(min_length=6)


class News(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    slug: Optional[str] = None
    title: str
    content: str
    category: Optional[str] = 'Pengumuman'
    image_url: Optional[str] = None
    is_featured: bool = False
    is_published: bool = True
    author: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class NewsPayload(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    content: str = Field(min_length=3)
    category: Optional[str] = 'Pengumuman'
    image_url: Optional[str] = None
    is_featured: bool = False
    is_published: bool = True


class PublicNews(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    slug: str
    title: str
    content: str
    category: Optional[str] = 'Pengumuman'
    image_url: Optional[str] = None
    is_featured: bool = False
    author: Optional[str] = None
    created_at: Optional[str] = None


class Agenda(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title: str
    agenda_date: str
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    is_active: bool = True
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class AgendaPayload(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    agenda_date: str = Field(pattern=r"^\d{4}-\d{2}-\d{2}$")
    start_time: Optional[str] = Field(default=None, pattern=r"^\d{2}:\d{2}$")
    end_time: Optional[str] = Field(default=None, pattern=r"^\d{2}:\d{2}$")
    location: Optional[str] = None
    description: Optional[str] = None
    is_active: bool = True


class PublicAgenda(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title: str
    agenda_date: str
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None


class MediaItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title: str
    description: Optional[str] = None
    media_type: str
    media_url: str
    thumbnail_url: Optional[str] = None
    event_date: Optional[str] = None
    category: Optional[str] = "Kegiatan"
    location: Optional[str] = None
    is_featured: bool = False
    is_published: bool = True
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class MediaPayload(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    description: Optional[str] = None
    media_type: str = Field(pattern=r"^(image|video)$")
    media_url: str = Field(min_length=1)
    thumbnail_url: Optional[str] = None
    event_date: Optional[str] = Field(
        default=None,
        pattern=r"^\d{4}-\d{2}-\d{2}$",
    )
    category: Optional[str] = "Kegiatan"
    location: Optional[str] = None
    is_featured: bool = False
    is_published: bool = True


class PublicMediaItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title: str
    description: Optional[str] = None
    media_type: str
    media_url: str
    thumbnail_url: Optional[str] = None
    event_date: Optional[str] = None
    category: Optional[str] = "Kegiatan"
    location: Optional[str] = None
    is_featured: bool = False
    created_at: Optional[str] = None


class Stats(BaseModel):
    model_config = ConfigDict(extra="ignore")
    total_surat_masuk: int = 0
    total_surat_keluar: int = 0
    total_arsip: int = 0
    total_auditor_aktif: int = 0
    updated_at: Optional[str] = None


class StatsPayload(BaseModel):
    total_surat_masuk: int = Field(ge=0)
    total_surat_keluar: int = Field(ge=0)
    total_arsip: int = Field(ge=0)
    total_auditor_aktif: int = Field(ge=0)


class Links(BaseModel):
    model_config = ConfigDict(extra="ignore")
    irban_1: str = "https://irban1.arsipdigital-inspektorat.com"
    irban_2: str = ""
    irban_3: str = ""
    irban_4: str = "https://irban4.arsipdigital-inspektorat.com"
    irban_5: str = ""
    kka: str = "https://kka.arsipdigital-inspektorat.com"
    updated_at: Optional[str] = None


class LinksPayload(BaseModel):
    irban_1: str = ""
    irban_2: str = ""
    irban_3: str = ""
    irban_4: str = ""
    irban_5: str = ""
    kka: str = ""


# ---------------- Auth dependencies ----------------
async def get_current_user(token: Optional[str] = Depends(oauth2_scheme)) -> dict:
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token tidak ditemukan")
    try:
        payload = decode_token(token)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Sesi telah berakhir. Silakan login ulang.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token tidak valid")

    user_id = payload.get('sub')
    user = await db.users.find_one({"id": user_id})
    if not user or not user.get('is_active', True):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Akun tidak aktif atau tidak ditemukan")
    user = serialize_doc(user)
    return user


async def require_super_admin(current_user: dict = Depends(get_current_user)) -> dict:
    if current_user.get("role") not in ["super_admin", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akses hanya untuk Super Admin",
        )
    return current_user


async def require_media_admin(current_user: dict = Depends(get_current_user)) -> dict:
    if current_user.get("role") not in ["super_admin", "admin", "admin_media"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akses hanya untuk Admin Media",
        )
    return current_user


# ---------------- Seed defaults ----------------
async def ensure_defaults():
    # Ensure default admin exists
    admin = await db.users.find_one({"username": "admin"})
    if not admin:
        default_admin = {
            "id": str(uuid.uuid4()),
            "username": "admin",
            "full_name": "Administrator",
            "password_hash": hash_password("Admin@2025"),
            "role": "super_admin",
            "is_active": True,
            "created_at": iso(now_utc()),
        }
        await db.users.insert_one(default_admin)
        logger.info("Seeded default admin (username=admin).")

    # Ensure a default test auditor exists (for QA/testing agent)
    auditor = await db.users.find_one({"username": "auditor"})
    if not auditor:
        default_auditor = {
            "id": str(uuid.uuid4()),
            "username": "auditor",
            "full_name": "Auditor Contoh",
            "password_hash": hash_password("Auditor@2025"),
            "role": "auditor",
            "is_active": True,
            "created_at": iso(now_utc()),
        }
        await db.users.insert_one(default_auditor)
        logger.info("Seeded default auditor (username=auditor).")

    # Ensure stats doc exists
    stats = await db.stats.find_one({"key": "global"})
    if not stats:
        await db.stats.insert_one({
            "key": "global",
            "total_surat_masuk": 0,
            "total_surat_keluar": 0,
            "total_arsip": 0,
            "total_auditor_aktif": 1,
            "updated_at": iso(now_utc()),
        })

    # Ensure links doc exists
    links = await db.links.find_one({"key": "global"})
    if not links:
        await db.links.insert_one({
            "key": "global",
            "irban_1": "https://irban1.arsipdigital-inspektorat.com",
            "irban_2": "",
            "irban_3": "",
            "irban_4": "https://irban4.arsipdigital-inspektorat.com",
            "irban_5": "",
            "kka": "https://kka.arsipdigital-inspektorat.com",
            "updated_at": iso(now_utc()),
        })

    # Seed initial welcome news if empty
    news_count = await db.news.count_documents({})
    if news_count == 0:
        sample = [
            {
                "id": str(uuid.uuid4()),
                "slug": "selamat-datang-portal-arsip-digital-inspektorat",
                "title": "Selamat Datang di Portal Arsip Digital Inspektorat",
                "content": "Portal ini merupakan pusat akses aplikasi E-Arsip Inspektorat Kabupaten Rokan Hilir. Silakan gunakan menu di bawah untuk mengakses aplikasi E-Arsip Irban dan KKA sesuai kebutuhan Anda.",
                "category": "Pengumuman",
                "is_published": True,
                "author": "Administrator",
                "created_at": iso(now_utc()),
                "updated_at": iso(now_utc()),
            },
            {
                "id": str(uuid.uuid4()),
                "slug": "menu-e-arsip-irban-ii-iii-v-segera-hadir",
                "title": "Menu E-Arsip Irban II, III, dan V Segera Hadir",
                "content": "Kami sedang mempersiapkan aplikasi E-Arsip untuk Irban II, III, dan V. Aplikasi akan tersedia dalam waktu dekat. Terima kasih atas kesabaran Anda.",
                "category": "Informasi",
                "is_published": True,
                "author": "Administrator",
                "created_at": iso(now_utc()),
                "updated_at": iso(now_utc()),
            },
        ]
        await db.news.insert_many(sample)
        logger.info("Seeded sample news.")

    # Backfill slugs for existing news that don't have one
    async for doc in db.news.find({"slug": {"$exists": False}}):
        slug = await generate_unique_slug(doc.get('title', ''), exclude_id=doc.get('id'))
        await db.news.update_one({"id": doc['id']}, {"$set": {"slug": slug}})
        logger.info(f"Backfilled slug '{slug}' for news id={doc.get('id')}")


@app.on_event("startup")
async def startup_event():
    await ensure_defaults()


# ---------------- Health ----------------
@api_router.get("/")
async def root():
    return {"message": "Portal Arsip Digital Inspektorat Rokan Hilir - API v1"}


@api_router.get("/health")
async def health():
    return {"status": "ok", "time": iso(now_utc())}


# ---------------- Auth ----------------
@api_router.post("/auth/login", response_model=LoginResponse)
async def login(payload: LoginPayload):
    user = await db.users.find_one({"username": payload.username.strip()})
    if not user or not verify_password(payload.password, user.get('password_hash', '')):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Nama pengguna atau kata sandi salah")
    if not user.get('is_active', True):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Akun Anda dinonaktifkan. Hubungi Admin.")

    token = create_token(user['id'], user['username'], user['role'])
    return LoginResponse(
        access_token=token,
        token_type="bearer",
        user=UserPublic(
            id=user['id'], username=user['username'], full_name=user['full_name'],
            role=user['role'], is_active=user.get('is_active', True),
            created_at=user.get('created_at')
        )
    )


@api_router.get("/auth/me", response_model=UserPublic)
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserPublic(**current_user)


@api_router.post("/auth/change-password")
async def change_password(payload: ChangePasswordPayload, current_user: dict = Depends(get_current_user)):
    user = await db.users.find_one({"id": current_user['id']})
    if not user or not verify_password(payload.old_password, user.get('password_hash', '')):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Kata sandi lama salah")
    await db.users.update_one({"id": current_user['id']}, {"$set": {
        "password_hash": hash_password(payload.new_password),
        "updated_at": iso(now_utc()),
    }})
    return {"message": "Kata sandi berhasil diperbarui"}


# ---------------- Users (Admin only) ----------------
@api_router.get("/users", response_model=List[UserPublic])
async def list_users(_: dict = Depends(require_super_admin)):
    users = await db.users.find({}, {"password_hash": 0}).sort("created_at", -1).to_list(1000)
    return [UserPublic(**serialize_doc(u)) for u in users]


@api_router.post("/users", response_model=UserPublic)
async def create_user(payload: CreateUserPayload, _: dict = Depends(require_super_admin)):
    exists = await db.users.find_one({"username": payload.username.strip()})
    if exists:
        raise HTTPException(status_code=400, detail="Nama pengguna sudah digunakan")
    new_user = {
        "id": str(uuid.uuid4()),
        "username": payload.username.strip(),
        "full_name": payload.full_name.strip(),
        "password_hash": hash_password(payload.password),
        "role": payload.role,
        "is_active": True,
        "created_at": iso(now_utc()),
    }
    await db.users.insert_one(new_user)
    return UserPublic(**serialize_doc(new_user))


@api_router.patch("/users/{user_id}", response_model=UserPublic)
async def update_user(user_id: str, payload: UpdateUserPayload, current: dict = Depends(require_super_admin)):
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="Pengguna tidak ditemukan")
    updates = {k: v for k, v in payload.model_dump(exclude_none=True).items()}
    # Prevent admin from deactivating themselves or removing their own admin role
    if user_id == current['id']:
        if 'is_active' in updates and updates['is_active'] is False:
            raise HTTPException(status_code=400, detail="Tidak dapat menonaktifkan akun Anda sendiri")
        if 'role' in updates and updates['role'] != 'super_admin':
            raise HTTPException(status_code=400, detail="Tidak dapat mengubah peran akun Anda sendiri")
    if updates:
        updates['updated_at'] = iso(now_utc())
        await db.users.update_one({"id": user_id}, {"$set": updates})
    updated = await db.users.find_one({"id": user_id}, {"password_hash": 0})
    return UserPublic(**serialize_doc(updated))


@api_router.post("/users/{user_id}/reset-password")
async def reset_password(user_id: str, payload: ResetPasswordPayload, _: dict = Depends(require_super_admin)):
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="Pengguna tidak ditemukan")
    await db.users.update_one({"id": user_id}, {"$set": {
        "password_hash": hash_password(payload.new_password),
        "updated_at": iso(now_utc()),
    }})
    return {"message": "Kata sandi berhasil direset"}


@api_router.delete("/users/{user_id}")
async def delete_user(user_id: str, current: dict = Depends(require_super_admin)):
    if user_id == current['id']:
        raise HTTPException(status_code=400, detail="Tidak dapat menghapus akun Anda sendiri")
    result = await db.users.delete_one({"id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Pengguna tidak ditemukan")
    return {"message": "Pengguna berhasil dihapus"}


# ---------------- News ----------------
@api_router.get("/news", response_model=List[News])
async def list_news(_: dict = Depends(get_current_user)):
    docs = await db.news.find({}).sort("created_at", -1).to_list(500)
    return [News(**serialize_doc(d)) for d in docs]



@api_router.post("/news-image")
async def upload_news_image(
    image: UploadFile = File(...),
    _: dict = Depends(require_media_admin),
):
    allowed_types = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
    }

    extension = allowed_types.get(image.content_type or "")
    if not extension:
        raise HTTPException(
            status_code=400,
            detail="Format gambar harus JPG, PNG, atau WEBP",
        )

    content = await image.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="Ukuran gambar maksimal 5 MB",
        )

    filename = f"{uuid.uuid4().hex}{extension}"
    destination = UPLOAD_NEWS_DIR / filename
    destination.write_bytes(content)

    return {
        "image_url": f"/api/uploads/news/{filename}",
        "filename": filename,
    }


@api_router.get("/news/{news_id}", response_model=News)
async def get_news(news_id: str, _: dict = Depends(get_current_user)):
    doc = await db.news.find_one({"id": news_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Berita tidak ditemukan")
    return News(**serialize_doc(doc))


@api_router.post("/news", response_model=News)
async def create_news(payload: NewsPayload, current: dict = Depends(require_media_admin)):
    news_id = str(uuid.uuid4())
    slug = await generate_unique_slug(payload.title)
    new_news = {
        "id": news_id,
        "slug": slug,
        "title": payload.title.strip(),
        "content": payload.content.strip(),
        "category": (payload.category or "Pengumuman").strip(),
        "image_url": payload.image_url,
        "is_featured": payload.is_featured,
        "is_published": payload.is_published,
        "author": current.get('full_name') or current.get('username'),
        "created_at": iso(now_utc()),
        "updated_at": iso(now_utc()),
    }
    if payload.is_featured:
        await db.news.update_many({}, {"$set": {"is_featured": False}})

    await db.news.insert_one(new_news)
    return News(**serialize_doc(new_news))


@api_router.patch("/news/{news_id}", response_model=News)
async def update_news(news_id: str, payload: NewsPayload, _: dict = Depends(require_media_admin)):
    doc = await db.news.find_one({"id": news_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Berita tidak ditemukan")
    updates = payload.model_dump()

    if payload.is_featured:
        await db.news.update_many(
            {"id": {"$ne": news_id}},
            {"$set": {"is_featured": False}},
        )

    # Preserve existing slug; only generate if the document has none
    if not doc.get('slug'):
        updates['slug'] = await generate_unique_slug(payload.title, exclude_id=news_id)
    updates['updated_at'] = iso(now_utc())
    await db.news.update_one({"id": news_id}, {"$set": updates})
    updated = await db.news.find_one({"id": news_id})
    return News(**serialize_doc(updated))


@api_router.delete("/news/{news_id}")
async def delete_news(news_id: str, _: dict = Depends(require_media_admin)):
    result = await db.news.delete_one({"id": news_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Berita tidak ditemukan")
    return {"message": "Berita berhasil dihapus"}


# ---------------- Public News (no auth) ----------------
@api_router.get("/public/news", response_model=List[PublicNews])
async def list_public_news():
    """Return published news items for public consumption — no authentication required."""
    docs = await db.news.find({"is_published": True, "slug": {"$exists": True}}).sort("created_at", -1).to_list(100)
    return [PublicNews(**serialize_doc(d)) for d in docs]


@api_router.get("/public/news/{slug}", response_model=PublicNews)
async def get_public_news(slug: str):
    """Return a single published news item by slug — no authentication required."""
    doc = await db.news.find_one({"slug": slug, "is_published": True})
    if not doc:
        raise HTTPException(status_code=404, detail="Berita tidak ditemukan")
    return PublicNews(**serialize_doc(doc))


# ---------------- Agenda ----------------
@api_router.get("/agenda", response_model=List[Agenda])
async def list_agenda(_: dict = Depends(get_current_user)):
    docs = await db.agenda.find({}).sort("agenda_date", 1).to_list(500)
    return [Agenda(**serialize_doc(d)) for d in docs]


@api_router.get("/agenda/{agenda_id}", response_model=Agenda)
async def get_agenda(agenda_id: str, _: dict = Depends(get_current_user)):
    doc = await db.agenda.find_one({"id": agenda_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Agenda tidak ditemukan")
    return Agenda(**serialize_doc(doc))


@api_router.post("/agenda", response_model=Agenda)
async def create_agenda(payload: AgendaPayload, _: dict = Depends(require_media_admin)):
    new_agenda = {
        "id": str(uuid.uuid4()),
        "title": payload.title.strip(),
        "agenda_date": payload.agenda_date,
        "start_time": payload.start_time,
        "end_time": payload.end_time,
        "location": payload.location.strip() if payload.location else None,
        "description": payload.description.strip() if payload.description else None,
        "is_active": payload.is_active,
        "created_at": iso(now_utc()),
        "updated_at": iso(now_utc()),
    }
    await db.agenda.insert_one(new_agenda)
    return Agenda(**serialize_doc(new_agenda))


@api_router.patch("/agenda/{agenda_id}", response_model=Agenda)
async def update_agenda(
    agenda_id: str,
    payload: AgendaPayload,
    _: dict = Depends(require_media_admin),
):
    doc = await db.agenda.find_one({"id": agenda_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Agenda tidak ditemukan")

    updates = payload.model_dump()
    updates["title"] = payload.title.strip()
    updates["location"] = payload.location.strip() if payload.location else None
    updates["description"] = payload.description.strip() if payload.description else None
    updates["updated_at"] = iso(now_utc())

    await db.agenda.update_one({"id": agenda_id}, {"$set": updates})
    updated = await db.agenda.find_one({"id": agenda_id})
    return Agenda(**serialize_doc(updated))


@api_router.delete("/agenda/{agenda_id}")
async def delete_agenda(agenda_id: str, _: dict = Depends(require_media_admin)):
    result = await db.agenda.delete_one({"id": agenda_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Agenda tidak ditemukan")
    return {"message": "Agenda berhasil dihapus"}


# ---------------- Public Agenda (no auth) ----------------
@api_router.get("/public/agenda", response_model=List[PublicAgenda])
async def list_public_agenda():
    docs = (
        await db.agenda
        .find({"is_active": True})
        .sort("agenda_date", 1)
        .to_list(100)
    )
    return [PublicAgenda(**serialize_doc(d)) for d in docs]


# ---------------- Media Center ----------------
@api_router.get("/media", response_model=List[MediaItem])
async def list_media(_: dict = Depends(get_current_user)):
    docs = await db.media.find({}).sort("created_at", -1).to_list(500)
    return [MediaItem(**serialize_doc(d)) for d in docs]


@api_router.post("/media-upload")
async def upload_media_file(
    media: UploadFile = File(...),
    _: dict = Depends(require_media_admin),
):
    image_types = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
    }

    video_types = {
        "video/mp4": ".mp4",
        "video/webm": ".webm",
    }

    content_type = media.content_type or ""

    if content_type in image_types:
        media_type = "image"
        extension = image_types[content_type]
        max_size = 5 * 1024 * 1024
        max_size_label = "5 MB"
    elif content_type in video_types:
        media_type = "video"
        extension = video_types[content_type]
        max_size = 100 * 1024 * 1024
        max_size_label = "100 MB"
    else:
        raise HTTPException(
            status_code=400,
            detail="Format media harus JPG, PNG, WEBP, MP4, atau WEBM",
        )

    content = await media.read()

    if len(content) > max_size:
        raise HTTPException(
            status_code=400,
            detail=f"Ukuran {media_type} maksimal {max_size_label}",
        )

    filename = f"{uuid.uuid4().hex}{extension}"
    destination = UPLOAD_MEDIA_DIR / filename
    destination.write_bytes(content)

    return {
        "media_type": media_type,
        "media_url": f"/api/uploads/media/{filename}",
        "filename": filename,
        "content_type": content_type,
        "size": len(content),
    }


@api_router.post("/media-upload-multiple")
async def upload_multiple_media_files(
    files: List[UploadFile] = File(...),
    _: dict = Depends(require_media_admin),
):
    if not files:
        raise HTTPException(
            status_code=400,
            detail="Tidak ada file yang dipilih",
        )

    if len(files) > 30:
        raise HTTPException(
            status_code=400,
            detail="Maksimal 30 file dalam sekali upload",
        )

    image_types = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
    }

    video_types = {
        "video/mp4": ".mp4",
        "video/webm": ".webm",
        "video/quicktime": ".mov",
    }

    max_image_size = 5 * 1024 * 1024
    max_video_size = 150 * 1024 * 1024
    max_total_size = 500 * 1024 * 1024

    uploaded = []
    rejected = []
    total_size = 0

    for media in files:
        original_name = media.filename or "media"
        content_type = media.content_type or ""

        if content_type in image_types:
            media_type = "image"
            extension = image_types[content_type]
            max_size = max_image_size
            max_label = "5 MB"
        elif content_type in video_types:
            media_type = "video"
            extension = video_types[content_type]
            max_size = max_video_size
            max_label = "150 MB"
        else:
            rejected.append({
                "filename": original_name,
                "reason": "Format tidak didukung",
            })
            continue

        content = await media.read()
        size = len(content)

        if size == 0:
            rejected.append({
                "filename": original_name,
                "reason": "File kosong",
            })
            continue

        if size > max_size:
            rejected.append({
                "filename": original_name,
                "reason": f"Ukuran maksimal {max_label}",
            })
            continue

        if total_size + size > max_total_size:
            rejected.append({
                "filename": original_name,
                "reason": "Batas total upload 500 MB terlampaui",
            })
            continue

        filename = f"{uuid.uuid4().hex}{extension}"
        destination = UPLOAD_MEDIA_DIR / filename
        destination.write_bytes(content)

        total_size += size

        uploaded.append({
            "original_name": original_name,
            "filename": filename,
            "media_type": media_type,
            "media_url": f"/api/uploads/media/{filename}",
            "content_type": content_type,
            "size": size,
        })

    if not uploaded:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "Tidak ada file yang berhasil diunggah",
                "rejected": rejected,
            },
        )

    return {
        "message": "Upload dokumentasi selesai",
        "uploaded_count": len(uploaded),
        "rejected_count": len(rejected),
        "total_size": total_size,
        "uploaded": uploaded,
        "rejected": rejected,
    }


@api_router.get("/media/{media_id}", response_model=MediaItem)
async def get_media(media_id: str, _: dict = Depends(get_current_user)):
    doc = await db.media.find_one({"id": media_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Media tidak ditemukan")
    return MediaItem(**serialize_doc(doc))


@api_router.post("/media", response_model=MediaItem)
async def create_media(
    payload: MediaPayload,
    _: dict = Depends(require_media_admin),
):
    now = iso(now_utc())

    new_media = {
        "id": str(uuid.uuid4()),
        "title": payload.title.strip(),
        "description": payload.description.strip() if payload.description else None,
        "media_type": payload.media_type,
        "media_url": payload.media_url.strip(),
        "thumbnail_url": (
            payload.thumbnail_url.strip()
            if payload.thumbnail_url
            else None
        ),
        "event_date": payload.event_date,
        "category": payload.category.strip() if payload.category else "Kegiatan",
        "location": payload.location.strip() if payload.location else None,
        "is_featured": payload.is_featured,
        "is_published": payload.is_published,
        "created_at": now,
        "updated_at": now,
    }

    await db.media.insert_one(new_media)
    return MediaItem(**serialize_doc(new_media))


@api_router.patch("/media/{media_id}", response_model=MediaItem)
async def update_media(
    media_id: str,
    payload: MediaPayload,
    _: dict = Depends(require_media_admin),
):
    doc = await db.media.find_one({"id": media_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Media tidak ditemukan")

    updates = payload.model_dump()
    updates["title"] = payload.title.strip()
    updates["description"] = (
        payload.description.strip()
        if payload.description
        else None
    )
    updates["media_url"] = payload.media_url.strip()
    updates["thumbnail_url"] = (
        payload.thumbnail_url.strip()
        if payload.thumbnail_url
        else None
    )
    updates["category"] = (
        payload.category.strip()
        if payload.category
        else "Kegiatan"
    )
    updates["location"] = (
        payload.location.strip()
        if payload.location
        else None
    )
    updates["updated_at"] = iso(now_utc())

    await db.media.update_one(
        {"id": media_id},
        {"$set": updates},
    )

    updated = await db.media.find_one({"id": media_id})
    return MediaItem(**serialize_doc(updated))


@api_router.delete("/media/{media_id}")
async def delete_media(
    media_id: str,
    _: dict = Depends(require_media_admin),
):
    result = await db.media.delete_one({"id": media_id})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Media tidak ditemukan")

    return {"message": "Media berhasil dihapus"}


# ---------------- Public Media Center (no auth) ----------------
@api_router.get("/public/media", response_model=List[PublicMediaItem])
async def list_public_media():
    docs = (
        await db.media
        .find({"is_published": True})
        .sort("created_at", -1)
        .to_list(100)
    )
    return [PublicMediaItem(**serialize_doc(d)) for d in docs]


@api_router.get(
    "/public/media/{media_id}",
    response_model=PublicMediaItem,
)
async def get_public_media(media_id: str):
    doc = await db.media.find_one({
        "id": media_id,
        "is_published": True,
    })

    if not doc:
        raise HTTPException(status_code=404, detail="Media tidak ditemukan")

    return PublicMediaItem(**serialize_doc(doc))


# ---------------- Stats ----------------
@api_router.get("/stats", response_model=Stats)
async def get_stats(_: dict = Depends(get_current_user)):
    doc = await db.stats.find_one({"key": "global"}) or {}
    return Stats(**serialize_doc(doc))


@api_router.put("/stats", response_model=Stats)
async def update_stats(payload: StatsPayload, _: dict = Depends(require_super_admin)):
    updates = payload.model_dump()
    updates['updated_at'] = iso(now_utc())
    await db.stats.update_one({"key": "global"}, {"$set": updates}, upsert=True)
    doc = await db.stats.find_one({"key": "global"})
    return Stats(**serialize_doc(doc))


# ---------------- Links ----------------
@api_router.get("/links", response_model=Links)
async def get_links(_: dict = Depends(get_current_user)):
    doc = await db.links.find_one({"key": "global"}) or {}
    return Links(**serialize_doc(doc))


@api_router.put("/links", response_model=Links)
async def update_links(payload: LinksPayload, _: dict = Depends(require_super_admin)):
    updates = payload.model_dump()
    updates['updated_at'] = iso(now_utc())
    await db.links.update_one({"key": "global"}, {"$set": updates}, upsert=True)
    doc = await db.links.find_one({"key": "global"})
    return Links(**serialize_doc(doc))


# ---------------- Register router & CORS ----------------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()