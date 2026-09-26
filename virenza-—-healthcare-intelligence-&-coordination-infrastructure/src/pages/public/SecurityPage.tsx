import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Key, CheckCircle, AlertTriangle, FileText, ArrowRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const SecurityPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="max-w-3xl space-y-4">
        <Badge variant="clinical" size="sm">
          Security & Cryptography Dossier
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#22241F]">
          Zero-knowledge client-side encryption and mathematical privacy boundaries.
        </h1>
        <p className="text-sm sm:text-base text-[#5A564C] leading-relaxed">
          VIRENZA re-architects medical data custody. By encrypting sensitive records directly in the user’s browser using the standardized Web Crypto API (AES-256-GCM), server operators and cloud infrastructure providers cannot read patient health records.
        </p>
        <div className="flex gap-3 pt-2">
          <Link to="/app/vault">
            <Button size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Test In-Browser Encryption Vault
            </Button>
          </Link>
          <Link to="/admin">
            <Button variant="outline" size="md">
              Inspect Audit Ledger
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padding="lg" variant="surface">
          <div className="p-2.5 rounded-lg bg-[#F4F2EE] border border-[#E7E4DC] w-fit mb-3">
            <Lock className="w-5 h-5 text-[#3C7049]" />
          </div>
          <h3 className="text-base font-semibold text-[#22241F]">
            AES-256-GCM Web Crypto
          </h3>
          <p className="text-xs text-[#5A564C] mt-2 leading-relaxed">
            Galois/Counter Mode provides both confidentiality and cryptographic integrity verification, preventing tampering in transit.
          </p>
        </Card>

        <Card padding="lg" variant="surface">
          <div className="p-2.5 rounded-lg bg-[#F4F2EE] border border-[#E7E4DC] w-fit mb-3">
            <Key className="w-5 h-5 text-[#3E6B8E]" />
          </div>
          <h3 className="text-base font-semibold text-[#22241F]">
            Ephemeral Share Token Lifecycle
          </h3>
          <p className="text-xs text-[#5A564C] mt-2 leading-relaxed">
            Time-bounded access tokens expire automatically (15m, 1h, 24h) and support instant cryptographic revocation with a single click.
          </p>
        </Card>

        <Card padding="lg" variant="surface">
          <div className="p-2.5 rounded-lg bg-[#F4F2EE] border border-[#E7E4DC] w-fit mb-3">
            <Shield className="w-5 h-5 text-[#22241F]" />
          </div>
          <h3 className="text-base font-semibold text-[#22241F]">
            Immutable Append-Only Audit
          </h3>
          <p className="text-xs text-[#5A564C] mt-2 leading-relaxed">
            Every read, decryption attempt, delegation, and clinician sign-off is logged into a tamper-evident audit ledger for HIPAA and SOC 2 audits.
          </p>
        </Card>
      </div>

      {/* Compliance Matrix */}
      <div className="bg-[#FBFBF7] border border-[#E7E4DC] rounded-2xl p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-serif font-semibold text-[#22241F]">
          Compliance & Regulatory Readiness Mapping
        </h2>
        <div className="border border-[#E7E4DC] rounded-xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-[#F4F2EE] font-mono text-[10px] uppercase text-[#7A7568] border-b border-[#E7E4DC]">
              <tr>
                <th className="p-3">Regulatory Standard</th>
                <th className="p-3">Requirement</th>
                <th className="p-3">VIRENZA Technical Implementation</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E4DC] font-mono text-[11px]">
              <tr>
                <td className="p-3 font-semibold text-[#22241F]">HIPAA Security Rule</td>
                <td className="p-3 text-[#5A564C]">45 CFR § 164.312(a)(2)(iv) Encryption at rest & transit</td>
                <td className="p-3 text-[#22241F]">Client-side AES-256-GCM zero-knowledge architecture</td>
                <td className="p-3 text-[#3C7049]">VERIFIED READY</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[#22241F]">ONC Cures Act</td>
                <td className="p-3 text-[#5A564C]">Information Blocking Rule § 171.200</td>
                <td className="p-3 text-[#22241F]">Native HL7 FHIR R4 Bundle patient export</td>
                <td className="p-3 text-[#3C7049]">VERIFIED READY</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[#22241F]">GDPR / CCPA</td>
                <td className="p-3 text-[#5A564C]">Right to Erasure & Data Portability</td>
                <td className="p-3 text-[#22241F]">Instant token revocation and local key erasure</td>
                <td className="p-3 text-[#3C7049]">VERIFIED READY</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[#22241F]">SOC 2 Type II</td>
                <td className="p-3 text-[#5A564C]">Trust Services Criteria: Auditability & Access Control</td>
                <td className="p-3 text-[#22241F]">Immutable append-only audit trail with RBAC enforcement</td>
                <td className="p-3 text-[#3C7049]">VERIFIED READY</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
