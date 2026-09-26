import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, TrendingDown, Shield, CheckCircle, ArrowRight, HeartHandshake, AlertCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/ui/StatCard';

export const InsurerEnterprisePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="max-w-3xl space-y-4">
        <Badge variant="clinical" size="sm">
          Sector Solution: Health Insurers & Managed Care
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#22241F]">
          Shift from delayed claims processing to predictive care gap closure.
        </h1>
        <p className="text-sm sm:text-base text-[#5A564C] leading-relaxed">
          Traditional claims data arrives 45 to 90 days after care events. VIRENZA ingests real-time medication adherence signals, patient-authorized biometric telemetry, and early triage alerts to prevent catastrophic acute decompensations.
        </p>
        <div className="flex gap-3 pt-2">
          <Link to="/app">
            <Button size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Inspect Member Telemetry View
            </Button>
          </Link>
          <Link to="/pricing">
            <Button variant="outline" size="md">
              Payer Licensing Matrix
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Medication Non-Adherence Catch"
          value="4.2x"
          unit="faster"
          subtitle="Real-time dose logging"
          status="clinical"
        />
        <StatCard
          title="Preventable ER Visits"
          value="-22.6%"
          unit="trend"
          subtitle="Triage intervention routing"
          status="clinical"
        />
        <StatCard
          title="Care Gap Auto-Detection"
          value="94.8%"
          unit="accuracy"
          subtitle="HEDIS quality measures"
          status="surgical"
        />
        <StatCard
          title="Net Medical Loss Ratio (MLR)"
          value="-3.4%"
          unit="improvement"
          subtitle="Chronic cohort stabilization"
          status="clinical"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padding="lg" variant="surface">
          <h3 className="text-base font-semibold text-[#22241F]">
            Continuous Chronic Cohort Monitoring
          </h3>
          <p className="text-xs text-[#5A564C] mt-2 leading-relaxed">
            Automated alerts when congestive heart failure (CHF) or diabetic patients exhibit 3 consecutive days of missing vitals or blood pressure elevation.
          </p>
        </Card>

        <Card padding="lg" variant="surface">
          <h3 className="text-base font-semibold text-[#22241F]">
            HEDIS & Star Rating Acceleration
          </h3>
          <p className="text-xs text-[#5A564C] mt-2 leading-relaxed">
            Directly closes preventative care gaps (mammography, diabetic eye exams, statin therapy) via automated patient portal nudges and calendar scheduling.
          </p>
        </Card>

        <Card padding="lg" variant="surface">
          <h3 className="text-base font-semibold text-[#22241F]">
            Explicit Patient Consent & RBAC
          </h3>
          <p className="text-xs text-[#5A564C] mt-2 leading-relaxed">
            Members maintain absolute ownership of their encrypted records. Health plans receive verifiable, aggregated risk scores without violating trust.
          </p>
        </Card>
      </div>
    </div>
  );
};
