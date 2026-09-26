import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Shield, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const AIHealthEnterprisePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="max-w-3xl space-y-4">
        <Badge variant="ai" size="sm">
          Sector Solution: AI-Health Companies
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#22241F]">
          Safety gateways, clinical guardrails, and human-in-the-loop workflows for health AI.
        </h1>
        <p className="text-sm sm:text-base text-[#5A564C] leading-relaxed">
          Healthcare models cannot afford ungrounded hallucinations or unmonitored prompt injections. VIRENZA provides deterministic clinical triage overrides, explicit uncertainty boundaries, and mandatory clinician review workflows.
        </p>
        <div className="flex gap-3 pt-2">
          <Link to="/app/triage">
            <Button size="md" variant="surgical" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Test AI Clinical Gateway
            </Button>
          </Link>
          <Link to="/security">
            <Button variant="outline" size="md">
              Inspect Security Architecture
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padding="lg" variant="surface">
          <h3 className="text-base font-semibold text-[#22241F]">
            Deterministic Red-Flag Overrides
          </h3>
          <p className="text-xs text-[#5A564C] mt-2 leading-relaxed">
            Rule engines intercept acute clinical emergency indicators (crushing chest pain, focal neurological deficits) before generative models can hallucinate reassurance.
          </p>
        </Card>

        <Card padding="lg" variant="surface">
          <h3 className="text-base font-semibold text-[#22241F]">
            Confidence & Uncertainty Metrics
          </h3>
          <p className="text-xs text-[#5A564C] mt-2 leading-relaxed">
            Every clinical inference is scored between 0.0 and 1.0 with explicit documentation of data gaps (e.g., absence of physical auscultation or serum troponin).
          </p>
        </Card>

        <Card padding="lg" variant="surface">
          <h3 className="text-base font-semibold text-[#22241F]">
            Mandatory Human Sign-Off
          </h3>
          <p className="text-xs text-[#5A564C] mt-2 leading-relaxed">
            AI SOAP drafts and prescription extractions cannot be committed without explicit ACCEPT, MODIFY, or REJECT actions recorded in the immutable audit log.
          </p>
        </Card>
      </div>
    </div>
  );
};
