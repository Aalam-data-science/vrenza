import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';
import { DemoBanner } from './components/ui/DemoBanner';
import { CommandPalette } from './components/search/CommandPalette';
import { OfflineIndicator } from './components/ui/OfflineIndicator';
import { ToastContainer } from './components/ui/ToastContainer';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

// AI Intelligence Modals
import { GeminiChatbotModal } from './components/ai/GeminiChatbotModal';
import { LiveVoiceModal } from './components/ai/LiveVoiceModal';
import { MultimodalStudioModal } from './components/ai/MultimodalStudioModal';
import { MessageSquare, Mic, Sparkles } from 'lucide-react';

// Pages
import { HomePage } from './pages/public/HomePage';
import { ArchitecturePage } from './pages/public/ArchitecturePage';
import { SecurityPage } from './pages/public/SecurityPage';
import { PricingPage } from './pages/public/PricingPage';
import { PrivacyCenterPage } from './pages/public/PrivacyCenterPage';

import { PatientDashboard } from './pages/patient/PatientDashboard';
import { TriagePage } from './pages/patient/TriagePage';
import { VaultPage } from './pages/patient/VaultPage';
import { EmergencyPage } from './pages/patient/EmergencyPage';

import { ClinicianCommandCenter } from './pages/clinician/ClinicianCommandCenter';
import { EmergencyOperationsPage } from './pages/operations/EmergencyOperationsPage';
import { SentinelPage } from './pages/operations/SentinelPage';

import { HospitalEnterprisePage } from './pages/enterprise/HospitalEnterprisePage';
import { InsurerEnterprisePage } from './pages/enterprise/InsurerEnterprisePage';
import { GovernmentEnterprisePage } from './pages/enterprise/GovernmentEnterprisePage';
import { EmergencyEnterprisePage } from './pages/enterprise/EmergencyEnterprisePage';
import { StartupsEnterprisePage } from './pages/enterprise/StartupsEnterprisePage';
import { AIHealthEnterprisePage } from './pages/enterprise/AIHealthEnterprisePage';
import { InvestorsPage } from './pages/enterprise/InvestorsPage';

import { AdminGovernancePage } from './pages/admin/AdminGovernancePage';

// Scroll to top on route change helper
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [liveVoiceOpen, setLiveVoiceOpen] = useState(false);
  const [multimodalOpen, setMultimodalOpen] = useState(false);
  const [multimodalDefaultTab, setMultimodalDefaultTab] = useState<'music' | 'image' | 'video' | 'transcribe' | 'grounding'>('music');

  // Global hotkey handler for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openMultimodalWithTab = (tab: 'music' | 'image' | 'video' | 'transcribe' | 'grounding' = 'music') => {
    setMultimodalDefaultTab(tab);
    setMultimodalOpen(true);
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-[#F5F5F0] text-[#22241F] font-sans">
        {/* Offline network status banner */}
        <OfflineIndicator />

        {/* Demo persona switcher & synthetic environment indicator */}
        <DemoBanner />

        {/* Enterprise top navigation header with Gemini & Firebase triggers */}
        <Header
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onOpenChatbot={() => setChatbotOpen(true)}
          onOpenLiveVoice={() => setLiveVoiceOpen(true)}
          onOpenMultimodal={openMultimodalWithTab}
        />

        {/* Primary Page Canvas */}
        <main className="flex-1 pb-20 md:pb-12">
          <ErrorBoundary>
            <Routes>
              {/* Public Solutions & Architectural Dossiers */}
              <Route path="/" element={<HomePage />} />
              <Route path="/architecture" element={<ArchitecturePage />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/privacy" element={<PrivacyCenterPage />} />

              {/* Patient Portal & Sovereign Cryptographic Vault */}
              <Route path="/app" element={<PatientDashboard />} />
              <Route path="/app/triage" element={<TriagePage />} />
              <Route path="/app/vault" element={<VaultPage />} />
              <Route path="/app/emergency" element={<EmergencyPage />} />

              {/* Clinician Decision Support Center */}
              <Route path="/clinician" element={<ClinicianCommandCenter />} />

              {/* Operational Consoles */}
              <Route path="/ops" element={<EmergencyOperationsPage />} />
              <Route path="/ops/sentinel" element={<SentinelPage />} />

              {/* Enterprise Sector Portals */}
              <Route path="/enterprise/hospitals" element={<HospitalEnterprisePage />} />
              <Route path="/enterprise/insurers" element={<InsurerEnterprisePage />} />
              <Route path="/enterprise/government" element={<GovernmentEnterprisePage />} />
              <Route path="/enterprise/emergency" element={<EmergencyEnterprisePage />} />
              <Route path="/enterprise/startups" element={<StartupsEnterprisePage />} />
              <Route path="/enterprise/ai-health" element={<AIHealthEnterprisePage />} />
              <Route path="/investors" element={<InvestorsPage />} />

              {/* Administration, RBAC & Audit */}
              <Route path="/admin" element={<AdminGovernancePage />} />

              {/* Fallback */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </ErrorBoundary>
        </main>

        {/* Persistent Floating AI Launcher Pill */}
        <div className="fixed bottom-6 right-6 z-40 hidden md:flex items-center gap-1.5 p-1.5 bg-[#FBFBF7]/95 backdrop-blur-md rounded-full border border-[#E7E4DC] shadow-lg">
          <button
            onClick={() => setChatbotOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4F2EE] hover:bg-[#EAECE6] text-xs font-medium text-[#22241F] transition-all"
            title="Open Gemini Clinical Chatbot"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#3C7049]" />
            <span>Chat</span>
          </button>
          <button
            onClick={() => setLiveVoiceOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2C5530] hover:bg-[#234426] text-xs font-medium text-white shadow-xs transition-all"
            title="Start Gemini Live Voice Call"
          >
            <Mic className="w-3.5 h-3.5 animate-pulse" />
            <span>Live Voice</span>
          </button>
          <button
            onClick={() => openMultimodalWithTab('music')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EAECE6] hover:bg-[#DDE0D8] text-xs font-medium text-[#2C5530] transition-all"
            title="Open Multimodal Studio"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Studio</span>
          </button>
        </div>

        {/* Enterprise Footer */}
        <Footer />

        {/* Mobile One-Handed Bottom Nav */}
        <MobileNav onOpenCommandPalette={() => setCommandPaletteOpen(true)} />

        {/* Command Palette Modal */}
        <CommandPalette
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
        />

        {/* Gemini Chatbot Modal */}
        <GeminiChatbotModal
          isOpen={chatbotOpen}
          onClose={() => setChatbotOpen(false)}
        />

        {/* Live Voice Modal */}
        <LiveVoiceModal
          isOpen={liveVoiceOpen}
          onClose={() => setLiveVoiceOpen(false)}
        />

        {/* Multimodal Studio Modal */}
        <MultimodalStudioModal
          isOpen={multimodalOpen}
          onClose={() => setMultimodalOpen(false)}
          defaultTab={multimodalDefaultTab}
        />

        {/* Global Toast Notification Stack */}
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}

