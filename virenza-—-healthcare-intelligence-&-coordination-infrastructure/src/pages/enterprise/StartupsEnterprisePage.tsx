import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Key, Shield, Code, ArrowRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const StartupsEnterprisePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="max-w-3xl space-y-4">
        <Badge variant="clinical" size="sm">
          Developer & Startup Infrastructure
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#22241F]">
          The compliance and coordination primitives for digital health builders.
        </h1>
        <p className="text-sm sm:text-base text-[#5A564C] leading-relaxed">
          Skip 18 months of building custom HIPAA data vaults, FHIR adapters, and audit trails. VIRENZA provides modular TypeScript SDKs, client-side Web Crypto primitives, and deterministic clinical triage gateways out of the box.
        </p>
        <div className="flex gap-3 pt-2">
          <Link to="/architecture">
            <Button size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Explore Architecture & SDKs
            </Button>
          </Link>
          <Link to="/pricing">
            <Button variant="outline" size="md">
              Developer Tier Pricing
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padding="lg" variant="surface">
          <h3 className="text-base font-semibold text-[#22241F]">
            Web Crypto AES-256-GCM SDK
          </h3>
          <p className="text-xs text-[#5A564C] mt-2 leading-relaxed">
            Zero-knowledge client-side encryption libraries ready to drop into React, Next.js, React Native, or Flutter codebases.
          </p>
        </Card>

        <Card padding="lg" variant="surface">
          <h3 className="text-base font-semibold text-[#22241F]">
            Instant HL7 FHIR R4 Ingestion
          </h3>
          <p className="text-xs text-[#5A564C] mt-2 leading-relaxed">
            Standard adapters mapping Patient, Observation, DiagnosticReport, and MedicationRequest schemas into clean TypeScript types.
          </p>
        </Card>

        <Card padding="lg" variant="surface">
          <h3 className="text-base font-semibold text-[#22241F]">
            Immutable Audit Ledger Middleware
          </h3>
          <p className="text-xs text-[#5A564C] mt-2 leading-relaxed">
            Every read, decrypt, consent delegation, and clinician sign-off is logged into an append-only verifiable ledger ready for SOC 2 Type II and HIPAA audits.
          </p>
        </Card>
      </div>
    </div>
  );
};
