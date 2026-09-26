import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle,
  Siren,
  Shield,
  MapPin,
  Clock,
  PhoneCall,
  CheckCircle,
  RotateCcw,
  Building2,
  Navigation,
} from 'lucide-react';
import { store } from '../../services/store';
import { emergencyDispatch } from '../../services/emergency/dispatch';
import { EmergencyIncident, SOSStatus } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { toast } from '../../hooks/useToast';

export const EmergencyPage: React.FC = () => {
  const [incidents, setIncidents] = useState(store.getIncidents());
  const activeIncident = incidents[0] || null;

  // Hold-to-activate timer state
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startHold = () => {
    setIsHolding(true);
    setHoldProgress(0);
    const stepMs = 25;
    const totalMs = 2500; // 2.5 seconds hold
    const inc = (stepMs / totalMs) * 100;

    holdIntervalRef.current = setInterval(() => {
      setHoldProgress((prev) => {
        if (prev + inc >= 100) {
          clearInterval(holdIntervalRef.current!);
          triggerSOS();
          return 100;
        }
        return prev + inc;
      });
    }, stepMs);
  };

  const endHold = () => {
    setIsHolding(false);
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
    }
    setHoldProgress(0);
  };

  const triggerSOS = () => {
    setIsHolding(false);
    if (!activeIncident) return;

    emergencyDispatch.transitionState(
      activeIncident.id,
      'CONNECTING',
      'Patient Eleanor Vance',
      'Deliberate 2.5s hold-to-activate triggered from client device.'
    );
    setIncidents(store.getIncidents());

    toast({
      type: 'EMERGENCY',
      title: 'Emergency State Machine Engaged',
      message: 'SIMULATION: Dispatch sequence initiated. Synthesizing GPS & facility routing.',
    });

    // Auto-advance simulation sequence
    setTimeout(() => {
      emergencyDispatch.transitionState(
        activeIncident.id,
        'LOCATION_CONFIRMED',
        'Telemetry Gateway',
        'GPS Coordinates confirmed: 37.7749° N, 122.4194° W (Accuracy: 4.2m)'
      );
      setIncidents(store.getIncidents());
    }, 1500);

    setTimeout(() => {
      emergencyDispatch.transitionState(
        activeIncident.id,
        'FACILITY_IDENTIFIED',
        'Regional Dispatch EOC',
        'Metropolitan General Trauma Level 1 selected (Bed availability verified)'
      );
      setIncidents(store.getIncidents());
    }, 3200);

    setTimeout(() => {
      emergencyDispatch.transitionState(
        activeIncident.id,
        'RESPONDER_DISPATCHED',
        'Sarah Jenkins (Dispatcher)',
        'Paramedic Unit MEDIC-44 dispatched. Code 3 priority.'
      );
      setIncidents(store.getIncidents());
    }, 4800);
  };

  const manualAdvance = (nextStatus: SOSStatus, message: string) => {
    if (!activeIncident) return;
    emergencyDispatch.transitionState(activeIncident.id, nextStatus, 'Operations Supervisor', message);
    setIncidents(store.getIncidents());
  };

  const resetSimulation = () => {
    if (!activeIncident) return;
    emergencyDispatch.resetSimulation(activeIncident.id);
    setIncidents(store.getIncidents());
    toast({
      type: 'INFO',
      title: 'SOS Simulation Reset',
      message: 'Incident status returned to IDLE.',
    });
  };

  const statusProgression: SOSStatus[] = [
    'IDLE',
    'CONNECTING',
    'LOCATION_CONFIRMED',
    'NETWORK_CONTACTED',
    'FACILITY_IDENTIFIED',
    'RESPONDER_DISPATCHED',
    'EN_ROUTE',
    'RESOLVED',
  ];

  const currentStatusIndex = activeIncident
    ? statusProgression.indexOf(activeIncident.status)
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Truthful Mandatory Warning Banner */}
      <div className="bg-[#FBE9E7] border-2 border-[#B03A28] rounded-xl p-5 text-[#852516] space-y-2 shadow-md">
        <div className="flex items-center gap-2.5 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-[#B03A28] shrink-0" />
          <span>SIMULATION MODE — NOT A LIVE 911/112 CONNECTION</span>
        </div>
        <p className="text-xs leading-relaxed">
          This interface is an interactive state-machine demonstration of the VIRENZA emergency dispatch coordination layer. <strong>No real emergency responders or 911/112 operators have been contacted.</strong> In an actual medical emergency, immediately dial your regional emergency phone number.
        </p>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E4DC] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-[#22241F]">
            Emergency SOS & Hospital Ingress Portal
          </h1>
          <p className="text-xs sm:text-sm text-[#5A564C] mt-1">
            Deterministic state machine coordinating patient telemetry, location validation, and hospital intake.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={resetSimulation} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
          Reset Simulation
        </Button>
      </div>

      {/* Primary SOS Action Trigger */}
      {activeIncident?.status === 'IDLE' ? (
        <Card variant="surface" padding="lg" className="text-center py-10 space-y-6">
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-semibold text-[#22241F]">
              Emergency Activation Control
            </h3>
            <p className="text-xs text-[#5A564C]">
              To prevent accidental touch triggers on mobile devices, hold the emergency button down continuously for 2.5 seconds to initiate the dispatch state machine.
            </p>
          </div>

          {/* Hold to Activate Button */}
          <div className="flex flex-col items-center justify-center">
            <button
              onMouseDown={startHold}
              onMouseUp={endHold}
              onMouseLeave={endHold}
              onTouchStart={startHold}
              onTouchEnd={endHold}
              className="relative w-36 h-36 rounded-full bg-[#B03A28] text-white flex flex-col items-center justify-center font-semibold text-sm shadow-xl active:scale-95 transition-transform select-none cursor-pointer overflow-hidden group"
            >
              {/* Progress Ring Overlay */}
              <div
                className="absolute inset-0 bg-[#852516] transition-all"
                style={{
                  clipPath: `polygon(0 0, 100% 0, 100% ${holdProgress}%, 0 ${holdProgress}%)`,
                }}
              />
              <Siren className="w-8 h-8 relative z-10 animate-pulse mb-1" />
              <span className="relative z-10 font-mono text-xs">
                {isHolding ? `${Math.round(holdProgress)}%` : 'HOLD 2.5s'}
              </span>
              <span className="relative z-10 text-[10px] tracking-widest uppercase">
                EMERGENCY SOS
              </span>
            </button>
            <span className="text-[11px] font-mono text-[#7A7568] mt-3">
              Press and hold continuously
            </span>
          </div>
        </Card>
      ) : (
        /* Active Emergency State Machine Tracking */
        <div className="space-y-6">
          {/* State Progression Tracker */}
          <Card variant="emergency" padding="md" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#B03A28]/30 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B03A28] animate-ping" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#852516] font-mono">
                  ACTIVE INCIDENT: {activeIncident?.id}
                </h3>
              </div>
              <Badge variant="emergency" size="sm">
                STATUS: {activeIncident?.status}
              </Badge>
            </div>

            {/* Stepper progression bar */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1 pt-2">
              {statusProgression.map((s, idx) => {
                const isPastOrCurrent = idx <= currentStatusIndex;
                const isCurrent = s === activeIncident?.status;

                return (
                  <div key={s} className="text-center space-y-1">
                    <div
                      className={`h-2 rounded-full transition-colors ${
                        isCurrent
                          ? 'bg-[#B03A28]'
                          : isPastOrCurrent
                          ? 'bg-[#3C7049]'
                          : 'bg-[#E7E4DC]'
                      }`}
                    />
                    <span
                      className={`block font-mono text-[9px] truncate ${
                        isCurrent ? 'font-bold text-[#B03A28]' : 'text-[#7A7568]'
                      }`}
                      title={s}
                    >
                      {s.replace('_', ' ')}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Ingress Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs">
              <div className="bg-[#FBFBF7] p-3 rounded-lg border border-[#E7E4DC] space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#7A7568] block">Validated Location</span>
                <p className="font-mono text-xs font-semibold text-[#22241F]">
                  {activeIncident?.location.coordinates.lat}° N, {activeIncident?.location.coordinates.lng}° W
                </p>
                <span className="text-[10px] text-[#5A564C]">{activeIncident?.location.address}</span>
              </div>

              <div className="bg-[#FBFBF7] p-3 rounded-lg border border-[#E7E4DC] space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#7A7568] block">Target Receiving Facility</span>
                <p className="font-mono text-xs font-semibold text-[#22241F]">
                  {activeIncident?.targetFacilityName}
                </p>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <Badge variant="clinical" size="xs">
                    REAL STATUS
                  </Badge>
                  <span className="text-[#3C7049]">14 Beds Available</span>
                </div>
              </div>

              <div className="bg-[#FBFBF7] p-3 rounded-lg border border-[#E7E4DC] space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#7A7568] block">Dispatched Unit</span>
                <p className="font-mono text-xs font-semibold text-[#22241F]">
                  {activeIncident?.assignedUnit || 'MEDIC-44 (Paramedic Advanced)'}
                </p>
                <span className="text-[10px] text-[#3E6B8E] font-mono">Estimated Arrival: 4 min</span>
              </div>
            </div>

            {/* Manual Simulation Controls */}
            <div className="pt-3 border-t border-[#B03A28]/20 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-mono text-[#852516]">
                Simulation Controls: Advance or resolve dispatch state:
              </span>
              <div className="flex gap-2">
                {activeIncident?.status !== 'RESOLVED' && (
                  <Button
                    size="sm"
                    variant="surgical"
                    onClick={() => manualAdvance('EN_ROUTE', 'Ambulance is en-route with sirens active.')}
                  >
                    Mark En-Route
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => manualAdvance('RESOLVED', 'Patient safely received at emergency intake.')}
                >
                  Resolve Incident
                </Button>
              </div>
            </div>
          </Card>

          {/* Immutable Transition History */}
          <Card variant="surface" padding="md">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#7A7568] font-mono mb-4">
              State Machine Transition History
            </h3>
            <div className="space-y-3">
              {activeIncident?.transitions.map((t, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 text-xs pb-3 border-b border-[#E7E4DC] last:border-0"
                >
                  <div className="mt-0.5">
                    <Badge variant={t.status === 'IDLE' ? 'neutral' : 'emergency'} size="xs">
                      {t.status}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#22241F]">{t.actor}</span>
                      <span className="font-mono text-[10px] text-[#7A7568]">{new Date(t.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-[#5A564C] mt-0.5">{t.metadata}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
