import React, { useState } from 'react';
import { Download, Share, X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as installed standalone PWA, hide
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#3C7049] text-white hover:bg-[#325d3d] transition-colors shadow-xs ${className}`}
        title="Install VIRENZA to your desktop or home screen"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install PWA</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#E7E4DC] bg-[#F4F2EE] text-[#22241F] hover:bg-[#EAE7DF] transition-colors ${className}`}
        >
          <Share className="w-3.5 h-3.5 text-[#3C7049]" />
          <span>Add to Home Screen</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#22241F]/40 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-xl bg-[#FBFBF7] border border-[#E7E4DC] p-6 shadow-xl text-[#22241F]">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Install VIRENZA on iOS</h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-[#7A7568] hover:text-[#22241F]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-3 text-xs text-[#5A564C] leading-relaxed">
                To install VIRENZA as a standalone native-grade app on your iPhone or iPad:
              </p>
              <ol className="mt-3 space-y-2 text-xs text-[#22241F] list-decimal list-inside bg-[#F4F2EE] p-3.5 rounded-lg border border-[#E7E4DC]">
                <li>Tap the <strong>Share</strong> button in Safari toolbar.</li>
                <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
                <li>Confirm to launch directly from your home screen with offline caching.</li>
              </ol>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-lg bg-[#3C7049] py-2 text-xs font-medium text-white hover:bg-[#325d3d]"
              >
                Understood
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
