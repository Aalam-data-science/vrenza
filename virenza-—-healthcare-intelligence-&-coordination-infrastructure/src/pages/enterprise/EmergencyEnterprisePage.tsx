import React from 'react';
import { Link } from 'react-router-dom';
import { Siren, MapPin, Building2, Clock, ArrowRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const EmergencyEnterprisePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="max-w-3xl space-y-4">
        <Badge variant="emergency" size="sm">
          Sector Solution: Emergency Medical Dispatch & EMS
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#22241F]">
          Deterministic emergency dispatch state machines and automated hospital ingress.
        </h1>
        <p className="text-sm sm:text-base text-[#5A564C] leading-relaxed">
          Transform verbal 911/112 radio handoffs into high-fidelity digital streams. Paramedic teams receive exact patient allergy histories and current medications en route, while receiving trauma centers prepare designated resuscitation bays prior to ambulance arrival.
        </p>
        <div className="flex gap-3 pt-2">
          <Link to="/app/emergency">
            <Button size="md" variant="danger" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Test Patient SOS Interface
            </Button>
          </Link>
          <Link to="/ops">
            <Button variant="outline" size="md">
              Launch Dispatch EOC Console
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padding="lg" variant="surface">
          <h3 className="text-base font-semibold text-[#22241F]">
            Strict Finite State Machine
          </h3>
          <p className="text-xs text-[#5A564C] mt-2 leading-relaxed">
            Guaranteed deterministic progression from IDLE through CONNECTING, LOCATION_CONFIRMED, FACILITY_IDENTIFIED, DISPATCHED, and RESOLVED.
          </p>
        </Card>

        <Card padding="lg" variant="surface">
          <h3 className="text-base font-semibold text-[#22241F]">
            Automatic Allergy & Medical ID Ingress
          </h3>
          <p className="text-xs text-[#5A564C] mt-2 leading-relaxed">
            Dispatches patient blood type, severe anaphylaxis warnings (e.g. penicillin), and active anticoagulants directly to the mobile paramedic terminal.
          </p>
        </Card>

        <Card padding="lg" variant="surface">
          <h3 className="text-base font-semibold text-[#22241F]">
            Trauma Center Diversion Avoidance
          </h3>
          <p className="text-xs text-[#5A564C] mt-2 leading-relaxed">
            Real-time querying of verified emergency bed status avoids sending critical stroke or STEMI patients to facilities on diversion status.
          </p>
        </Card>
      </div>
    </div>
  );
};
