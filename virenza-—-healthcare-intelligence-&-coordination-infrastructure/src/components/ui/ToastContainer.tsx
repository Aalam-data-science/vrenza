import React from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export const ToastContainer: React.FC = () => {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        const borderColors = {
          SUCCESS: 'border-l-4 border-l-[#3C7049]',
          WARNING: 'border-l-4 border-l-[#B8822E]',
          EMERGENCY: 'border-l-4 border-l-[#B03A28]',
          INFO: 'border-l-4 border-l-[#3E6B8E]',
        };

        const icons = {
          SUCCESS: <CheckCircle className="w-4 h-4 text-[#3C7049] shrink-0" />,
          WARNING: <AlertTriangle className="w-4 h-4 text-[#B8822E] shrink-0" />,
          EMERGENCY: <AlertTriangle className="w-4 h-4 text-[#B03A28] shrink-0" />,
          INFO: <Info className="w-4 h-4 text-[#3E6B8E] shrink-0" />,
        };

        return (
          <div
            key={t.id}
            className={`pointer-events-auto bg-[#FBFBF7] border border-[#E7E4DC] p-3.5 rounded-lg shadow-lg flex items-start justify-between gap-3 animate-in slide-in-from-right-2 duration-150 ${borderColors[t.type]}`}
          >
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5">{icons[t.type]}</span>
              <div>
                <h4 className="text-xs font-semibold text-[#22241F]">{t.title}</h4>
                <p className="text-xs text-[#5A564C] mt-0.5 leading-normal">{t.message}</p>
              </div>
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="text-[#7A7568] hover:text-[#22241F] p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
