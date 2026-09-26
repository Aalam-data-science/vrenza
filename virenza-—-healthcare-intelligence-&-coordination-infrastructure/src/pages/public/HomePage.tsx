import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Activity,
  Stethoscope,
  Building2,
  Lock,
  ArrowRight,
  Layers,
  CheckCircle,
  FileText,
  AlertTriangle,
  Cpu,
  Siren,
  Database,
  Users,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { LivingNetworkVisualization } from '../../components/network/LivingNetworkVisualization';
import { useI18n } from '../../i18n';
import { toast } from '../../hooks/useToast';

export const HomePage: React.FC = () => {
  const { t } = useI18n();
  const [briefingModalOpen, setBriefingModalOpen] = useState(false);
  const [briefingSubmitted, setBriefingSubmitted] = useState(false);
  const [briefingForm, setBriefingForm] = useState({
    name: '',
    email: '',
    organization: '',
    sector: 'Hospital System',
    notes: '',
  });

  const handleBriefingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBriefingSubmitted(true);
    toast({
      type: 'SUCCESS',
      title: 'Enterprise Briefing Requested',
      message: 'Our clinical systems architect team will prepare an organizational dossier.',
    });
    setTimeout(() => {
      setBriefingModalOpen(false);
      setBriefingSubmitted(false);
      setBriefingForm({ name: '', email: '', organization: '', sector: 'Hospital System', notes: '' });
    }, 2500);
  };

  const capabilityPillars = [
    {
      title: 'PERSONAL HEALTH',
      tagline: 'Continuous Telemetry & Adherence',
      desc: 'Connects patient vitals, medication adherence, and timeline records into a structured, unified care trajectory.',
      link: '/app',
      icon: <Activity className="w-5 h-5 text-[#3C7049]" />,
    },
    {
      title: 'AI HEALTH INTELLIGENCE',
      tagline: 'Clinical Safety & Guardrail Engine',
      desc: 'Deterministic red-flag triage, prescription OCR, and structured consultation summaries under strict human supervision.',
      link: '/app/triage',
      icon: <Cpu className="w-5 h-5 text-[#3E6B8E]" />,
    },
    {
      title: 'CONNECTED CLINICIANS',
      tagline: 'Three-Pane Command Center',
      desc: 'High-density clinical queue, active chart inspection, and AI SOAP draft assistance with accept/modify/reject workflows.',
      link: '/clinician',
      icon: <Stethoscope className="w-5 h-5 text-[#3C7049]" />,
    },
    {
      title: 'SECURE HEALTH VAULT',
      tagline: 'Client-Side AES-256-GCM',
      desc: 'End-to-end encrypted medical record vault with granular, time-limited share tokens and instantaneous revocation.',
      link: '/app/vault',
      icon: <Lock className="w-5 h-5 text-[#22241F]" />,
    },
    {
      title: 'GLOBAL HEALTH SENTINEL',
      tagline: 'Bio-Surveillance & Early Signals',
      desc: 'Regional pathogen tracking, syndromic surveillance anomaly detection, and automated threat level notifications.',
      link: '/ops/sentinel',
      icon: <Shield className="w-5 h-5 text-[#B8822E]" />,
    },
    {
      title: 'EMERGENCY RESPONSE',
      tagline: 'State-Machine Dispatch & Ingress',
      desc: 'Deliberate hold-to-activate SOS lifecycle coordinating GPS coordinates, unit dispatch, and hospital bed availability.',
      link: '/ops',
      icon: <Siren className="w-5 h-5 text-[#B03A28]" />,
    },
  ];

  const enterpriseSectors = [
    {
      sector: 'Hospitals & Health Systems',
      problem: 'Clinical burnout, disconnected EHR silos, and blind spots in emergency department bed availability.',
      solution: 'Unified clinical command center with automated triage scoring and real-time inter-facility capacity coordination.',
      link: '/enterprise/hospitals',
    },
    {
      sector: 'Health Insurers & Payers',
      problem: 'Delayed claims data obscuring preventative care gaps and high-risk chronic cohort decompensations.',
      solution: 'Predictive risk stratification, medication adherence telemetry, and preventive outreach signal triggers.',
      link: '/enterprise/insurers',
    },
    {
      sector: 'Government & Public Health',
      problem: 'Fragmented municipal laboratory feeds delaying regional outbreak and syndromic escalation awareness.',
      solution: 'SENTINEL bio-surveillance engine with differential privacy aggregation and automated threat level clusters.',
      link: '/enterprise/government',
    },
    {
      sector: 'Emergency Medical Dispatch',
      problem: 'Verbal handoffs, imprecise patient location data, and secondary ambulances diverted from saturated trauma centers.',
      solution: 'Finite state machine dispatch linking active incident telemetry with validated hospital bed capacity.',
      link: '/enterprise/emergency',
    },
  ];

  return (
    <div className="space-y-24 py-6 sm:py-12">
      {/* 1. Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4F2EE] border border-[#E7E4DC] text-xs font-mono text-[#5A564C]">
            <span className="w-2 h-2 rounded-full bg-[#3C7049]" />
            <span>Healthcare Intelligence & Coordination Infrastructure</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#22241F] font-serif leading-[1.15]">
            Healthcare, connected by intelligence.
          </h1>

          <p className="text-base sm:text-lg text-[#5A564C] leading-relaxed max-w-2xl mx-auto font-sans">
            An intelligent coordination layer for patients, clinicians, health systems, emergency operations and health data. Turning fragmented signals into structured, auditable clinical action.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link to="/app">
              <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Explore the Platform
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setBriefingModalOpen(true)}
            >
              Request Enterprise Briefing
            </Button>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-[#7A7568] font-mono">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-[#3C7049]" /> Zero-Knowledge Client AES-256
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-[#3C7049]" /> Immutable Append-Only Ledger
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-[#3C7049]" /> Human-in-the-Loop Clinical AI
            </span>
          </div>
        </div>

        {/* Living Network Topology Visualization */}
        <div className="mt-14">
          <LivingNetworkVisualization />
        </div>
      </section>

      {/* 2. Problem Statement: Fragmented Healthcare */}
      <section className="bg-[#F4F2EE] border-y border-[#E7E4DC] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-[#7A7568]">
                The Core Thesis
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#22241F]">
                Healthcare information is fragmented across disconnected systems.
              </h2>
              <p className="text-sm text-[#5A564C] leading-relaxed">
                Hospitals operate behind EHR walls, emergency responders navigate phone dispatches, patients manage scattered PDFs, and public health authorities receive delayed outbreak numbers weeks late.
              </p>
              <div className="p-4 rounded-xl bg-[#FBFBF7] border border-[#E7E4DC] font-mono text-xs text-[#22241F] space-y-1">
                <div className="text-[#3C7049] font-semibold">THE VIRENZA COORDINATION CYCLE:</div>
                <div className="text-[#5A564C]">UNDERSTAND → CONNECT → DECIDE → ACT → AUDIT</div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card padding="md" variant="surface">
                <div className="text-xs font-mono text-[#B03A28] uppercase font-semibold">Fragmented Silo</div>
                <h4 className="text-sm font-semibold text-[#22241F] mt-1">Uncoordinated Handoffs</h4>
                <p className="text-xs text-[#5A564C] mt-1.5 leading-relaxed">
                  Crucial allergy records and medication lists fail to traverse between community pharmacies and trauma triage in acute incidents.
                </p>
              </Card>

              <Card padding="md" variant="surface">
                <div className="text-xs font-mono text-[#B8822E] uppercase font-semibold">Delayed Signals</div>
                <h4 className="text-sm font-semibold text-[#22241F] mt-1">Stale Outbreak Feeds</h4>
                <p className="text-xs text-[#5A564C] mt-1.5 leading-relaxed">
                  Epidemiological clusters appear in emergency rooms days before public health surveillance systems detect municipal trajectory shifts.
                </p>
              </Card>

              <Card padding="md" variant="surface">
                <div className="text-xs font-mono text-[#3E6B8E] uppercase font-semibold">Unchecked AI Autonomy</div>
                <h4 className="text-sm font-semibold text-[#22241F] mt-1">Black-Box LLM Hallucinations</h4>
                <p className="text-xs text-[#5A564C] mt-1.5 leading-relaxed">
                  Generic consumer AI creates confident medical misdiagnoses without clinician accountability or verified evidence boundaries.
                </p>
              </Card>

              <Card padding="md" variant="surface">
                <div className="text-xs font-mono text-[#3C7049] uppercase font-semibold">VIRENZA Resolution</div>
                <h4 className="text-sm font-semibold text-[#22241F] mt-1">Intelligent Shared Layer</h4>
                <p className="text-xs text-[#5A564C] mt-1.5 leading-relaxed">
                  Deterministic guardrails, client-side AES cryptography, explicit role-based access, and immutable audit logging across every boundary.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Six Capability Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-[#7A7568]">
            Architectural Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#22241F]">
            Six Pillars of Healthcare Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-[#5A564C]">
            One unified infrastructure codebase powering buyer-specific workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilityPillars.map((p) => (
            <Card key={p.title} padding="lg" variant="surface" className="flex flex-col justify-between group hover:border-[#3C7049] transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-lg bg-[#F4F2EE] border border-[#E7E4DC] group-hover:border-[#3C7049] transition-colors">
                    {p.icon}
                  </div>
                  <span className="text-[10px] font-mono uppercase text-[#7A7568] tracking-wider">
                    {p.title}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[#22241F]">
                  {p.tagline}
                </h3>
                <p className="text-xs text-[#5A564C] leading-relaxed">
                  {p.desc}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-[#E7E4DC]">
                <Link
                  to={p.link}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#3C7049] group-hover:text-[#2d5637] transition-colors"
                >
                  <span>Experience Surface</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. Enterprise Sectors Breakdown */}
      <section className="bg-[#FBFBF7] border-y border-[#E7E4DC] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#7A7568]">
                Enterprise Buyer Solutions
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#22241F] mt-1">
                Built for Institutional Scale & Strict Governance
              </h2>
            </div>
            <Link to="/pricing">
              <Button variant="outline" size="sm">
                View Enterprise Licensing
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enterpriseSectors.map((s) => (
              <Card key={s.sector} padding="lg" variant="alt">
                <div className="flex items-center justify-between border-b border-[#E7E4DC] pb-3 mb-4">
                  <h3 className="text-base font-semibold text-[#22241F]">
                    {s.sector}
                  </h3>
                  <Badge variant="clinical" size="xs">
                    Enterprise Ready
                  </Badge>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-mono text-[10px] text-[#B03A28] uppercase font-semibold block">
                      The Operational Problem
                    </span>
                    <p className="text-[#5A564C] mt-0.5 leading-relaxed">{s.problem}</p>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-[#3C7049] uppercase font-semibold block">
                      The VIRENZA Solution
                    </span>
                    <p className="text-[#22241F] mt-0.5 leading-relaxed">{s.solution}</p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#E7E4DC] flex justify-end">
                  <Link to={s.link}>
                    <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      View Operational Dossier
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5. AI Trust Model & Human Oversight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#22241F] text-[#FBFBF7] rounded-2xl p-6 sm:p-12 border border-[#3A3831] shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#33352E] text-[#DDE8F0] border border-[#48463D] text-xs font-mono">
                <Cpu className="w-3.5 h-3.5 text-[#3E6B8E]" />
                <span>AI Trust Model Architecture</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#FBFBF7]">
                Assistance before autonomy. Evidence before assumption.
              </h2>
              <p className="text-xs sm:text-sm text-[#CBC7BC] leading-relaxed">
                VIRENZA AI models never output ungrounded assertions. Every clinical draft, triage urgency calculation, and OCR extraction explicitly separates observed facts from inferences, scores confidence, and requires verified clinician sign-off.
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                <Link to="/app/triage">
                  <Button variant="surgical" size="sm">
                    Test AI Triage Engine
                  </Button>
                </Link>
                <Link to="/architecture">
                  <Button variant="outline" size="sm" className="text-[#FBFBF7] border-[#48463D] hover:bg-[#33352E]">
                    Inspect AI Gateway
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 bg-[#2B2D26] border border-[#43453C] rounded-xl p-5 font-mono text-xs space-y-3">
              <div className="text-[11px] text-[#A6A298] uppercase border-b border-[#43453C] pb-2 flex items-center justify-between">
                <span>Clinical AI Structured Schema</span>
                <span className="text-[#3C7049]">STRICT PROTOCOL</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="text-[#DDE8F0] flex gap-2">
                  <span className="text-[#7A7568] w-28">1. OBSERVED DATA:</span>
                  <span className="text-[#FBFBF7]">Vital telemetry, lab values, reported symptoms</span>
                </div>
                <div className="text-[#DDE8F0] flex gap-2">
                  <span className="text-[#7A7568] w-28">2. INFERENCE:</span>
                  <span className="text-[#FBFBF7]">Potential risk clustering & differential alerts</span>
                </div>
                <div className="text-[#DDE8F0] flex gap-2">
                  <span className="text-[#7A7568] w-28">3. UNCERTAINTY:</span>
                  <span className="text-[#B8822E]">Explicit gaps in history or remote telemetry</span>
                </div>
                <div className="text-[#DDE8F0] flex gap-2">
                  <span className="text-[#7A7568] w-28">4. CONFIDENCE:</span>
                  <span className="text-[#3C7049]">Calibrated 0.0 - 1.0 field-level metric</span>
                </div>
                <div className="text-[#DDE8F0] flex gap-2">
                  <span className="text-[#7A7568] w-28">5. HUMAN REVIEW:</span>
                  <span className="text-[#FBFBF7]">ACCEPT • MODIFY • REJECT (Audit logged)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Call to Action */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#22241F]">
          Experience the healthcare coordination layer.
        </h2>
        <p className="text-sm text-[#5A564C] max-w-xl mx-auto leading-relaxed">
          Explore our live interactive environment across patient, clinician, hospital, insurer, emergency, and government surfaces with zero external API dependencies.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/app">
            <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Launch Patient Interface
            </Button>
          </Link>
          <Link to="/clinician">
            <Button variant="secondary" size="lg">
              Launch Clinician Command
            </Button>
          </Link>
        </div>
      </section>

      {/* Briefing Modal */}
      <Modal
        isOpen={briefingModalOpen}
        onClose={() => setBriefingModalOpen(false)}
        title="Request Enterprise Briefing & Dossier"
        subtitle="Confidential demonstration and architectural integration review for institutional leaders."
        maxWidth="md"
      >
        {briefingSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle className="w-10 h-10 text-[#3C7049] mx-auto" />
            <h4 className="text-base font-semibold text-[#22241F]">Briefing Requested</h4>
            <p className="text-xs text-[#5A564C]">
              A specialized healthcare systems architect will contact your office within 1 business day.
            </p>
          </div>
        ) : (
          <form onSubmit={handleBriefingSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#22241F] mb-1">
                Full Name & Credentials
              </label>
              <input
                required
                type="text"
                placeholder="Dr. Jordan Mitchell, MD, Chief Medical Officer"
                value={briefingForm.name}
                onChange={(e) => setBriefingForm({ ...briefingForm, name: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-[#E7E4DC] bg-[#F4F2EE] focus:outline-[#3C7049]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#22241F] mb-1">
                Institutional Email
              </label>
              <input
                required
                type="email"
                placeholder="cmo@academichealth.org"
                value={briefingForm.email}
                onChange={(e) => setBriefingForm({ ...briefingForm, email: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-[#E7E4DC] bg-[#F4F2EE] focus:outline-[#3C7049]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#22241F] mb-1">
                  Organization Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="Metropolitan Health System"
                  value={briefingForm.organization}
                  onChange={(e) => setBriefingForm({ ...briefingForm, organization: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E7E4DC] bg-[#F4F2EE] focus:outline-[#3C7049]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#22241F] mb-1">
                  Sector
                </label>
                <select
                  value={briefingForm.sector}
                  onChange={(e) => setBriefingForm({ ...briefingForm, sector: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E7E4DC] bg-[#F4F2EE] focus:outline-[#3C7049]"
                >
                  <option>Hospital System</option>
                  <option>Health Insurer / Payer</option>
                  <option>Government Public Health</option>
                  <option>Emergency Services (EMS/EOC)</option>
                  <option>Healthcare Startup</option>
                  <option>AI-Health Company</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#22241F] mb-1">
                Clinical or Infrastructure Focus Area
              </label>
              <textarea
                rows={3}
                placeholder="Briefly describe key objectives (e.g. cross-system patient records, AI triage safety, bed capacity coordination)..."
                value={briefingForm.notes}
                onChange={(e) => setBriefingForm({ ...briefingForm, notes: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-[#E7E4DC] bg-[#F4F2EE] focus:outline-[#3C7049]"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setBriefingModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Submit Request
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
