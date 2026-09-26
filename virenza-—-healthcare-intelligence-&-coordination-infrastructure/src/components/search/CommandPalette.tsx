import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Heart, Activity, AlertTriangle, Shield, X, ArrowRight } from 'lucide-react';
import { store } from '../../services/store';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // toggle
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Search sources
  const docs = store.getDocuments().filter((d) => !q || d.title.toLowerCase().includes(q) || d.tags.some((t) => t.includes(q)));
  const queue = store.getPatientQueue().filter((p) => !q || p.patientName.toLowerCase().includes(q) || p.mrn.toLowerCase().includes(q) || p.chiefComplaint.toLowerCase().includes(q));
  const signals = store.getSentinelSignals().filter((s) => !q || s.pathogen.toLowerCase().includes(q) || s.region.toLowerCase().includes(q));

  const navigationItems = [
    { label: 'Patient Dashboard & Health Timeline', path: '/app', icon: <Heart className="w-4 h-4 text-[#3C7049]" />, category: 'Navigation' },
    { label: 'Adaptive AI Clinical Triage', path: '/app/triage', icon: <Activity className="w-4 h-4 text-[#3E6B8E]" />, category: 'Navigation' },
    { label: 'Encrypted Health Vault (AES-256-GCM)', path: '/app/vault', icon: <FileText className="w-4 h-4 text-[#3C7049]" />, category: 'Navigation' },
    { label: 'Emergency SOS & Telemetry Portal', path: '/app/emergency', icon: <AlertTriangle className="w-4 h-4 text-[#B03A28]" />, category: 'Navigation' },
    { label: 'Clinician Command Center (Three-Pane)', path: '/clinician', icon: <Activity className="w-4 h-4 text-[#3E6B8E]" />, category: 'Navigation' },
    { label: 'Emergency Operations & Dispatch (EOC)', path: '/ops', icon: <AlertTriangle className="w-4 h-4 text-[#B03A28]" />, category: 'Navigation' },
    { label: 'SENTINEL Global Bio-Surveillance', path: '/ops/sentinel', icon: <Shield className="w-4 h-4 text-[#B8822E]" />, category: 'Navigation' },
    { label: 'Insurer Health Risk & Claims Grid', path: '/enterprise/insurers', icon: <Shield className="w-4 h-4 text-[#3C7049]" />, category: 'Navigation' },
    { label: 'Government & Directorate Health Ops', path: '/enterprise/government', icon: <Shield className="w-4 h-4 text-[#5A564C]" />, category: 'Navigation' },
    { label: 'Enterprise Security & Cryptography Model', path: '/security', icon: <Shield className="w-4 h-4 text-[#3C7049]" />, category: 'Navigation' },
    { label: 'System Architecture & Provider Layer', path: '/architecture', icon: <Activity className="w-4 h-4 text-[#3E6B8E]" />, category: 'Navigation' },
    { label: 'Enterprise Governance & Audit Ledger', path: '/admin', icon: <Shield className="w-4 h-4 text-[#22241F]" />, category: 'Navigation' },
  ].filter((item) => !q || item.label.toLowerCase().includes(q));

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-[#22241F]/40 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#FBFBF7] border border-[#E7E4DC] rounded-xl shadow-[0_20px_50px_rgba(34,36,31,0.2)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3.5 border-b border-[#E7E4DC] bg-[#F4F2EE]">
          <Search className="w-5 h-5 text-[#5A564C] mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patients, encrypted documents, clinical notes, signals, or jump to route..."
            autoFocus
            className="w-full bg-transparent text-sm text-[#22241F] placeholder-[#7A7568] focus:outline-hidden"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-[#7A7568] hover:text-[#22241F]">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-4">
          {/* Navigation matches */}
          {navigationItems.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-mono uppercase text-[#7A7568]">
                Navigation & Views
              </div>
              <div className="mt-1 space-y-0.5">
                {navigationItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleSelect(item.path)}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between hover:bg-[#F4F2EE] transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span className="font-medium text-[#22241F]">{item.label}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#A6A298] group-hover:text-[#22241F] transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Patients */}
          {queue.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-mono uppercase text-[#7A7568]">
                Patients & Clinical Queue
              </div>
              <div className="mt-1 space-y-0.5">
                {queue.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelect('/clinician')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between hover:bg-[#F4F2EE] transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-[#22241F] flex items-center gap-2">
                        <span>{p.patientName}</span>
                        <span className="font-mono text-[10px] text-[#7A7568] bg-[#E7E4DC] px-1.5 py-0.2 rounded">
                          {p.mrn}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5A564C] mt-0.5 truncate">{p.chiefComplaint}</p>
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#DDE8F0] text-[#1E435E]">
                      {p.acuityLevel}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Documents in Vault */}
          {docs.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-mono uppercase text-[#7A7568]">
                Health Vault Documents (Encrypted)
              </div>
              <div className="mt-1 space-y-0.5">
                {docs.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => handleSelect('/app/vault')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between hover:bg-[#F4F2EE] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#3C7049]" />
                      <div>
                        <span className="font-semibold text-[#22241F]">{d.title}</span>
                        <p className="text-[11px] text-[#7A7568]">{d.summary}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#D9EBDE] text-[#224A2C]">
                      AES-256
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sentinel Signals */}
          {signals.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-mono uppercase text-[#7A7568]">
                SENTINEL Bio-Surveillance Signals
              </div>
              <div className="mt-1 space-y-0.5">
                {signals.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelect('/ops/sentinel')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between hover:bg-[#F4F2EE] transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-[#22241F]">{s.pathogen}</span>
                      <p className="text-[11px] text-[#5A564C]">{s.region} • {s.casesReported} reported cases</p>
                    </div>
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                        s.threatLevel === 'HIGH' ? 'bg-[#FBE9E7] text-[#B03A28]' : 'bg-[#FBF3DE] text-[#B8822E]'
                      }`}
                    >
                      {s.threatLevel}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-2 bg-[#F4F2EE] border-t border-[#E7E4DC] flex items-center justify-between text-[11px] font-mono text-[#7A7568]">
          <span>Use ESC to close</span>
          <span>Press ⌘K or Ctrl+K to toggle anytime</span>
        </div>
      </div>
    </div>
  );
};
