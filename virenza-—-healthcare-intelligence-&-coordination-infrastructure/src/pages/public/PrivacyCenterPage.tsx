import React, { useState } from 'react';
import { Shield, Lock, Trash2, Download, CheckCircle, RefreshCw, Key } from 'lucide-react';
import { store } from '../../services/store';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { toast } from '../../hooks/useToast';

export const PrivacyCenterPage: React.FC = () => {
  const [tokens, setTokens] = useState(store.getShareTokens());
  const [consents, setConsents] = useState({
    shareWithPCP: true,
    sentinelAnonymizedSurveillance: true,
    emergencyBeaconIngress: true,
    clinicalTrialMatching: false,
  });

  const handleToggleConsent = (key: keyof typeof consents) => {
    const updated = { ...consents, [key]: !consents[key] };
    setConsents(updated);
    toast({
      type: 'INFO',
      title: 'Consent Preference Updated',
      message: `Direct telemetry sharing preference updated.`,
    });
  };

  const handleRevokeToken = (tokenId: string) => {
    store.revokeShareToken(tokenId);
    setTokens(store.getShareTokens());
    toast({
      type: 'INFO',
      title: 'Access Token Revoked',
      message: 'Cryptographic access severed immediately.',
    });
  };

  const handlePurgeLocalData = () => {
    store.resetToSeed();
    setTokens(store.getShareTokens());
    toast({
      type: 'SUCCESS',
      title: 'Local Sandbox Reset',
      message: 'All local session keys and mock state refreshed to pristine baseline.',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-[#E7E4DC] pb-4">
        <Badge variant="clinical" size="sm">
          Patient Sovereign Data Controls
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-[#22241F] mt-1">
          Privacy & Consent Governance Center
        </h1>
        <p className="text-xs sm:text-sm text-[#5A564C] mt-1">
          You retain complete ownership of your health records. Review, modify, or sever third-party authorizations at will.
        </p>
      </div>

      {/* Consent Toggles */}
      <Card padding="md" variant="surface" className="space-y-4">
        <h3 className="text-sm font-semibold text-[#22241F] border-b border-[#E7E4DC] pb-2">
          Active Data Transmission Authorizations
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between py-1">
            <div>
              <span className="font-semibold text-[#22241F] block">Primary Physician Vitals Stream</span>
              <p className="text-[11px] text-[#5A564C]">Permits Dr. Marcus Vance to receive ambient blood pressure and medication logs.</p>
            </div>
            <button
              onClick={() => handleToggleConsent('shareWithPCP')}
              className={`px-3 py-1 rounded font-mono font-semibold transition-colors ${
                consents.shareWithPCP ? 'bg-[#3C7049] text-white' : 'bg-[#E7E4DC] text-[#7A7568]'
              }`}
            >
              {consents.shareWithPCP ? 'ACTIVE' : 'PAUSED'}
            </button>
          </div>

          <div className="flex items-center justify-between py-1 border-t border-[#E7E4DC]/60">
            <div>
              <span className="font-semibold text-[#22241F] block">SENTINEL De-Identified Surveillance</span>
              <p className="text-[11px] text-[#5A564C]">Applies differential privacy noise to aggregate regional symptom signals for outbreak prevention.</p>
            </div>
            <button
              onClick={() => handleToggleConsent('sentinelAnonymizedSurveillance')}
              className={`px-3 py-1 rounded font-mono font-semibold transition-colors ${
                consents.sentinelAnonymizedSurveillance ? 'bg-[#3C7049] text-white' : 'bg-[#E7E4DC] text-[#7A7568]'
              }`}
            >
              {consents.sentinelAnonymizedSurveillance ? 'ACTIVE' : 'PAUSED'}
            </button>
          </div>

          <div className="flex items-center justify-between py-1 border-t border-[#E7E4DC]/60">
            <div>
              <span className="font-semibold text-[#22241F] block">Emergency Beacon Telemetry Ingress</span>
              <p className="text-[11px] text-[#5A564C]">Allows automatic transmission of severe allergies and GPS coords only during active SOS states.</p>
            </div>
            <button
              onClick={() => handleToggleConsent('emergencyBeaconIngress')}
              className={`px-3 py-1 rounded font-mono font-semibold transition-colors ${
                consents.emergencyBeaconIngress ? 'bg-[#3C7049] text-white' : 'bg-[#E7E4DC] text-[#7A7568]'
              }`}
            >
              {consents.emergencyBeaconIngress ? 'ACTIVE' : 'PAUSED'}
            </button>
          </div>
        </div>
      </Card>

      {/* Share Tokens Ledger */}
      <Card padding="md" variant="surface" className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#E7E4DC] pb-2">
          <h3 className="text-sm font-semibold text-[#22241F]">
            Active Third-Party Share Tokens
          </h3>
          <span className="text-[10px] font-mono text-[#7A7568]">Cryptographic Zero-Trust</span>
        </div>

        <div className="space-y-2 text-xs">
          {tokens.map((tok) => (
            <div
              key={tok.id}
              className="p-3 bg-[#F4F2EE] border border-[#E7E4DC] rounded-lg flex items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#22241F]">{tok.recipientName}</span>
                  <Badge variant={tok.isRevoked ? 'neutral' : 'clinical'} size="xs">
                    {tok.isRevoked ? 'REVOKED' : 'AUTHORIZED'}
                  </Badge>
                </div>
                <div className="font-mono text-[10px] text-[#7A7568] mt-0.5">
                  Expires: {new Date(tok.expiresAt).toLocaleTimeString()}
                </div>
              </div>

              {!tok.isRevoked && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRevokeToken(tok.id)}
                  leftIcon={<Trash2 className="w-3.5 h-3.5 text-[#B03A28]" />}
                >
                  Revoke Now
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Danger Zone: Reset Local State */}
      <div className="p-4 rounded-xl border border-[#B03A28]/30 bg-[#FBE9E7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#852516]">
        <div>
          <span className="font-bold block">Reset Local Demo Storage</span>
          <p className="text-[11px] text-[#852516]/80 mt-0.5">
            Clears local browser storage caches and restores synthetic baseline data.
          </p>
        </div>
        <Button
          size="sm"
          variant="danger"
          onClick={handlePurgeLocalData}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Reset Demo Data
        </Button>
      </div>
    </div>
  );
};
