import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, FileText, Stethoscope, AlertTriangle, Cpu } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const location = useLocation();

  const items = [
    { label: 'Patient', path: '/app', icon: <Activity className="w-5 h-5" /> },
    { label: 'Triage', path: '/app/triage', icon: <Cpu className="w-5 h-5" /> },
    { label: 'Vault', path: '/app/vault', icon: <FileText className="w-5 h-5" /> },
    { label: 'Clinician', path: '/clinician', icon: <Stethoscope className="w-5 h-5" /> },
    { label: 'SOS', path: '/app/emergency', icon: <AlertTriangle className="w-5 h-5 text-[#B03A28]" /> },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FBFBF7]/95 backdrop-blur-md border-t border-[#E7E4DC] px-2 py-1 flex items-center justify-around shadow-[0_-4px_16px_rgba(34,36,31,0.06)]"
    >
      {items.map((item) => {
        const isActive =
          item.path === '/app'
            ? location.pathname === '/app'
            : location.pathname.startsWith(item.path);

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg min-w-[56px] text-[10px] font-medium transition-colors ${
              isActive
                ? 'text-[#3C7049] font-semibold'
                : 'text-[#5A564C] hover:text-[#22241F]'
            }`}
          >
            <span className={isActive ? 'text-[#3C7049]' : ''}>{item.icon}</span>
            <span className="mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
