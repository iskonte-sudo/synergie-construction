import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import QuoteModal from './components/QuoteModal';
import { QuoteModalProvider } from './contexts/QuoteModalContext';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Simulator from './pages/Simulator';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

function Layout() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main className="pt-[110px] lg:pt-[112px]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:serviceId" element={<ServiceDetail />} />
          <Route path="/realisations" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/simulateur" element={<Simulator />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
      <QuoteModal />
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <QuoteModalProvider>
        <Layout />
      </QuoteModalProvider>
    </BrowserRouter>
  );
}
