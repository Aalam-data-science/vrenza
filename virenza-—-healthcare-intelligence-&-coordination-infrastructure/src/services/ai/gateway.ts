/**
 * VIRENZA AI Clinical Gateway & Safety Guardrail Engine
 * Strictly enforces human-in-the-loop clinical review and transparent uncertainty.
 */

import { TriageAssessment, UrgencyLevel, VitalSignReading } from '../../types';
import { store } from '../store';

export interface TriageInput {
  patientId: string;
  chiefConcern: string;
  symptoms: string[];
  duration: string;
  severityScore: number; // 1-10
  associatedSymptoms: string[];
  observedVitals?: Partial<VitalSignReading>;
  age?: number;
}

export class AIGatewayService {
  /**
   * Deterministic Clinical Rule Engine
   * Evaluates red flags, vital abnormalities, and symptom clusters.
   */
  public async evaluateTriage(input: TriageInput): Promise<TriageAssessment> {
    const textCorpus = [
      input.chiefConcern,
      ...input.symptoms,
      ...input.associatedSymptoms,
    ]
      .join(' ')
      .toLowerCase();

    const redFlags: string[] = [];
    const evidence: string[] = [];
    const uncertainty: string[] = [];

    // Red Flag Rules (Immediate EMERGENCY override)
    if (
      (textCorpus.includes('chest pain') || textCorpus.includes('chest pressure') || textCorpus.includes('tightness')) &&
      (textCorpus.includes('breath') || textCorpus.includes('arm') || textCorpus.includes('jaw') || textCorpus.includes('sweat'))
    ) {
      redFlags.push('Cardiovascular Red Flag: Acute chest pain with radiation or dyspnea.');
    }

    if (
      textCorpus.includes('facial droop') ||
      textCorpus.includes('slurred speech') ||
      textCorpus.includes('one-sided weakness') ||
      textCorpus.includes('stroke')
    ) {
      redFlags.push('Neurological Red Flag: Acute focal deficit / FAST criteria.');
    }

    if (
      (textCorpus.includes('throat') || textCorpus.includes('tongue') || textCorpus.includes('swelling')) &&
      (textCorpus.includes('breathing') || textCorpus.includes('wheezing') || textCorpus.includes('allergy'))
    ) {
      redFlags.push('Immunological Red Flag: Suspected anaphylaxis with airway compromise.');
    }

    if (
      textCorpus.includes('self-harm') ||
      textCorpus.includes('suicide') ||
      textCorpus.includes('end my life')
    ) {
      redFlags.push('Psychiatric Red Flag: Acute self-harm risk requiring immediate crisis intervention.');
    }

    // Vital sign abnormalities
    if (input.observedVitals) {
      const v = input.observedVitals;
      if (v.oxygenSaturation && v.oxygenSaturation < 92) {
        redFlags.push(`Critical Hypoxia: SpO2 measured at ${v.oxygenSaturation}%.`);
      }
      if (v.systolicBp && v.systolicBp >= 180) {
        redFlags.push(`Hypertensive Crisis Signal: Systolic BP ${v.systolicBp} mmHg.`);
      }
      if (v.heartRate && (v.heartRate > 130 || v.heartRate < 45)) {
        redFlags.push(`Hemodynamic Instability: Heart rate ${v.heartRate} bpm outside safe bounds.`);
      }
      if (v.temperatureC && v.temperatureC >= 39.5) {
        evidence.push(`High Hyperthermia: Temperature ${v.temperatureC}°C.`);
      }
    }

    // Determine Urgency
    let urgency: UrgencyLevel = 'ROUTINE';
    let urgencyReasoning = '';
    let recommendedAction = '';
    let confidence = 0.92;

    if (redFlags.length > 0 || input.severityScore >= 8) {
      urgency = 'EMERGENCY';
      urgencyReasoning =
        redFlags.length > 0
          ? `Clinical Red Flags Triggered (${redFlags.length}). Protocol mandates immediate escalation to emergency care.`
          : `Extreme self-reported symptom severity (${input.severityScore}/10) warrants immediate emergency evaluation.`;
      recommendedAction =
        'Seek immediate emergency medical evaluation or contact local emergency services immediately. Do not drive yourself.';
      confidence = 0.96;
    } else if (
      input.severityScore >= 5 ||
      input.symptoms.length >= 3 ||
      textCorpus.includes('fever') ||
      textCorpus.includes('infection') ||
      textCorpus.includes('edema') ||
      textCorpus.includes('bleeding')
    ) {
      urgency = 'URGENT';
      urgencyReasoning =
        'Moderate symptom cluster and acuity without acute hemodynamic compromise detected.';
      recommendedAction =
        'Schedule an urgent clinical consultation within 24 hours. Monitor vital signs closely.';
      confidence = 0.88;
      uncertainty.push('Remote symptom assessment cannot substitute for physical auscultation or laboratory confirmation.');
    } else {
      urgency = 'ROUTINE';
      urgencyReasoning =
        'Low acuity symptom presentation consistent with routine ambulatory management.';
      recommendedAction =
        'Maintain planned outpatient follow-up. Record vital signs in your Health Vault.';
      confidence = 0.85;
      uncertainty.push('Self-reported symptom onset duration may vary in subjective perception.');
    }

    evidence.push(`Reported chief concern: "${input.chiefConcern}"`);
    evidence.push(`Acuity score: ${input.severityScore}/10 across duration ${input.duration}`);

    const assessment: TriageAssessment = {
      id: 'tri-' + Date.now(),
      patientId: input.patientId,
      timestamp: new Date().toISOString(),
      chiefConcern: input.chiefConcern,
      symptoms: input.symptoms,
      duration: input.duration,
      severityScore: input.severityScore,
      associatedSymptoms: input.associatedSymptoms,
      observedVitals: input.observedVitals,
      redFlagsTriggered: redFlags,
      urgency,
      urgencyReasoning,
      confidenceScore: confidence,
      uncertaintyFactors: uncertainty,
      evidenceSignals: evidence,
      recommendedAction,
      safetyWarning:
        'DISCLAIMER: VIRENZA AI Clinical Triage is an assistive decision-support algorithm, NOT a medical diagnosis. In case of sudden severe illness, contact emergency medical services immediately.',
      humanEscalationRequired: urgency !== 'ROUTINE',
      isSimulated: true,
    };

    // Append to audit log
    store.addAuditLog({
      actorId: 'sys-ai-gateway',
      actorName: 'VIRENZA AI Gateway Engine',
      actorRole: 'AI_HEALTH_ADMIN',
      organizationId: 'org-synthetix-ai',
      action: 'AI_TRIAGE',
      resourceType: 'TriageAssessment',
      resourceId: assessment.id,
      metadata: { urgency, redFlagsCount: redFlags.length, confidence },
    });

    return assessment;
  }
}

export const aiGateway = new AIGatewayService();
