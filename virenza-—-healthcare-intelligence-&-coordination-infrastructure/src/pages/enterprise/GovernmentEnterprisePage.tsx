import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Activity, TrendingUp, Building2, ArrowRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const GovernmentEnterprisePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="max-w-3xl space-y-4">
        <Badge variant="amber" size="sm">
          Sector Solution: Government & Public Health
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#22241F]">
          Regional Bio-Surveillance & Emergency Health Readiness
        </h1>
        <p className="text-sm sm:text-base text-[#5A564C] leading-relaxed">
          Public health directorates need actionable, early detection without invading citizen privacy. VIRENZA SENTINEL correlates wastewater pathogen titers, syndromic ER intake surges, and pharmaceutical dispensing trends across state borders.
        </p>
        <div className="flex gap-3 pt-2">
          <Link to="/ops/sentinel">
            <Button size="md" variant="surgical" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Open SENTINEL Bio-Surveillance
            </Button>
          </Link>
          <Link to="/ops">
            <Button variant="outline" size="md">
              Inspect Emergency Response EOC
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padding="lg" variant="surface">
          <h3 className="text-base font-semibold text-[#22241F]">
            11-Day Early Warning Lead Time
          </h3>
          <p className="text-xs text-[#5A564C] mt-2 leading-relaxed">
            Genomic wastewater sequencing and over-the-counter medication purchase spikes identify viral waves up to two weeks before PCR lab backlogs surface.
          </p>
        </Card>

        <Card padding="lg" variant="surface">
          <h3 className="text-base font-semibold text-[#22241F]">
            Municipal ICU Bed Surge Coordination
          </h3>
          <p className="text-xs text-[#5A564C] mt-2 leading-relaxed">
            Monitors real-time acute ventilator and negative-pressure bed reserves across public, private, and military hospital facilities.
          </p>
        </Card>

        <Card padding="lg" variant="surface">
          <h3 className="text-base font-semibold text-[#22241F]">
            Mathematical Differential Privacy
          </h3>
          <p className="text-xs text-[#5A564C] mt-2 leading-relaxed">
            Data aggregation enforces strict ε-differential privacy guarantees, ensuring individual patient identities cannot be re-identified by state authorities.
          </p>
        </Card>
      </div>
    </div>
  );
};
