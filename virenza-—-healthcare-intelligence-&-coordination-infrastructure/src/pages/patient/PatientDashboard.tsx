import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Calendar,
  Pill,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingDown,
  Lock,
  Plus,
  Heart,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { store } from '../../services/store';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/ui/StatCard';
import { toast } from '../../hooks/useToast';

export const PatientDashboard: React.FC = () => {
  const [profile, setProfile] = useState(store.getPatientProfile());
  const [medications, setMedications] = useState(profile.medications);
  const [timeline, setTimeline] = useState(profile.timeline);

  const toggleMedication = (id: string) => {
    const updated = medications.map((m) => {
      if (m.id === id) {
        const nextStatus = m.statusToday === 'TAKEN' ? 'PENDING' : 'TAKEN';
        toast({
          type: nextStatus === 'TAKEN' ? 'SUCCESS' : 'INFO',
          title: nextStatus === 'TAKEN' ? 'Dose Logged' : 'Dose Marked Pending',
          message: `${m.name} ${m.dose} marked as ${nextStatus.toLowerCase()}.`,
        });
        return { ...m, statusToday: nextStatus as 'TAKEN' | 'PENDING' };
      }
      return m;
    });
    setMedications(updated);
    store.updatePatientProfile((prev) => ({ ...prev, medications: updated }));
  };

  // Format chart vitals data
  const vitalsList = profile.vitalsHistory || [];
  const chartData = vitalsList.map((v) => ({
    time: v.timestamp && v.timestamp.includes('T') ? v.timestamp.split('T')[1].substring(0, 5) : '',
    date: v.timestamp && v.timestamp.includes('T') ? v.timestamp.split('T')[0].substring(5) : '',
    systolic: v.systolicBp,
    diastolic: v.diastolicBp,
    heartRate: v.heartRate,
    spo2: v.oxygenSaturation,
  }));

  const latestVitals = vitalsList.length > 0
    ? vitalsList[vitalsList.length - 1]
    : {
        systolicBp: 122,
        diastolicBp: 78,
        heartRate: 72,
        oxygenSaturation: 99,
        glucoseMgDl: 108,
      };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner: Clinical status summary & Demo indicator */}
      <div className="bg-[#F4F2EE] border border-[#E7E4DC] rounded-xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="clinical" size="xs">
              Synthetic Demo Record
            </Badge>
            <span className="text-xs font-mono text-[#7A7568]">MRN: {profile.mrn}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-[#22241F]">
            {getTimeGreeting()}, {profile.fullName.split(' ')[0]}.
          </h1>
          <p className="text-xs sm:text-sm text-[#5A564C] max-w-2xl">
            What you should know today: Blood pressure is within target range (122/78 mmHg). 1 medication dose pending for tonight. Next cardiology follow-up is in 14 days.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link to="/app/triage">
            <Button size="sm" variant="surgical" leftIcon={<Activity className="w-3.5 h-3.5" />}>
              AI Symptom Triage
            </Button>
          </Link>
          <Link to="/app/vault">
            <Button size="sm" variant="secondary" leftIcon={<Lock className="w-3.5 h-3.5" />}>
              Health Vault
            </Button>
          </Link>
          <Link to="/app/emergency">
            <Button size="sm" variant="danger" leftIcon={<AlertTriangle className="w-3.5 h-3.5" />}>
              Emergency SOS
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary Telemetry Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Blood Pressure"
          value={`${latestVitals.systolicBp}/${latestVitals.diastolicBp}`}
          unit="mmHg"
          subtitle="Target < 130/80"
          status="clinical"
          trend={{ direction: 'down', label: '-4 mmHg today', isPositive: true }}
          icon={<Activity className="w-4 h-4 text-[#3C7049]" />}
        />
        <StatCard
          title="Resting Heart Rate"
          value={latestVitals.heartRate}
          unit="bpm"
          subtitle="Normal sinus rhythm"
          status="clinical"
          trend={{ direction: 'neutral', label: 'Stable' }}
          icon={<Heart className="w-4 h-4 text-[#3C7049]" />}
        />
        <StatCard
          title="Oxygen Saturation"
          value={latestVitals.oxygenSaturation}
          unit="%"
          subtitle="Ambient room air"
          status="clinical"
          trend={{ direction: 'neutral', label: 'Optimal' }}
          icon={<Activity className="w-4 h-4 text-[#3C7049]" />}
        />
        <StatCard
          title="Blood Glucose"
          value={latestVitals.glucoseMgDl || 108}
          unit="mg/dL"
          subtitle="Fasting baseline"
          status="amber"
          trend={{ direction: 'down', label: '-8 mg/dL', isPositive: true }}
          icon={<Activity className="w-4 h-4 text-[#B8822E]" />}
        />
      </div>

      {/* Main Grid: Vitals Chart & Medication Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Vitals Trend Chart & Treatment Plan */}
        <div className="lg:col-span-8 space-y-6">
          <Card padding="md" variant="surface">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E7E4DC] pb-4 mb-4">
              <div>
                <h3 className="text-base font-semibold text-[#22241F]">
                  Vital Signs Trajectory (7-Day Telemetry)
                </h3>
                <span className="text-xs text-[#5A564C]">
                  Continuous home monitoring paired with Bluetooth cuff
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1 text-[#3C7049]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3C7049]" /> Systolic (mmHg)
                </span>
                <span className="flex items-center gap-1 text-[#3E6B8E]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3E6B8E]" /> Diastolic (mmHg)
                </span>
              </div>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E7E4DC" />
                  <XAxis dataKey="date" stroke="#7A7568" fontSize={11} tickLine={false} />
                  <YAxis domain={[60, 160]} stroke="#7A7568" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FBFBF7',
                      borderColor: '#E7E4DC',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="systolic"
                    name="Systolic BP"
                    stroke="#3C7049"
                    strokeWidth={2.5}
                    dot={{ fill: '#3C7049', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="diastolic"
                    name="Diastolic BP"
                    stroke="#3E6B8E"
                    strokeWidth={2}
                    dot={{ fill: '#3E6B8E', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Treatment Goals & Care Plan */}
          <Card padding="md" variant="surface">
            <h3 className="text-base font-semibold text-[#22241F] mb-4">
              Active Care Plan & Clinical Targets
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(profile.carePlan?.goals ?? [
                'Maintain resting blood pressure < 125/80 mmHg with daily telemetry sync',
                'Adhere to daily Rosuvastatin & lifestyle regimen with 95%+ consistency',
                'Complete bi-annual cardiovascular lipid & arterial stiffness panel',
              ]).map((goal, idx) => (
                <div
                  key={idx}
                  className="bg-[#F4F2EE] border border-[#E7E4DC] p-3.5 rounded-lg text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase text-[#7A7568]">Target {idx + 1}</span>
                    <Badge variant="clinical" size="xs">Active</Badge>
                  </div>
                  <p className="font-medium text-[#22241F]">{goal}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Unified Clinical Timeline */}
          <Card padding="md" variant="surface">
            <div className="flex items-center justify-between border-b border-[#E7E4DC] pb-3 mb-4">
              <h3 className="text-base font-semibold text-[#22241F]">
                Unified Clinical Timeline
              </h3>
              <span className="text-xs font-mono text-[#7A7568]">
                {timeline.length} Recorded Events
              </span>
            </div>

            <div className="space-y-4">
              {(timeline || []).map((event) => {
                const getBadgeVariant = (type: string, badgeType?: string) => {
                  if (badgeType === 'CLINICAL') return 'clinical' as const;
                  if (badgeType === 'AI_ASSISTED') return 'ai' as const;
                  if (badgeType === 'EMERGENCY') return 'emergency' as const;
                  if (badgeType === 'ROUTINE') return 'routine' as const;
                  switch (type) {
                    case 'LAB_RESULT':
                    case 'DOCUMENT':
                      return 'clinical' as const;
                    case 'VITAL_ALERT':
                      return 'routine' as const;
                    case 'TRIAGE':
                      return 'ai' as const;
                    case 'SOS_INCIDENT':
                      return 'emergency' as const;
                    case 'PRESCRIPTION':
                    case 'MEDICATION_CHANGE':
                      return 'amber' as const;
                    case 'CONSULTATION':
                      return 'ai' as const;
                    default:
                      return 'neutral' as const;
                  }
                };

                return (
                  <div
                    key={event.id}
                    className="flex items-start gap-3.5 pb-3 border-b border-[#E7E4DC]/60 last:border-0"
                  >
                    <div className="mt-0.5">
                      <Badge variant={getBadgeVariant(event.type, (event as any).badgeType)} size="xs">
                        {event.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex-1 text-xs">
                      <div className="flex items-baseline justify-between">
                        <span className="font-semibold text-[#22241F]">{event.title}</span>
                        <span className="text-[11px] font-mono text-[#7A7568]">
                          {event.timestamp
                            ? new Date(event.timestamp).toLocaleDateString([], {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : (event as any).date || ''}
                        </span>
                      </div>
                      <p className="text-[#5A564C] mt-0.5">{event.summary || (event as any).description}</p>
                      <div className="mt-1 text-[11px] font-mono text-[#7A7568]">
                        Source: {event.author || (event as any).clinician || 'Care Team'}
                        {(event as any).facility ? ` • ${(event as any).facility}` : ''}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right 4 Cols: Daily Medication Adherence & Upcoming Care */}
        <div className="lg:col-span-4 space-y-6">
          {/* Medications Checklist */}
          <Card padding="md" variant="surface">
            <div className="flex items-center justify-between border-b border-[#E7E4DC] pb-3 mb-3">
              <div>
                <h3 className="text-sm font-semibold text-[#22241F]">
                  Daily Medication Adherence
                </h3>
                <span className="text-[11px] text-[#5A564C]">Tap to confirm dose</span>
              </div>
              <Pill className="w-4 h-4 text-[#3C7049]" />
            </div>

            <div className="space-y-2.5">
              {(medications || []).map((med) => {
                const isTaken = med.statusToday === 'TAKEN';
                return (
                  <div
                    key={med.id}
                    onClick={() => toggleMedication(med.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isTaken
                        ? 'bg-[#D9EBDE]/30 border-[#3C7049]/40'
                        : 'bg-[#F4F2EE] border-[#E7E4DC] hover:border-[#3C7049]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs font-semibold text-[#22241F] flex items-center gap-1.5">
                          <span>{med.name}</span>
                          <span className="font-mono text-[11px] text-[#7A7568]">{med.dose}</span>
                        </div>
                        <p className="text-[11px] text-[#5A564C] mt-0.5">{med.instructions}</p>
                        <div className="mt-1 text-[10px] font-mono text-[#7A7568] flex items-center gap-2">
                          <span>Refills: {med.refillsRemaining}</span>
                          <span>•</span>
                          <span>Prescriber: {med.prescriber}</span>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                          isTaken
                            ? 'bg-[#3C7049] border-[#3C7049] text-white'
                            : 'border-[#7A7568] bg-[#FBFBF7]'
                        }`}
                      >
                        {isTaken && <CheckCircle className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Upcoming Consultations */}
          <Card padding="md" variant="surface">
            <div className="flex items-center justify-between border-b border-[#E7E4DC] pb-3 mb-3">
              <h3 className="text-sm font-semibold text-[#22241F]">
                Upcoming Consultations
              </h3>
              <Calendar className="w-4 h-4 text-[#3E6B8E]" />
            </div>

            <div className="space-y-3 text-xs">
              {(profile.appointments || []).map((appt) => (
                <div key={appt.id} className="p-3 bg-[#F4F2EE] rounded-lg border border-[#E7E4DC] space-y-1">
                  <div className="flex items-center justify-between font-semibold text-[#22241F]">
                    <span>{appt.specialty}</span>
                    <span className="font-mono text-[11px] text-[#3C7049]">{appt.type.replace('_', ' ')}</span>
                  </div>
                  <p className="text-[11px] text-[#5A564C]">
                    {appt.clinicianName || (appt as any).doctor} • {appt.facility || (appt as any).location}
                  </p>
                  <div className="text-[11px] font-mono text-[#7A7568] flex items-center gap-1 pt-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      {appt.scheduledTime
                        ? new Date(appt.scheduledTime).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })
                        : (appt as any).dateTime || 'Scheduled'}{' '}
                      ({appt.durationMinutes} min)
                    </span>
                  </div>
                </div>
              ))}
              {(!profile.appointments || profile.appointments.length === 0) && (
                <p className="text-xs text-[#7A7568] italic py-2">No upcoming consultations scheduled.</p>
              )}
            </div>
          </Card>

          {/* Encrypted Vault Access Banner */}
          <div className="bg-[#22241F] text-[#FBFBF7] rounded-xl p-5 border border-[#3A3831] space-y-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#3C7049]" />
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#D9EBDE]">
                Encrypted Health Vault
              </h4>
            </div>
            <p className="text-xs text-[#CBC7BC] leading-relaxed">
              Store cardiology ECGs, lab bloodwork, and imaging securely encrypted on your browser with AES-256-GCM.
            </p>
            <Link to="/app/vault" className="block">
              <Button size="sm" variant="surgical" fullWidth rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Open Health Vault
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
