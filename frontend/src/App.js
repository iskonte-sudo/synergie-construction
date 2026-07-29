import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import QuoteModal from './components/QuoteModal';
import { QuoteModalProvider } from './contexts/QuoteModalContext';
import { AuthProvider } from './contexts/AuthContext';
import api from './lib/api';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Simulator from './pages/Simulator';

import AdminLogin from './pages/admin/Login';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminQuotes from './pages/admin/Quotes';
import AdminMessages from './pages/admin/Messages';
import AdminSimulations from './pages/admin/Simulations';
import AdminSimulatorConfig from './pages/admin/SimulatorConfig';
import AdminBlog from './pages/admin/Blog';
import AdminContent from './pages/admin/Content';
import { AdminSlides, AdminTestimonials, AdminFAQs, AdminTeam, AdminPartners, AdminMenuItems } from './pages/admin/CrudPages';
import AdminProjects from './pages/admin/Projects';
import AdminServices from './pages/admin/Services';
import AdminUsers from './pages/admin/Users';
import AdminSettings from './pages/admin/Settings';
import AdminMedia from './pages/admin/Media';
import AdminAuditLogs from './pages/admin/AuditLogs';
import AdminProfile from './pages/admin/Profile';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

function VisitTracker() {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;
    api.post('/public/visits', {
      path: location.pathname,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
    }).catch(() => {});
  }, [location.pathname]);
  return null;
}

function PublicLayout({ children }) {
  return (
    <>
      <ScrollToTop />
      <VisitTracker />
      <Header />
      <main className="pt-[110px] lg:pt-[112px]">{children}</main>
      <Footer />
      <WhatsAppButton />
      <QuoteModal />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <QuoteModalProvider>
          <Routes>
            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="devis" element={<AdminQuotes />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="simulations" element={<AdminSimulations />} />
              <Route path="simulateur-config" element={<AdminSimulatorConfig />} />
              <Route path="slider" element={<AdminSlides />} />
              <Route path="temoignages" element={<AdminTestimonials />} />
              <Route path="faq" element={<AdminFAQs />} />
              <Route path="equipe" element={<AdminTeam />} />
              <Route path="partenaires" element={<AdminPartners />} />
              <Route path="menus" element={<AdminMenuItems />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="contenu" element={<AdminContent />} />
              <Route path="projets" element={<AdminProjects />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="utilisateurs" element={<AdminUsers />} />
              <Route path="parametres" element={<AdminSettings />} />
              <Route path="media" element={<AdminMedia />} />
              <Route path="journal" element={<AdminAuditLogs />} />
              <Route path="profil" element={<AdminProfile />} />
            </Route>

            {/* Public site */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/a-propos" element={<PublicLayout><About /></PublicLayout>} />
            <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
            <Route path="/services/:serviceId" element={<PublicLayout><ServiceDetail /></PublicLayout>} />
            <Route path="/realisations" element={<PublicLayout><Projects /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
            <Route path="/simulateur" element={<PublicLayout><Simulator /></PublicLayout>} />
            <Route path="*" element={<PublicLayout><Home /></PublicLayout>} />
          </Routes>
          <Toaster position="top-right" richColors closeButton />
        </QuoteModalProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
