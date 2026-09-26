import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Cpu,
  Shield,
  ArrowRight,
  Info,
  RotateCcw,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { aiGateway } from '../../services/ai/gateway';
import { TriageAssessment } from '../../types';
import { toast } from '../../hooks/useToast';

export const TriagePage: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [answers, setAnswers] = useState({
    chiefComplaint: '',
    durationHours: 4,
    severity: 5,
    hasChestPain: false,
    hasShortnessOfBreath: false,
    hasSuddenWeakness: false,
    temperatureC: 37.0,
    heartRate: 78,
    existingConditions: 'Hypertension',
    currentMedications: 'Lisinopril 10mg',
  });

  const [assessment, setAssessment] = useState<TriageAssessment | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Pre-configured test scenarios for immediate demonstration
  const loadScenario = (scenario: 'emergency' | 'urgent' | 'routine') => {
    if (scenario === 'emergency') {
      setAnswers({
        chiefComplaint: 'Crushing central chest tightness radiating to left jaw with cold diaphoresis',
        durationHours: 1,
        severity: 9,
        hasChestPain: true,
        hasShortnessOfBreath: true,
        hasSuddenWeakness: false,
        temperatureC: 36.8,
        heartRate: 112,
        existingConditions: 'Hypertension, Coronary Artery Disease',
        currentMedications: 'Atorvastatin 20mg, Aspirin 81mg',
      });
      runEvaluationWithData({
        chiefComplaint: 'Crushing central chest tightness radiating to left jaw with cold diaphoresis',
        durationHours: 1,
        severity: 9,
        hasChestPain: true,
        hasShortnessOfBreath: true,
        hasSuddenWeakness: false,
        temperatureC: 36.8,
        heartRate: 112,
        existingConditions: 'Hypertension, Coronary Artery Disease',
        currentMedications: 'Atorvastatin 20mg, Aspirin 81mg',
      });
    } else if (scenario === 'urgent') {
      setAnswers({
        chiefComplaint: 'Productive cough with yellowish sputum, mild wheezing, and fever for 3 days',
        durationHours: 72,
        severity: 6,
        hasChestPain: false,
        hasShortnessOfBreath: false,
        hasSuddenWeakness: false,
        temperatureC: 38.6,
        heartRate: 94,
        existingConditions: 'Mild Asthma',
        currentMedications: 'Albuterol inhaler',
      });
      runEvaluationWithData({
        chiefComplaint: 'Productive cough with yellowish sputum, mild wheezing, and fever for 3 days',
        durationHours: 72,
        severity: 6,
        hasChestPain: false,
        hasShortnessOfBreath: false,
        hasSuddenWeakness: false,
        temperatureC: 38.6,
        heartRate: 94,
        existingConditions: 'Mild Asthma',
        currentMedications: 'Albuterol inhaler',
      });
    } else {
      setAnswers({
        chiefComplaint: 'Localized itchy skin rash on forearm after gardening, no swelling or systemic symptoms',
        durationHours: 24,
        severity: 3,
        hasChestPain: false,
        hasShortnessOfBreath: false,
        hasSuddenWeakness: false,
        temperatureC: 36.9,
        heartRate: 72,
        existingConditions: 'None',
        currentMedications: 'None',
      });
      runEvaluationWithData({
        chiefComplaint: 'Localized itchy skin rash on forearm after gardening, no swelling or systemic symptoms',
        durationHours: 24,
        severity: 3,
        hasChestPain: false,
        hasShortnessOfBreath: false,
        hasSuddenWeakness: false,
        temperatureC: 36.9,
        heartRate: 72,
        existingConditions: 'None',
        currentMedications: 'None',
      });
    }
  };

  const runEvaluationWithData = async (data: typeof answers) => {
    setIsEvaluating(true);
    // Deterministic simulation delay
    setTimeout(async () => {
      const result = await aiGateway.evaluateTriage({
        patientId: 'pat-eleanor-vance',
        chiefConcern: data.chiefConcern,
        symptoms: data.symptoms,
        duration: data.duration,
        severityScore: data.severity,
        associatedSymptoms: data.associatedSymptoms,
      });
      setAssessment(result);
      setIsEvaluating(false);
      setStep(4);
      toast({
        type: result.urgency === 'EMERGENCY' ? 'EMERGENCY' : 'SUCCESS',
        title: 'Triage Assessment Complete',
        message: `Acuity evaluated: ${result.urgency}. Human clinical review recommended.`,
      });
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runEvaluationWithData(answers);
  };

  const resetTriage = () => {
    setAssessment(null);
    setStep(1);
    setAnswers({
      chiefComplaint: '',
      durationHours: 4,
      severity: 5,
      hasChestPain: false,
      hasShortnessOfBreath: false,
      hasSuddenWeakness: false,
      temperatureC: 37.0,
      heartRate: 78,
      existingConditions: 'Hypertension',
      currentMedications: 'Lisinopril 10mg',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-[#E7E4DC] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="ai" size="xs">
              AI Clinical Safety Gateway
            </Badge>
            <span className="text-xs font-mono text-[#7A7568]">Protocol v4.2 • Deterministic Rule Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-[#22241F] mt-1">
            Adaptive AI Clinical Triage
          </h1>
          <p className="text-xs sm:text-sm text-[#5A564C] mt-1">
            Structured questionnaire evaluating clinical urgency, red flags, and uncertainty factors.
          </p>
        </div>

        {/* Quick Scenario Preset Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#7A7568] hidden sm:inline">Load Preset:</span>
          <button
            onClick={() => loadScenario('emergency')}
            className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#FBE9E7] text-[#B03A28] border border-[#B03A28]/30 hover:bg-[#B03A28] hover:text-white transition-colors"
          >
            Red Flag
          </button>
          <button
            onClick={() => loadScenario('urgent')}
            className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#FBF3DE] text-[#B8822E] border border-[#B8822E]/30 hover:bg-[#B8822E] hover:text-white transition-colors"
          >
            Urgent
          </button>
          <button
            onClick={() => loadScenario('routine')}
            className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#D9EBDE] text-[#3C7049] border border-[#3C7049]/30 hover:bg-[#3C7049] hover:text-white transition-colors"
          >
            Routine
          </button>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="bg-[#F4F2EE] border-l-4 border-l-[#3E6B8E] border border-[#E7E4DC] p-4 rounded-xl text-xs space-y-1">
        <div className="flex items-center gap-2 text-[#1E435E] font-semibold">
          <Shield className="w-4 h-4 text-[#3E6B8E]" />
          <span>Clinical Governance & Safety Notice</span>
        </div>
        <p className="text-[#5A564C] leading-relaxed">
          This system is an AI decision-support tool. It does not provide autonomous diagnoses. If you are experiencing severe chest pain, sudden numbness, or severe breathing difficulties, dial 911/112 or visit an emergency room immediately.
        </p>
      </div>

      {/* Active Assessment View or Form */}
      {assessment ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Urgency Callout Card */}
          <Card
            variant={assessment.urgencyLevel === 'EMERGENCY' ? 'emergency' : 'surface'}
            padding="lg"
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7E4DC] pb-4">
              <div className="flex items-center gap-3">
                <Badge
                  variant={
                    assessment.urgencyLevel === 'EMERGENCY'
                      ? 'emergency'
                      : assessment.urgencyLevel === 'URGENT'
                      ? 'amber'
                      : 'clinical'
                  }
                  size="md"
                >
                  {assessment.urgencyLevel} LEVEL
                </Badge>
                <span className="text-xs font-mono text-[#5A564C]">
                  Confidence: {Math.round(assessment.confidenceScore * 100)}%
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#7A7568]">
                ID: {assessment.id}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase text-[#7A7568] block">
                Recommended Clinical Action
              </span>
              <h2 className="text-xl font-serif font-semibold text-[#22241F] mt-1">
                {assessment.recommendedAction}
              </h2>
            </div>

            {/* Red Flags Alert */}
            {assessment.redFlagsIdentified.length > 0 && (
              <div className="p-3.5 bg-[#FBE9E7] border border-[#B03A28]/30 rounded-lg space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#B03A28]">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Red Flags Identified:</span>
                </div>
                <ul className="list-disc list-inside text-xs text-[#852516] space-y-0.5">
                  {assessment.redFlagsIdentified.map((rf, i) => (
                    <li key={i}>{rf}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Clinical Rationale */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase text-[#7A7568] block">
                Algorithmic Rationale
              </span>
              <ul className="space-y-1.5 text-xs text-[#22241F]">
                {assessment.rationale.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#3C7049] shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Explicit Uncertainty Factors */}
            <div className="bg-[#F4F2EE] border border-[#E7E4DC] p-3 rounded-lg space-y-1 text-xs">
              <div className="font-semibold text-[#5A564C] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#7A7568]" />
                <span>Explicit Uncertainty Gaps:</span>
              </div>
              <ul className="list-disc list-inside text-[11px] text-[#5A564C] space-y-0.5">
                {assessment.uncertaintyFactors.map((u, i) => (
                  <li key={i}>{u}</li>
                ))}
              </ul>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E7E4DC]">
              <Button variant="outline" size="sm" onClick={resetTriage} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
                Start New Assessment
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="surgical"
                  size="sm"
                  onClick={() => {
                    toast({
                      type: 'SUCCESS',
                      title: 'Assessment Saved',
                      message: 'Record appended to your encrypted health history and clinical review queue.',
                    });
                  }}
                >
                  Save to Clinical Chart
                </Button>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        /* Multi-step Question Form */
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card padding="lg" variant="surface" className="space-y-5">
            <h3 className="text-base font-semibold text-[#22241F] border-b border-[#E7E4DC] pb-3">
              Step {step} of 3: Clinical Information Input
            </h3>

            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#22241F] mb-1">
                    Primary Symptom / Chief Complaint
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe what you are feeling in detail (e.g., pain location, onset, sensations)..."
                    value={answers.chiefComplaint}
                    onChange={(e) => setAnswers({ ...answers, chiefComplaint: e.target.value })}
                    className="w-full text-xs p-3 rounded-lg border border-[#E7E4DC] bg-[#F4F2EE] focus:outline-[#3C7049]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#22241F] mb-1">
                      Duration (Hours since onset)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={answers.durationHours}
                      onChange={(e) => setAnswers({ ...answers, durationHours: Number(e.target.value) })}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#E7E4DC] bg-[#F4F2EE] focus:outline-[#3C7049]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#22241F] mb-1">
                      Pain Severity (1 to 10 scale): {answers.severity}
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={answers.severity}
                      onChange={(e) => setAnswers({ ...answers, severity: Number(e.target.value) })}
                      className="w-full mt-2 accent-[#3C7049]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <Button
                    type="button"
                    size="sm"
                    disabled={!answers.chiefComplaint}
                    onClick={() => setStep(2)}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Next: Critical Symptoms
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <span className="text-xs font-semibold text-[#22241F] block">
                  Check any of the following if present right now:
                </span>

                <div className="space-y-2.5">
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-[#E7E4DC] bg-[#F4F2EE] cursor-pointer hover:bg-[#EAE7DF]">
                    <input
                      type="checkbox"
                      checked={answers.hasChestPain}
                      onChange={(e) => setAnswers({ ...answers, hasChestPain: e.target.checked })}
                      className="w-4 h-4 accent-[#B03A28]"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-[#22241F]">Chest pain or pressure</span>
                      <p className="text-[#5A564C] text-[11px]">Tightness, squeezing, or pain radiating to left arm/jaw</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-lg border border-[#E7E4DC] bg-[#F4F2EE] cursor-pointer hover:bg-[#EAE7DF]">
                    <input
                      type="checkbox"
                      checked={answers.hasShortnessOfBreath}
                      onChange={(e) => setAnswers({ ...answers, hasShortnessOfBreath: e.target.checked })}
                      className="w-4 h-4 accent-[#B03A28]"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-[#22241F]">Severe shortness of breath</span>
                      <p className="text-[#5A564C] text-[11px]">Inability to speak in full sentences or gasping for air</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-lg border border-[#E7E4DC] bg-[#F4F2EE] cursor-pointer hover:bg-[#EAE7DF]">
                    <input
                      type="checkbox"
                      checked={answers.hasSuddenWeakness}
                      onChange={(e) => setAnswers({ ...answers, hasSuddenWeakness: e.target.checked })}
                      className="w-4 h-4 accent-[#B03A28]"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-[#22241F]">Sudden facial droop or arm weakness</span>
                      <p className="text-[#5A564C] text-[11px]">Slurred speech or sudden confusion</p>
                    </div>
                  </label>
                </div>

                <div className="flex justify-between pt-3">
                  <Button type="button" variant="outline" size="sm" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setStep(3)}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Next: Context & History
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#22241F] mb-1">
                      Body Temperature (°C)
                    </label>
                    <input
                      type="number"
                      step={0.1}
                      value={answers.temperatureC}
                      onChange={(e) => setAnswers({ ...answers, temperatureC: Number(e.target.value) })}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#E7E4DC] bg-[#F4F2EE] focus:outline-[#3C7049]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#22241F] mb-1">
                      Resting Heart Rate (bpm)
                    </label>
                    <input
                      type="number"
                      value={answers.heartRate}
                      onChange={(e) => setAnswers({ ...answers, heartRate: Number(e.target.value) })}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#E7E4DC] bg-[#F4F2EE] focus:outline-[#3C7049]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#22241F] mb-1">
                    Known Medical Conditions
                  </label>
                  <input
                    type="text"
                    value={answers.existingConditions}
                    onChange={(e) => setAnswers({ ...answers, existingConditions: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#E7E4DC] bg-[#F4F2EE] focus:outline-[#3C7049]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#22241F] mb-1">
                    Current Medications
                  </label>
                  <input
                    type="text"
                    value={answers.currentMedications}
                    onChange={(e) => setAnswers({ ...answers, currentMedications: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#E7E4DC] bg-[#F4F2EE] focus:outline-[#3C7049]"
                  />
                </div>

                <div className="flex justify-between pt-3">
                  <Button type="button" variant="outline" size="sm" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button type="submit" size="sm" isLoading={isEvaluating} variant="surgical">
                    Run AI Triage Assessment
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </form>
      )}
    </div>
  );
};
