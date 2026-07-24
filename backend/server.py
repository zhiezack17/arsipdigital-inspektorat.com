"""
Portal Arsip Digital Inspektorat Kab. Rokan Hilir - Backend API.
FastAPI + MongoDB + JWT authentication.
"""
from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
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
    """Convert a title string to a URL-safe slug."""
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
Role = Literal['admin', 'auditor']


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
    is_published: bool = True
    author: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class NewsPayload(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    content: str = Field(min_length=3)
    category: Optional[str] = 'Pengumuman'
    is_published: bool = True


class PublicNews(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    slug: str
    title: str
    content: str
    category: Optional[str] = 'Pengumuman'
    author: Optional[str] = None
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


async def require_admin(current_user: dict = Depends(get_current_user)) -> dict:
    if current_user.get('role') != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Akses hanya untuk Admin")
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
            "role": "admin",
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
async def list_users(_: dict = Depends(require_admin)):
    users = await db.users.find({}, {"password_hash": 0}).sort("created_at", -1).to_list(1000)
    return [UserPublic(**serialize_doc(u)) for u in users]


@api_router.post("/users", response_model=UserPublic)
async def create_user(payload: CreateUserPayload, _: dict = Depends(require_admin)):
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
async def update_user(user_id: str, payload: UpdateUserPayload, current: dict = Depends(require_admin)):
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="Pengguna tidak ditemukan")
    updates = {k: v for k, v in payload.model_dump(exclude_none=True).items()}
    # Prevent admin from deactivating themselves or removing their own admin role
    if user_id == current['id']:
        if 'is_active' in updates and updates['is_active'] is False:
            raise HTTPException(status_code=400, detail="Tidak dapat menonaktifkan akun Anda sendiri")
        if 'role' in updates and updates['role'] != 'admin':
            raise HTTPException(status_code=400, detail="Tidak dapat mengubah peran akun Anda sendiri")
    if updates:
        updates['updated_at'] = iso(now_utc())
        await db.users.update_one({"id": user_id}, {"$set": updates})
    updated = await db.users.find_one({"id": user_id}, {"password_hash": 0})
    return UserPublic(**serialize_doc(updated))


@api_router.post("/users/{user_id}/reset-password")
async def reset_password(user_id: str, payload: ResetPasswordPayload, _: dict = Depends(require_admin)):
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="Pengguna tidak ditemukan")
    await db.users.update_one({"id": user_id}, {"$set": {
        "password_hash": hash_password(payload.new_password),
        "updated_at": iso(now_utc()),
    }})
    return {"message": "Kata sandi berhasil direset"}


@api_router.delete("/users/{user_id}")
async def delete_user(user_id: str, current: dict = Depends(require_admin)):
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


@api_router.get("/news/{news_id}", response_model=News)
async def get_news(news_id: str, _: dict = Depends(get_current_user)):
    doc = await db.news.find_one({"id": news_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Berita tidak ditemukan")
    return News(**serialize_doc(doc))


@api_router.post("/news", response_model=News)
async def create_news(payload: NewsPayload, current: dict = Depends(require_admin)):
    news_id = str(uuid.uuid4())
    slug = await generate_unique_slug(payload.title)
    new_news = {
        "id": news_id,
        "slug": slug,
        "title": payload.title.strip(),
        "content": payload.content.strip(),
        "category": (payload.category or "Pengumuman").strip(),
        "is_published": payload.is_published,
        "author": current.get('full_name') or current.get('username'),
        "created_at": iso(now_utc()),
        "updated_at": iso(now_utc()),
    }
    await db.news.insert_one(new_news)
    return News(**serialize_doc(new_news))


@api_router.patch("/news/{news_id}", response_model=News)
async def update_news(news_id: str, payload: NewsPayload, _: dict = Depends(require_admin)):
    doc = await db.news.find_one({"id": news_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Berita tidak ditemukan")
    updates = payload.model_dump()
    # Preserve existing slug; only generate if the document has none
    if not doc.get('slug'):
        updates['slug'] = await generate_unique_slug(payload.title, exclude_id=news_id)
    updates['updated_at'] = iso(now_utc())
    await db.news.update_one({"id": news_id}, {"$set": updates})
    updated = await db.news.find_one({"id": news_id})
    return News(**serialize_doc(updated))


@api_router.delete("/news/{news_id}")
async def delete_news(news_id: str, _: dict = Depends(require_admin)):
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


# ---------------- Stats ----------------
@api_router.get("/stats", response_model=Stats)
async def get_stats(_: dict = Depends(get_current_user)):
    doc = await db.stats.find_one({"key": "global"}) or {}
    return Stats(**serialize_doc(doc))


@api_router.put("/stats", response_model=Stats)
async def update_stats(payload: StatsPayload, _: dict = Depends(require_admin)):
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
async def update_links(payload: LinksPayload, _: dict = Depends(require_admin)):
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
