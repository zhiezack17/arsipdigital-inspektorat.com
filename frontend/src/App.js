import React from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Toaster } from '@/components/ui/sonner';

import LoginPage from '@/pages/Login';
import DashboardPage from '@/pages/Dashboard';
import ProfilePage from '@/pages/Profile';
import AdminLayout from '@/pages/admin/AdminLayout';
import AdminUsersPage from '@/pages/admin/AdminUsers';
import AdminNewsPage from '@/pages/admin/AdminNews';
import AdminAgendaPage from '@/pages/admin/AdminAgenda';
import AdminMediaPage from '@/pages/admin/AdminMedia';
import AdminStatsPage from '@/pages/admin/AdminStats';
import AdminLinksPage from '@/pages/admin/AdminLinks';
import PublicHomePage from '@/pages/PublicHome';
import PublicNewsListPage from '@/pages/PublicNewsList';
import PublicNewsDetailPage from '@/pages/PublicNewsDetail';
import PublicProfilePage from '@/pages/PublicProfile';
import PublicRegulationsPage from '@/pages/PublicRegulations';
import PublicGalleryPage from '@/pages/PublicGallery';

function App() {
    return (
        <div className="App">
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Public routes — no login required */}
                        <Route path="/" element={<PublicHomePage />} />
                        <Route path="/profil" element={<PublicProfilePage />} />
                        <Route path="/regulasi" element={<PublicRegulationsPage />} />
                        <Route path="/galeri" element={<PublicGalleryPage />} />
                        <Route path="/berita" element={<PublicNewsListPage />} />
                        <Route path="/berita/:slug" element={<PublicNewsDetailPage />} />

                        <Route path="/login" element={<LoginPage />} />

                        {/* Protected internal routes */}
                        <Route
                            path="/dashboard"
                            element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
                        />
                        <Route
                            path="/profile"
                            element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
                        />

                        <Route
                            path="/admin"
                            element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}
                        >
                            <Route index element={<Navigate to="/admin/news" replace />} />
                            <Route path="users" element={<AdminUsersPage />} />
                            <Route path="news" element={<AdminNewsPage />} />
                            <Route path="media" element={<AdminMediaPage />} />
                            <Route path="agenda" element={<AdminAgendaPage />} />
                            <Route path="stats" element={<AdminStatsPage />} />
                            <Route path="links" element={<AdminLinksPage />} />
                        </Route>

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </BrowserRouter>
                <Toaster position="top-right" richColors closeButton />
            </AuthProvider>
        </div>
    );
}

export default App;
