import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Activity, Shield, CheckCircle, ArrowRight, Layers, Users, Database } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const HospitalEnterprisePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <Badge variant="clinical" size="sm">
          Sector Solution: Hospital & Health Systems
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#22241F]">
          Eliminate emergency department boarding and uncoordinated clinical handoffs.
        </h1>
        <p className="text-sm sm:text-base text-[#5A564C] leading-relaxed">
          VIRENZA acts as the intelligent orchestration fabric sitting above legacy EHRs (Epic, Cerner, MEDITECH). Providing real-time bed capacity routing, AI-assisted SOAP drafts, and verified patient vault ingestion without disrupting core clinical systems.
        </p>
        <div className="flex gap-3 pt-2">
          <Link to="/clinician">
            <Button size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Test Clinician Command Center
            </Button>
          </Link>
          <Link to="/ops">
            <Button variant="outline" size="md">
              View Bed Capacity Grid
            </Button>
          </Link>
        </div>
      </div>

      {/* 3 Core Value Propositions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padding="lg" variant="surface">
          <div className="p-2.5 rounded-lg bg-[#F4F2EE] border border-[#E7E4DC] w-fit mb-3">
            <Activity className="w-5 h-5 text-[#3C7049]" />
          </div>
          <h3 className="text-base font-semibold text-[#22241F]">
            34% Reduction in ED Boarding
          </h3>
          <p className="text-xs text-[#5A564C] mt-2 leading-relaxed">
            Direct telemetry links triage scoring with real-time bed availability across regional trauma facilities, routing ambulances to uncongested centers.
          </p>
        </Card>

        <Card padding="lg" variant="surface">
          <div className="p-2.5 rounded-lg bg-[#F4F2EE] border border-[#E7E4DC] w-fit mb-3">
            <Users className="w-5 h-5 text-[#3E6B8E]" />
          </div>
          <h3 className="text-base font-semibold text-[#22241F]">
            Clinician Documentation Relief
          </h3>
          <p className="text-xs text-[#5A564C] mt-2 leading-relaxed">
            AI-assisted SOAP note drafting synthesizes patient-reported vitals and medication histories, requiring only a one-click review and signature.
          </p>
        </Card>

        <Card padding="lg" variant="surface">
          <div className="p-2.5 rounded-lg bg-[#F4F2EE] border border-[#E7E4DC] w-fit mb-3">
            <Database className="w-5 h-5 text-[#22241F]" />
          </div>
          <h3 className="text-base font-semibold text-[#22241F]">
            Bi-Directional FHIR R4 Bridge
          </h3>
          <p className="text-xs text-[#5A564C] mt-2 leading-relaxed">
            Converts client-side encrypted vault records into standard HL7 FHIR Patient and Observation bundles with zero backend schema friction.
          </p>
        </Card>
      </div>

      {/* Integration Architecture */}
      <div className="bg-[#F4F2EE] border border-[#E7E4DC] rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-serif font-semibold text-[#22241F]">
          Enterprise Deployment Architecture for CIOs & CMIOs
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="bg-[#FBFBF7] p-4 rounded-xl border border-[#E7E4DC] space-y-1">
            <span className="text-[#3C7049] font-bold">1. HYBRID VPC INGRESS</span>
            <p className="text-[#5A564C]">Deployable inside AWS GovCloud, Google Cloud Healthcare API, or Azure Health Data Services.</p>
          </div>
          <div className="bg-[#FBFBF7] p-4 rounded-xl border border-[#E7E4DC] space-y-1">
            <span className="text-[#3E6B8E] font-bold">2. ZERO DISRUPTION</span>
            <p className="text-[#5A564C]">Operates as an intelligence sidecar layer without modifying core SQL or legacy transactional databases.</p>
          </div>
          <div className="bg-[#FBFBF7] p-4 rounded-xl border border-[#E7E4DC] space-y-1">
            <span className="text-[#22241F] font-bold">3. STRICT RBAC</span>
            <p className="text-[#5A564C]">Hardware security token support (FIDO2/WebAuthn), SAML 2.0 / Okta SSO, and append-only audit logging.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
