import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Layers, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/ui/StatCard';

export const InvestorsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="max-w-3xl space-y-4">
        <Badge variant="clinical" size="sm">
          Strategic Partners & Institutional Investors
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#22241F]">
          The coordination layer for the modern healthcare economy.
        </h1>
        <p className="text-sm sm:text-base text-[#5A564C] leading-relaxed">
          Healthcare software has traditionally been built in isolated point solutions (EHRs, telemedicine apps, patient portals, dispatch software). VIRENZA captures value by operating as the verified, cross-enterprise intelligence layer connecting all participants.
        </p>
        <div className="flex gap-3 pt-2">
          <Link to="/architecture">
            <Button size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Examine Architectural Moats
            </Button>
          </Link>
          <Link to="/pricing">
            <Button variant="outline" size="md">
              Enterprise Commercial Model
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Addressable Market"
          value="$48.2B"
          unit="global"
          subtitle="Health intelligence & interop"
          status="clinical"
        />
        <StatCard
          title="Gross Revenue Retention"
          value="98.4%"
          unit="institutional"
          subtitle="High switching costs"
          status="clinical"
        />
        <StatCard
          title="Inter-System Network Effect"
          value="3.8x"
          unit="multiplier"
          subtitle="Value grows per connected node"
          status="surgical"
        />
        <StatCard
          title="Capital Efficiency"
          value="Top Decile"
          unit="SaaS"
          subtitle="Client-side compute offloading"
          status="clinical"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padding="lg" variant="surface">
          <h3 className="text-base font-semibold text-[#22241F]">
            Architectural Moat: Client-Side Cryptography
          </h3>
          <p className="text-xs text-[#5A564C] mt-2 leading-relaxed">
            By executing encryption and key derivation on the client device (Web Crypto AES-256-GCM), VIRENZA dramatically lowers backend infrastructure costs and drastically reduces centralized data breach liability.
          </p>
        </Card>

        <Card padding="lg" variant="surface">
          <h3 className="text-base font-semibold text-[#22241F]">
            Multi-Sided Network Effects
          </h3>
          <p className="text-xs text-[#5A564C] mt-2 leading-relaxed">
            Every hospital onboarded makes VIRENZA more essential to regional health insurers and public health departments, creating powerful cross-sector flywheels.
          </p>
        </Card>

        <Card padding="lg" variant="surface">
          <h3 className="text-base font-semibold text-[#22241F]">
            Regulatory & Compliance Tailwinds
          </h3>
          <p className="text-xs text-[#5A564C] mt-2 leading-relaxed">
            ONC Cures Act information blocking rules and CMS interoperability mandates incentivize health networks to adopt open FHIR coordination fabrics.
          </p>
        </Card>
      </div>
    </div>
  );
};
