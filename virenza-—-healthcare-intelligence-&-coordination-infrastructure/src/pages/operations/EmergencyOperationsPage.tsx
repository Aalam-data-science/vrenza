import React, { useState } from 'react';
import {
  Siren,
  Building2,
  MapPin,
  Clock,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { store } from '../../services/store';
import { emergencyDispatch } from '../../services/emergency/dispatch';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/ui/StatCard';
import { toast } from '../../hooks/useToast';
import { GoogleFacilitiesMap } from '../../components/maps/GoogleFacilitiesMap';

export const EmergencyOperationsPage: React.FC = () => {
  const [incidents, setIncidents] = useState(store.getIncidents());
  const [selectedIncidentId, setSelectedIncidentId] = useState(incidents[0]?.id || '');
  const activeIncident = incidents.find((i) => i.id === selectedIncidentId) || incidents[0];

  const facilities = store.getFacilities();

  const advanceState = (nextStatus: any, note: string) => {
    if (!activeIncident) return;
    emergencyDispatch.transitionState(activeIncident.id, nextStatus, 'Sarah Jenkins (EOC Commander)', note);
    setIncidents(store.getIncidents());
    toast({
      type: 'INFO',
      title: 'Incident Status Advanced',
      message: `State transitioned to ${nextStatus}.`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Simulation Warning Callout */}
      <div className="bg-[#FBE9E7] border border-[#B03A28]/30 rounded-xl p-4 flex items-center justify-between gap-4 text-xs text-[#852516]">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#B03A28] shrink-0" />
          <span>
            <strong>SIMULATION ENVIRONMENT:</strong> Emergency Operations Center incident queue, GPS tracking, and ambulance dispatch are synthetic for architecture evaluation.
          </span>
        </div>
        <Badge variant="emergency" size="xs">
          Synthetic State Machine
        </Badge>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E4DC] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B03A28] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-[#7A7568]">
              Regional Emergency Dispatch & Bed Ingress
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-[#22241F] mt-1">
            Emergency Operations Center (EOC)
          </h1>
        </div>

        <div className="font-mono text-xs bg-[#F4F2EE] border border-[#E7E4DC] px-3 py-1.5 rounded-lg text-[#22241F]">
          Operator: Sarah Jenkins • Station 04
        </div>
      </div>

      {/* Telemetry Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Dispatches"
          value={incidents.filter((i) => i.status !== 'RESOLVED' && i.status !== 'IDLE').length}
          unit="units"
          subtitle="Priority Code 3"
          status="emergency"
          icon={<Siren className="w-4 h-4 text-[#B03A28]" />}
        />
        <StatCard
          title="Regional ER Beds"
          value="26 / 138"
          unit="available"
          subtitle="18.8% reserve margin"
          status="clinical"
          icon={<Building2 className="w-4 h-4 text-[#3C7049]" />}
        />
        <StatCard
          title="Median Response ETA"
          value="5.8"
          unit="minutes"
          subtitle="Urban zone average"
          status="surgical"
          icon={<Clock className="w-4 h-4 text-[#3E6B8E]" />}
        />
        <StatCard
          title="Trauma ICU Status"
          value="Optimal"
          unit="green"
          subtitle="Zero diversions active"
          status="clinical"
          icon={<Activity className="w-4 h-4 text-[#3C7049]" />}
        />
      </div>

      {/* Google Maps Platform Live Fleet & Trauma Radar */}
      <div className="space-y-2">
        <GoogleFacilitiesMap />
      </div>

      {/* Main Grid: Incident Queue & Dispatch Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Incident Queue (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#7A7568]">
              Emergency Incidents Queue
            </h3>
            <span className="text-xs font-mono text-[#B03A28]">Live Intake</span>
          </div>

          <div className="space-y-2.5">
            {incidents.map((inc) => {
              const isSelected = inc.id === activeIncident?.id;
              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncidentId(inc.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#FBFBF7] border-l-4 border-l-[#B03A28] border-t-[#E7E4DC] border-r-[#E7E4DC] border-b-[#E7E4DC] shadow-xs'
                      : 'bg-[#F4F2EE] border-[#E7E4DC] hover:bg-[#EAE7DF]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-semibold text-xs text-[#22241F]">
                      {inc.patientName}
                    </span>
                    <Badge variant={inc.status === 'IDLE' ? 'neutral' : 'emergency'} size="xs">
                      {inc.status}
                    </Badge>
                  </div>

                  <p className="text-xs text-[#5A564C] mt-1 line-clamp-2">{inc.chiefComplaint}</p>

                  <div className="flex items-center justify-between text-[11px] font-mono text-[#7A7568] pt-2 mt-2 border-t border-[#E7E4DC]/60">
                    <span className="flex items-center gap-1 truncate max-w-[180px]">
                      <MapPin className="w-3 h-3 shrink-0" /> {inc.addressDescription}
                    </span>
                    <span className="font-semibold text-[#22241F] shrink-0">
                      {inc.assignedUnitId || 'Unassigned'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Regional Hospital Bed Capacity Status */}
          <Card padding="md" variant="surface" className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#7A7568]">
              Regional Hospital Bed Availability
            </h4>
            <div className="space-y-2 text-xs">
              {facilities.map((fac) => (
                <div
                  key={fac.id}
                  className="p-2.5 bg-[#F4F2EE] border border-[#E7E4DC] rounded-lg flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold text-[#22241F]">{fac.name}</span>
                    <div className="text-[10px] text-[#5A564C]">
                      Type: {fac.type.replace('_', ' ')} • {fac.distanceKm} km away
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-[#3C7049]">
                      {fac.edBedsAvailable} ED / {fac.icuBedsAvailable} ICU beds
                    </span>
                    <div className="text-[9px] font-mono text-[#7A7568] uppercase">
                      Status: {fac.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Dispatch Detail & State Machine Console (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {activeIncident && (
            <Card padding="lg" variant="surface" className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7E4DC] pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#7A7568]">
                    Incident Record: {activeIncident.id}
                  </span>
                  <h2 className="text-lg font-semibold text-[#22241F] mt-0.5">
                    {activeIncident.patientName} — {activeIncident.chiefComplaint}
                  </h2>
                </div>
                <Badge variant={activeIncident.status === 'IDLE' ? 'neutral' : 'emergency'} size="md">
                  {activeIncident.status}
                </Badge>
              </div>

              {/* Coordinates and Unit Dispatch Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-[#F4F2EE] p-3 rounded-lg border border-[#E7E4DC] space-y-1">
                  <span className="font-mono text-[10px] uppercase text-[#7A7568]">Exact GPS Coordinates</span>
                  <p className="font-mono font-semibold text-[#22241F]">
                    {activeIncident.coordinates.lat}° N, {activeIncident.coordinates.lng}° W
                  </p>
                  <p className="text-[11px] text-[#5A564C]">{activeIncident.addressDescription}</p>
                </div>

                <div className="bg-[#F4F2EE] p-3 rounded-lg border border-[#E7E4DC] space-y-1">
                  <span className="font-mono text-[10px] uppercase text-[#7A7568]">Assigned Emergency Unit</span>
                  <p className="font-mono font-semibold text-[#22241F]">
                    {activeIncident.assignedUnitId || 'MEDIC-44 (Paramedic Advanced)'}
                  </p>
                  <p className="text-[11px] text-[#3E6B8E] font-mono">Code 3 Response</p>
                </div>

                <div className="bg-[#F4F2EE] p-3 rounded-lg border border-[#E7E4DC] space-y-1">
                  <span className="font-mono text-[10px] uppercase text-[#7A7568]">Receiving Facility</span>
                  <p className="font-mono font-semibold text-[#22241F]">
                    {activeIncident.targetFacilityName}
                  </p>
                  <p className="text-[11px] text-[#3C7049] font-mono">Trauma Team Standby</p>
                </div>
              </div>

              {/* Dispatch State Transition Controls */}
              <div className="p-4 bg-[#F4F2EE] border border-[#E7E4DC] rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#22241F]">
                    EOC State Machine Controls
                  </span>
                  <span className="text-[10px] font-mono text-[#7A7568]">
                    Strict Finite Transition Protocol
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="surgical"
                    onClick={() => advanceState('RESPONDER_DISPATCHED', 'Ambulance team dispatched under siren.')}
                  >
                    Confirm Dispatch
                  </Button>
                  <Button
                    size="sm"
                    variant="surgical"
                    onClick={() => advanceState('EN_ROUTE', 'Unit MEDIC-44 has arrived at scene.')}
                  >
                    Mark En-Route
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => advanceState('RESOLVED', 'Patient transferred to trauma resuscitation bay.')}
                  >
                    Resolve & Close
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      emergencyDispatch.resetSimulation(activeIncident.id);
                      setIncidents(store.getIncidents());
                    }}
                  >
                    Reset to Idle
                  </Button>
                </div>
              </div>

              {/* Transition Audit Log */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#7A7568] mb-3">
                  Incident State Transition Ledger
                </h4>
                <div className="space-y-2.5 text-xs">
                  {activeIncident.transitions.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#FBFBF7] border border-[#E7E4DC] rounded-lg flex items-start justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#22241F]">{t.status}</span>
                          <span className="font-mono text-[10px] text-[#7A7568]">
                            by {t.actor}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5A564C]">{t.metadata}</p>
                      </div>
                      <span className="font-mono text-[10px] text-[#7A7568] shrink-0">
                        {new Date(t.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
