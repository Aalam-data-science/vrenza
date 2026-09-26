import React, { useState } from 'react';
import {
  Shield,
  AlertTriangle,
  Activity,
  TrendingUp,
  MapPin,
  FileText,
  Search,
  CheckCircle,
  Eye,
  Info,
} from 'lucide-react';
import { store } from '../../services/store';
import { SentinelSignal } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/ui/StatCard';
import { toast } from '../../hooks/useToast';

export const SentinelPage: React.FC = () => {
  const [signals, setSignals] = useState<SentinelSignal[]>(store.getSentinelSignals());
  const [selectedSignalId, setSelectedSignalId] = useState(signals[0]?.id || '');
  const activeSignal = signals.find((s) => s.id === selectedSignalId) || signals[0];

  const handlePublishAdvisory = (signal: SentinelSignal) => {
    store.addAuditLog({
      actorId: 'usr-gov-tariq',
      actorName: 'Dr. Tariq Al-Mansoor, MD, MPH',
      actorRole: 'GOVERNMENT_OPERATOR',
      organizationId: 'org-doh-state',
      action: 'ADMIN_ACTION',
      resourceType: 'SentinelSignal',
      resourceId: signal.id,
      metadata: { action: 'CLINICAL_ADVISORY_ISSUED', pathogen: signal.pathogen },
    });

    toast({
      type: 'SUCCESS',
      title: 'Epidemiological Advisory Published',
      message: `Surveillance bulletin dispatched to regional emergency networks for ${signal.pathogen}.`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Simulation banner */}
      <div className="bg-[#FBF3DE] border border-[#B8822E]/30 rounded-xl p-4 flex items-center justify-between gap-4 text-xs text-[#7A5317]">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#B8822E] shrink-0" />
          <span>
            <strong>SIMULATED SURVEILLANCE DATA:</strong> All pathogen transmission rates, wastewater titers, and cluster outbreaks are synthetic for demonstration purposes.
          </span>
        </div>
        <Badge variant="amber" size="xs">
          Synthetic Epidemiological Feed
        </Badge>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E4DC] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B8822E] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-[#7A7568]">
              SENTINEL Bio-Surveillance & Early Warning Grid
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-[#22241F] mt-1">
            Global Health Outbreak Intelligence
          </h1>
        </div>

        <div className="font-mono text-xs bg-[#F4F2EE] border border-[#E7E4DC] px-3 py-1.5 rounded-lg text-[#22241F]">
          Director: Dr. Tariq Al-Mansoor, MD, MPH
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Monitored Pathogens"
          value={signals.length}
          unit="strains"
          subtitle="Real-time syndromic feed"
          status="surgical"
          icon={<Shield className="w-4 h-4 text-[#3E6B8E]" />}
        />
        <StatCard
          title="Top Anomaly Rate"
          value="+18.4%"
          unit="7-day change"
          subtitle="Influenza A H3N2 cluster"
          status="amber"
          trend={{ direction: 'up', label: 'Escalating', isPositive: false }}
          icon={<TrendingUp className="w-4 h-4 text-[#B8822E]" />}
        />
        <StatCard
          title="Wastewater Surveillance"
          value="42 / 44"
          unit="catchments"
          subtitle="Genomic sampling active"
          status="clinical"
          icon={<Activity className="w-4 h-4 text-[#3C7049]" />}
        />
        <StatCard
          title="Regional Threat Level"
          value="ELEVATED"
          unit="Level 2"
          subtitle="Metropolitan North Sector"
          status="amber"
          icon={<AlertTriangle className="w-4 h-4 text-[#B8822E]" />}
        />
      </div>

      {/* Main Grid: Signals List & Deep Investigation Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Signals List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#7A7568]">
              Pathogen Alert Signals
            </h3>
            <span className="text-xs font-mono text-[#7A7568]">Cluster Triage</span>
          </div>

          <div className="space-y-2.5">
            {signals.map((sig) => {
              const isSelected = sig.id === activeSignal?.id;
              const threatBadges = {
                WATCH: 'neutral' as const,
                ELEVATED: 'amber' as const,
                HIGH: 'emergency' as const,
                CRITICAL: 'emergency' as const,
              };

              return (
                <div
                  key={sig.id}
                  onClick={() => setSelectedSignalId(sig.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#FBFBF7] border-l-4 border-l-[#B8822E] border-t-[#E7E4DC] border-r-[#E7E4DC] border-b-[#E7E4DC] shadow-xs'
                      : 'bg-[#F4F2EE] border-[#E7E4DC] hover:bg-[#EAE7DF]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-semibold text-xs text-[#22241F]">{sig.pathogen}</span>
                    <Badge variant={threatBadges[sig.threatLevel]} size="xs">
                      {sig.threatLevel}
                    </Badge>
                  </div>

                  <p className="text-xs text-[#5A564C] mt-1">{sig.region}</p>

                  <div className="flex items-center justify-between text-[11px] font-mono text-[#7A7568] pt-2 mt-2 border-t border-[#E7E4DC]/60">
                    <span>{sig.casesReported} reported cases</span>
                    <span className="text-[#B03A28] font-semibold">{sig.trajectory}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Differential Privacy Card */}
          <div className="bg-[#22241F] text-[#FBFBF7] rounded-xl p-5 border border-[#3A3831] space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#3C7049]">
              <Shield className="w-4 h-4" />
              <span className="font-semibold">Differential Privacy Ingest</span>
            </div>
            <p className="text-[#A6A298] leading-relaxed">
              SENTINEL aggregates clinical syndromic indicators and wastewater lab titers with Laplace noise guarantees. Zero patient identifiable health information (PHI) is transmitted or stored in the surveillance tier.
            </p>
          </div>
        </div>

        {/* Deep Signal Analysis Pane (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {activeSignal && (
            <Card padding="lg" variant="surface" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7E4DC] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase text-[#7A7568]">
                      SIGNAL RECORD: {activeSignal.id}
                    </span>
                    <Badge variant="amber" size="xs">
                      Confidence: {Math.round(activeSignal.confidenceScore * 100)}%
                    </Badge>
                  </div>
                  <h2 className="text-xl font-serif font-semibold text-[#22241F] mt-1">
                    {activeSignal.pathogen} ({activeSignal.region})
                  </h2>
                </div>

                <Button
                  size="sm"
                  variant="surgical"
                  onClick={() => handlePublishAdvisory(activeSignal)}
                  leftIcon={<FileText className="w-3.5 h-3.5" />}
                >
                  Issue Regional Health Advisory
                </Button>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-[#F4F2EE] p-3 rounded-lg border border-[#E7E4DC] space-y-1">
                  <span className="font-mono text-[10px] uppercase text-[#7A7568]">7-Day Case Velocity</span>
                  <p className="font-mono font-semibold text-lg text-[#B03A28]">{activeSignal.trajectory}</p>
                  <p className="text-[11px] text-[#5A564C]">{activeSignal.casesReported} cumulative cases</p>
                </div>

                <div className="bg-[#F4F2EE] p-3 rounded-lg border border-[#E7E4DC] space-y-1">
                  <span className="font-mono text-[10px] uppercase text-[#7A7568]">First Cluster Detected</span>
                  <p className="font-mono font-semibold text-xs text-[#22241F]">{activeSignal.firstDetected}</p>
                  <p className="text-[11px] text-[#5A564C]">Emergency Room Syndromic Intake</p>
                </div>

                <div className="bg-[#F4F2EE] p-3 rounded-lg border border-[#E7E4DC] space-y-1">
                  <span className="font-mono text-[10px] uppercase text-[#7A7568]">Surveillance Vector</span>
                  <p className="font-mono font-semibold text-xs text-[#22241F]">Respiratory Multiplex PCR</p>
                  <p className="text-[11px] text-[#3C7049] font-mono">Wastewater Confirmed</p>
                </div>
              </div>

              {/* Structured AI Epidemiological Narrative */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#7A7568]">
                  SENTINEL Structured Epidemiological Analysis
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#F4F2EE] border border-[#E7E4DC] p-4 rounded-xl space-y-1.5 text-xs">
                    <span className="font-mono text-[10px] font-bold uppercase text-[#3E6B8E] block">
                      1. What Changed
                    </span>
                    <p className="text-[#22241F] leading-relaxed">
                      {activeSignal.aiNarrative.whatChanged}
                    </p>
                  </div>

                  <div className="bg-[#F4F2EE] border border-[#E7E4DC] p-4 rounded-xl space-y-1.5 text-xs">
                    <span className="font-mono text-[10px] font-bold uppercase text-[#B8822E] block">
                      2. Why It Matters
                    </span>
                    <p className="text-[#22241F] leading-relaxed">
                      {activeSignal.aiNarrative.whyItMatters}
                    </p>
                  </div>

                  <div className="bg-[#F4F2EE] border border-[#E7E4DC] p-4 rounded-xl space-y-1.5 text-xs">
                    <span className="font-mono text-[10px] font-bold uppercase text-[#7A7568] block">
                      3. Next Signals to Monitor
                    </span>
                    <p className="text-[#22241F] leading-relaxed">
                      {activeSignal.aiNarrative.nextSignals}
                    </p>
                  </div>

                  <div className="bg-[#F4F2EE] border border-[#E7E4DC] p-4 rounded-xl space-y-1.5 text-xs">
                    <span className="font-mono text-[10px] font-bold uppercase text-[#3C7049] block">
                      4. Recommended Interventions
                    </span>
                    <p className="text-[#22241F] leading-relaxed">
                      {activeSignal.aiNarrative.recommendedAction}
                    </p>
                  </div>
                </div>
              </div>

              {/* Data Ingress Lineage */}
              <div className="pt-3 border-t border-[#E7E4DC] flex items-center justify-between text-xs font-mono text-[#7A7568]">
                <span>Ingress Sources: 14 Sentinel Clinical Labs • Metropolitan Sewage District</span>
                <span>Audit Verified</span>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
