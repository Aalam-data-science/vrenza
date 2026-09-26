import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Shield, Cpu, Database, Server, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const ArchitecturePage: React.FC = () => {
  const architecturalLayers = [
    {
      name: 'LAYER 1: CROSS-PLATFORM USER SURFACES',
      color: 'border-l-[#3C7049]',
      items: [
        'Patient Progressive Web App (Offline-capable Service Worker, Mobile 1-Handed Bottom Nav)',
        'Clinician Command Center (Three-Pane Queue, Active Chart, AI SOAP Draft Assist)',
        'Emergency Operations Console (Finite State Machine, Hospital Intake Routing)',
        'SENTINEL Bio-Surveillance Dashboard (Differential Privacy Syndromic Ingest)',
      ],
    },
    {
      name: 'LAYER 2: CLINICAL AI SAFETY GATEWAY',
      color: 'border-l-[#3E6B8E]',
      items: [
        'Deterministic Red-Flag Rule Interceptor (Intercepts acute cardiac, stroke, dyspnea triggers)',
        'Uncertainty & Evidence Quantification (Calibrated confidence scores 0.0 - 1.0)',
        'Mandatory Human Review Sign-Off Protocol (ACCEPT, MODIFY, REJECT with audit tracing)',
        'Prescription OCR Normalizer (Field-level extraction mapping to RxNorm/LOINC)',
      ],
    },
    {
      name: 'LAYER 3: ZERO-KNOWLEDGE CRYPTOGRAPHY',
      color: 'border-l-[#22241F]',
      items: [
        'Client-Side AES-256-GCM via Web Crypto API (Keys derived strictly in browser memory)',
        'Ephemeral Share Token Delegator (Time-bounded URLs with cryptographic revocation)',
        'Immutable Append-Only Audit Ledger (Chained telemetry recording every decrypt and access event)',
      ],
    },
    {
      name: 'LAYER 4: INTEROPERABILITY & INGRESS',
      color: 'border-l-[#B8822E]',
      items: [
        'HL7 FHIR R4 Bundle Adapter (Maps to Patient, Observation, MedicationRequest, Encounter)',
        'E911 / Emergency PSAP State Dispatch Protocol',
        'Health Insurer Claims & Care Gap Signal Ingest',
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="max-w-3xl space-y-4">
        <Badge variant="clinical" size="sm">
          Technical Architecture
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#22241F]">
          A modular, privacy-preserving coordination architecture.
        </h1>
        <p className="text-sm sm:text-base text-[#5A564C] leading-relaxed">
          VIRENZA is built on a four-tier clean architecture separating presentation, intelligence safety, client-side cryptography, and standard healthcare interoperability.
        </p>
      </div>

      {/* 4 Architectural Tiers */}
      <div className="space-y-4">
        {architecturalLayers.map((layer) => (
          <Card key={layer.name} padding="md" variant="surface" className={`border-l-4 ${layer.color}`}>
            <h3 className="text-xs font-mono font-bold tracking-wider text-[#22241F] uppercase mb-3">
              {layer.name}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {layer.items.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-[#5A564C]">
                  <CheckCircle className="w-3.5 h-3.5 text-[#3C7049] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Provider Abstraction Strategy */}
      <div className="bg-[#F4F2EE] border border-[#E7E4DC] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-[#3C7049]" />
          <h2 className="text-lg font-serif font-semibold text-[#22241F]">
            Provider Abstraction Layer (Zero Vendor Lock-In)
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#5A564C] leading-relaxed">
          All external integrations are strictly bound behind abstract interfaces. In this demonstration environment, local deterministic providers run seamlessly in offline sandboxes without external network calls.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-xs">
          <div className="bg-[#FBFBF7] p-3.5 rounded-lg border border-[#E7E4DC]">
            <span className="text-[#3C7049] font-bold block mb-1">StorageProvider</span>
            <span className="text-[11px] text-[#5A564C]">LocalStore → Firestore / Cloud SQL / S3</span>
          </div>
          <div className="bg-[#FBFBF7] p-3.5 rounded-lg border border-[#E7E4DC]">
            <span className="text-[#3E6B8E] font-bold block mb-1">AIProvider</span>
            <span className="text-[11px] text-[#5A564C]">DeterministicRuleEngine → Google GenAI SDK</span>
          </div>
          <div className="bg-[#FBFBF7] p-3.5 rounded-lg border border-[#E7E4DC]">
            <span className="text-[#B8822E] font-bold block mb-1">PaymentProvider</span>
            <span className="text-[11px] text-[#5A564C]">SimulatedSandbox → Stripe / Adyen</span>
          </div>
          <div className="bg-[#FBFBF7] p-3.5 rounded-lg border border-[#E7E4DC]">
            <span className="text-[#B03A28] font-bold block mb-1">DispatchProvider</span>
            <span className="text-[11px] text-[#5A564C]">LocalStateMachine → CAD / E911 Bridge</span>
          </div>
        </div>
      </div>
    </div>
  );
};
