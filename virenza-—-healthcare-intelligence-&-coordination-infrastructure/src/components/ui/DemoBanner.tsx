import React, { useState } from 'react';
import { Shield, RotateCcw, Globe, UserCheck, ChevronDown } from 'lucide-react';
import { useSession } from '../../hooks/useSession';
import { DEMO_USERS } from '../../data/seed';
import { store } from '../../services/store';
import { useI18n, SupportedLanguage } from '../../i18n';
import { toast } from '../../hooks/useToast';

export const DemoBanner: React.FC = () => {
  const { user, switchRole } = useSession();
  const { lang, setLanguage, t } = useI18n();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const handleSwitch = (email: string) => {
    switchRole(email);
    setShowRoleMenu(false);
    toast({
      type: 'SUCCESS',
      title: 'Switched Enterprise Persona',
      message: `Active user set to ${email}. Organizational permissions loaded.`,
    });
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo state back to pristine synthetic seed baseline?')) {
      store.resetAll();
      toast({
        type: 'INFO',
        title: 'Demo Environment Reset',
        message: 'Persistent state reset to initial seed values.',
      });
      window.location.reload();
    }
  };

  const languages: { code: SupportedLanguage; label: string }[] = [
    { code: 'en', label: 'English (US)' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'es', label: 'Español (ES)' },
    { code: 'ar', label: 'العربية (Arabic)' },
    { code: 'fr', label: 'Français (FR)' },
  ];

  return (
    <div className="bg-[#22241F] text-[#FBFBF7] text-xs px-3 sm:px-6 py-2 border-b border-[#3A3831] flex flex-wrap items-center justify-between gap-2 z-40 relative">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 font-mono text-[11px] bg-[#3C7049] text-white px-2 py-0.5 rounded font-semibold tracking-wider uppercase">
          <Shield className="w-3 h-3" />
          <span>Demo Environment</span>
        </div>
        <span className="hidden md:inline text-[#A6A298] text-[11px]">
          {t('demoModeNotice')}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleMenu(!showRoleMenu);
              setShowLangMenu(false);
            }}
            className="flex items-center gap-1.5 bg-[#33352E] hover:bg-[#3E4038] text-[#FBFBF7] px-2.5 py-1 rounded text-xs transition-colors border border-[#48463D]"
            title="Switch Persona / Role"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#3C7049]" />
            <span className="font-medium truncate max-w-[130px] sm:max-w-[200px]">
              {user ? `${user.name} (${user.role.replace('_', ' ')})` : 'Select Role'}
            </span>
            <ChevronDown className="w-3 h-3 text-[#A6A298]" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-1.5 w-72 bg-[#FBFBF7] text-[#22241F] rounded-lg shadow-xl border border-[#E7E4DC] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1 text-[11px] font-mono uppercase text-[#7A7568] border-b border-[#E7E4DC]">
                Switch Enterprise Persona
              </div>
              <div className="max-h-72 overflow-y-auto py-1">
                {DEMO_USERS.map((u) => {
                  const isActive = user?.id === u.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => handleSwitch(u.email)}
                      className={`w-full text-left px-3 py-2 text-xs flex flex-col hover:bg-[#F4F2EE] transition-colors ${
                        isActive ? 'bg-[#D9EBDE]/40 border-l-2 border-[#3C7049]' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#22241F]">{u.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#E7E4DC] text-[#5A564C]">
                          {u.role.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#5A564C] truncate">{u.title || u.department}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Language selector */}
        <div className="relative">
          <button
            onClick={() => {
              setShowLangMenu(!showLangMenu);
              setShowRoleMenu(false);
            }}
            className="flex items-center gap-1 bg-[#33352E] hover:bg-[#3E4038] text-[#FBFBF7] px-2 py-1 rounded text-xs transition-colors border border-[#48463D]"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-[#3E6B8E]" />
            <span className="uppercase font-mono text-[11px]">{lang}</span>
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-1.5 w-36 bg-[#FBFBF7] text-[#22241F] rounded-lg shadow-xl border border-[#E7E4DC] py-1 z-50">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguage(l.code);
                    setShowLangMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#F4F2EE] transition-colors ${
                    lang === l.code ? 'font-semibold text-[#3C7049]' : ''
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reset State button */}
        <button
          onClick={handleReset}
          className="p-1 rounded text-[#A6A298] hover:text-[#FBFBF7] hover:bg-[#33352E] transition-colors"
          title="Reset Demo Data to Baseline"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
