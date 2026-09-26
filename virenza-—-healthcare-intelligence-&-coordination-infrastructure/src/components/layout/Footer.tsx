import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Server, FileText, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#22241F] text-[#FBFBF7] pt-14 pb-20 md:pb-12 border-t border-[#3A3831] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Col 1: Brand & Positioning */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-[#33352E] border border-[#48463D] flex items-center justify-center p-1">
                <svg viewBox="0 0 40 40" className="w-5 h-5">
                  <rect x="16" y="6" width="8" height="28" rx="2" fill="#3C7049" />
                  <rect x="6" y="16" width="28" height="8" rx="2" fill="#3C7049" />
                  <circle cx="20" cy="20" r="3.5" fill="#FBFBF7" />
                </svg>
              </div>
              <span className="font-semibold text-lg tracking-tight text-[#FBFBF7]">VIRENZA</span>
            </div>
            <p className="text-xs text-[#A6A298] max-w-sm leading-relaxed">
              Healthcare Intelligence & Coordination Infrastructure. An intelligent coordination layer connecting patients, clinicians, health systems, emergency operations and health data.
            </p>
            <div className="pt-2 text-[11px] font-mono text-[#8C887E] space-y-1">
              <div>Architecture: Modular Provider Abstraction • Web Crypto AES-256-GCM</div>
              <div>Auditability: Immutable Append-Only Ledger</div>
            </div>
          </div>

          {/* Col 2: Clinical & Operations */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#A6A298]">Platform Surfaces</h4>
            <ul className="space-y-2 text-xs text-[#CBC7BC]">
              <li><Link to="/app" className="hover:text-white transition-colors">Patient Intelligence</Link></li>
              <li><Link to="/app/vault" className="hover:text-white transition-colors">Encrypted Health Vault</Link></li>
              <li><Link to="/app/triage" className="hover:text-white transition-colors">AI Clinical Triage</Link></li>
              <li><Link to="/clinician" className="hover:text-white transition-colors">Clinician Command Center</Link></li>
              <li><Link to="/ops" className="hover:text-white transition-colors">Emergency Operations (EOC)</Link></li>
              <li><Link to="/ops/sentinel" className="hover:text-white transition-colors">SENTINEL Bio-Surveillance</Link></li>
            </ul>
          </div>

          {/* Col 3: Enterprise Sectors */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#A6A298]">Enterprise Buyers</h4>
            <ul className="space-y-2 text-xs text-[#CBC7BC]">
              <li><Link to="/enterprise/hospitals" className="hover:text-white transition-colors">Hospitals & Health Systems</Link></li>
              <li><Link to="/enterprise/insurers" className="hover:text-white transition-colors">Health Insurers & Payers</Link></li>
              <li><Link to="/enterprise/government" className="hover:text-white transition-colors">Government Public Health</Link></li>
              <li><Link to="/enterprise/emergency" className="hover:text-white transition-colors">Emergency Dispatch Services</Link></li>
              <li><Link to="/enterprise/startups" className="hover:text-white transition-colors">Healthcare Startups</Link></li>
              <li><Link to="/enterprise/ai-health" className="hover:text-white transition-colors">AI-Health Companies</Link></li>
              <li><Link to="/investors" className="hover:text-white transition-colors">Enterprise Partners & Investors</Link></li>
            </ul>
          </div>

          {/* Col 4: Trust & Architecture */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#A6A298]">Trust & Architecture</h4>
            <ul className="space-y-2 text-xs text-[#CBC7BC]">
              <li><Link to="/architecture" className="hover:text-white transition-colors">System Architecture</Link></li>
              <li><Link to="/security" className="hover:text-white transition-colors">Security & Cryptography</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Enterprise Licensing</Link></li>
              <li><Link to="/admin" className="hover:text-white transition-colors">Audit & Governance Ledger</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy & Data Governance</Link></li>
            </ul>
          </div>
        </div>

        {/* Truthful Software & Regulatory Notice */}
        <div className="mt-12 pt-8 border-t border-[#3A3831] text-[11px] text-[#8C887E] space-y-2 leading-relaxed">
          <p>
            <strong className="text-[#CBC7BC]">IMPORTANT NOTICE & TRUTHFUL SOFTWARE COMMITMENT:</strong> VIRENZA is demonstrating an enterprise healthcare intelligence and clinical coordination architecture. In this interactive environment, all patient histories, vital telemetry, facility bed numbers, epidemiological outbreak signals, claims records, and simulated SOS dispatches are strictly synthetic demonstration data.
          </p>
          <p>
            VIRENZA AI modules operate strictly under a human-in-the-loop clinical supervision model. AI-generated assessments are assistive decision-support signals and do not constitute autonomous medical diagnoses. In life-threatening emergencies, end users must contact local emergency services immediately.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 text-[#7A7568]">
            <div>© {new Date().getFullYear()} VIRENZA Health Technologies Inc. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <span>Designed for healthcare security requirements</span>
              <span>•</span>
              <span>Web Crypto AES-256-GCM Verified</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
