import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Activity,
  FileText,
  Search,
  Menu,
  X,
  Stethoscope,
  Siren,
  Shield,
  Layers,
  ChevronDown,
  Lock,
  MessageSquare,
  Sparkles,
  Mic,
  MapPin,
} from 'lucide-react';
import { useSession } from '../../hooks/useSession';
import { PWAInstallButton } from '../ui/PWAInstallButton';
import { FirebaseAuthButton } from '../auth/FirebaseAuthButton';

export interface HeaderProps {
  onOpenCommandPalette: () => void;
  onOpenChatbot?: () => void;
  onOpenLiveVoice?: () => void;
  onOpenMultimodal?: (tab?: 'music' | 'image' | 'video' | 'transcribe' | 'grounding') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCommandPalette,
  onOpenChatbot,
  onOpenLiveVoice,
  onOpenMultimodal,
}) => {
  const { user } = useSession();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [enterpriseDropdown, setEnterpriseDropdown] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { label: 'Patient', path: '/app', icon: <Activity className="w-4 h-4" /> },
    { label: 'Clinician', path: '/clinician', icon: <Stethoscope className="w-4 h-4" /> },
    { label: 'Operations & EOC', path: '/ops', icon: <Siren className="w-4 h-4" /> },
    { label: 'Architecture', path: '/architecture', icon: <Layers className="w-4 h-4" /> },
    { label: 'Security', path: '/security', icon: <Lock className="w-4 h-4" /> },
  ];

  const enterpriseBuyers = [
    { label: 'Hospital & Health Systems', path: '/enterprise/hospitals', desc: 'Clinical flow & bed capacity coordination' },
    { label: 'Health Insurers & Payers', path: '/enterprise/insurers', desc: 'Population risk & claims intelligence' },
    { label: 'Government & Public Health', path: '/enterprise/government', desc: 'Regional bio-surveillance & SENTINEL' },
    { label: 'Emergency Medical Dispatch', path: '/enterprise/emergency', desc: 'State-machine SOS & hospital ingress' },
    { label: 'Healthcare Startups', path: '/enterprise/startups', desc: 'Modular infrastructure & FHIR APIs' },
    { label: 'AI-Health Companies', path: '/enterprise/ai-health', desc: 'Safety guardrail gateway & OCR models' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#FBFBF7]/95 backdrop-blur-md border-b border-[#E7E4DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-4 lg:gap-6">
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#F4F2EE] border border-[#E7E4DC] flex items-center justify-center p-1 group-hover:border-[#3C7049] transition-colors">
              <svg viewBox="0 0 40 40" className="w-6 h-6">
                <rect x="16" y="6" width="8" height="28" rx="2" fill="#3C7049" />
                <rect x="6" y="16" width="28" height="8" rx="2" fill="#3C7049" />
                <circle cx="20" cy="20" r="3.5" fill="#FBFBF7" stroke="#22241F" strokeWidth="1.5" />
              </svg>
            </div>
            <div>
              <span className="font-semibold tracking-tight text-base sm:text-lg text-[#22241F] font-sans">
                VIRENZA
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] font-mono text-[#7A7568] tracking-widest uppercase">
                Intelligence Grid
              </span>
            </div>
          </Link>

          {/* Enterprise Solutions Dropdown */}
          <div className="relative hidden xl:block">
            <button
              onClick={() => setEnterpriseDropdown(!enterpriseDropdown)}
              onMouseEnter={() => setEnterpriseDropdown(true)}
              className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
                location.pathname.startsWith('/enterprise')
                  ? 'bg-[#E7E4DC] text-[#22241F]'
                  : 'text-[#5A564C] hover:text-[#22241F] hover:bg-[#F4F2EE]'
              }`}
            >
              <span>Enterprise Sectors</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {enterpriseDropdown && (
              <div
                onMouseLeave={() => setEnterpriseDropdown(false)}
                className="absolute left-0 mt-1 w-80 bg-[#FBFBF7] rounded-xl shadow-xl border border-[#E7E4DC] p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-[#7A7568] border-b border-[#E7E4DC]">
                  Sector-Specific Command Solutions
                </div>
                <div className="mt-1 space-y-1">
                  {enterpriseBuyers.map((b) => (
                    <Link
                      key={b.path}
                      to={b.path}
                      onClick={() => setEnterpriseDropdown(false)}
                      className="block px-3 py-2 rounded-lg hover:bg-[#F4F2EE] transition-colors"
                    >
                      <div className="text-xs font-semibold text-[#22241F]">{b.label}</div>
                      <div className="text-[11px] text-[#7A7568] mt-0.5">{b.desc}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
                isActive(link.path)
                  ? 'bg-[#E7E4DC] text-[#22241F] font-semibold'
                  : 'text-[#5A564C] hover:text-[#22241F] hover:bg-[#F4F2EE]'
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Gemini AI & Firebase Auth Header Triggers */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Multimodal Studio Trigger */}
          {onOpenMultimodal && (
            <button
              onClick={() => onOpenMultimodal()}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#EAECE6] hover:bg-[#DDE0D8] text-[#2C5530] text-xs font-medium transition-colors"
              title="Open Multimodal Studio (Lyria, Veo, Flash Images, Transcribe, Grounding)"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Multimodal Studio</span>
            </button>
          )}

          {/* Gemini Chatbot Trigger */}
          {onOpenChatbot && (
            <button
              onClick={onOpenChatbot}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#F4F2EE] hover:bg-[#EAECE6] text-[#22241F] text-xs font-medium transition-colors border border-[#E7E4DC]"
              title="Gemini Multi-turn Chatbot (gemini-3.1-pro-preview, 3.5-flash, 3.1-flash-lite)"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#3C7049]" />
              <span className="hidden md:inline">Gemini Chat</span>
            </button>
          )}

          {/* Gemini Live Voice Trigger */}
          {onOpenLiveVoice && (
            <button
              onClick={onOpenLiveVoice}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#2C5530] hover:bg-[#234426] text-white text-xs font-medium transition-colors shadow-xs"
              title="Live Voice Conversation (gemini-3.1-flash-live-preview)"
            >
              <Mic className="w-3.5 h-3.5 animate-pulse" />
              <span className="hidden md:inline">Live Voice</span>
            </button>
          )}

          {/* Firebase Google Auth Button */}
          <FirebaseAuthButton />

          {/* Command Search Bar Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="hidden sm:flex items-center gap-2 bg-[#F4F2EE] hover:bg-[#EAE7DF] border border-[#E7E4DC] rounded-lg px-2.5 py-1.5 text-xs text-[#5A564C] hover:text-[#22241F] transition-colors"
            title="Search or jump to views (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-[#7A7568]" />
            <kbd className="hidden lg:inline-block font-mono text-[10px] bg-[#E7E4DC] text-[#5A564C] px-1 py-0.2 rounded">
              ⌘K
            </kbd>
          </button>

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg text-[#5A564C] hover:text-[#22241F] hover:bg-[#F4F2EE]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FBFBF7] border-b border-[#E7E4DC] px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top duration-150">
          <div className="text-[11px] font-mono uppercase text-[#7A7568] px-2 pt-2">
            Multimodal Intelligence
          </div>
          <div className="grid grid-cols-2 gap-2">
            {onOpenMultimodal && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenMultimodal();
                }}
                className="flex items-center gap-2 p-2 rounded-lg bg-[#EAECE6] text-xs font-medium text-[#2C5530]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Multimodal Studio</span>
              </button>
            )}
            {onOpenChatbot && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenChatbot();
                }}
                className="flex items-center gap-2 p-2 rounded-lg bg-[#F4F2EE] text-xs font-medium text-[#22241F]"
              >
                <MessageSquare className="w-4 h-4 text-[#3C7049]" />
                <span>Gemini Chat</span>
              </button>
            )}
            {onOpenLiveVoice && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLiveVoice();
                }}
                className="flex items-center gap-2 p-2 rounded-lg bg-[#2C5530] text-white text-xs font-medium col-span-2 justify-center"
              >
                <Mic className="w-4 h-4" />
                <span>Start Gemini Live Voice</span>
              </button>
            )}
          </div>

          <div className="text-[11px] font-mono uppercase text-[#7A7568] px-2 pt-2 border-t border-[#E7E4DC]">
            Primary Surfaces
          </div>
          <div className="grid grid-cols-2 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium ${
                  isActive(link.path)
                    ? 'bg-[#E7E4DC] text-[#22241F] font-semibold'
                    : 'text-[#5A564C] hover:bg-[#F4F2EE]'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="text-[11px] font-mono uppercase text-[#7A7568] px-2 pt-2 border-t border-[#E7E4DC]">
            Enterprise Sectors
          </div>
          <div className="space-y-1">
            {enterpriseBuyers.map((b) => (
              <Link
                key={b.path}
                to={b.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block p-2 rounded-lg text-xs text-[#22241F] hover:bg-[#F4F2EE]"
              >
                <div className="font-semibold">{b.label}</div>
                <div className="text-[11px] text-[#7A7568]">{b.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

