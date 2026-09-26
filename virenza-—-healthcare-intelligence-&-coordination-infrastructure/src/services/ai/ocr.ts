/**
 * VIRENZA Prescription Intelligence & OCR Pipeline
 * Provides optical character recognition abstraction, clinical normalization,
 * field-level confidence scoring, and clinician verification.
 */

import { PrescriptionExtractionResult } from '../../types';
import { store } from '../store';

export class PrescriptionOCRService {
  public async extractPrescription(fileName: string, _fileData?: string): Promise<PrescriptionExtractionResult> {
    // Deterministic simulation based on filename or standard prescription patterns
    const isSpecialty = fileName.toLowerCase().includes('cardio') || fileName.toLowerCase().includes('lipitor') || fileName.toLowerCase().includes('atorvastatin');

    const result: PrescriptionExtractionResult = {
      id: 'ocr-' + Date.now(),
      timestamp: new Date().toISOString(),
      sourceFileName: fileName,
      medicineName: {
        value: isSpecialty ? 'Atorvastatin Calcium' : 'Metformin Hydrochloride',
        confidence: 0.98,
        isUncertain: false,
      },
      activeIngredient: {
        value: isSpecialty ? 'Atorvastatin' : 'Metformin',
        confidence: 0.95,
        isUncertain: false,
      },
      strength: {
        value: isSpecialty ? '20 mg' : '500 mg',
        confidence: 0.96,
        isUncertain: false,
      },
      dose: {
        value: '1 tablet',
        confidence: 0.94,
        isUncertain: false,
      },
      frequency: {
        value: isSpecialty ? 'Once daily at bedtime' : 'Twice daily with meals',
        confidence: 0.91,
        isUncertain: false,
      },
      route: {
        value: 'Oral',
        confidence: 0.99,
        isUncertain: false,
      },
      duration: {
        value: '90 days (3 refills authorized)',
        confidence: 0.86,
        isUncertain: false,
      },
      instructions: {
        value: isSpecialty
          ? 'Take with or without food. Avoid excessive grapefruit consumption.'
          : 'Take with morning and evening meals to minimize gastrointestinal distress.',
        confidence: 0.78,
        isUncertain: true, // Marked as uncertain for clinician review
      },
      overallConfidence: 0.92,
      potentialInteractionsWarning: isSpecialty
        ? 'INTERACTION CHECK: Co-administration with CYP3A4 inhibitors (clarithromycin, itraconazole) increases statin myopathy risk.'
        : undefined,
      reviewStatus: 'PENDING_REVIEW',
    };

    store.addAuditLog({
      actorId: 'sys-ocr-pipeline',
      actorName: 'VIRENZA OCR Normalization Engine',
      actorRole: 'AI_HEALTH_ADMIN',
      organizationId: 'org-synthetix-ai',
      action: 'PRESCRIPTION_DECODED',
      resourceType: 'PrescriptionExtraction',
      resourceId: result.id,
      metadata: { fileName, confidence: result.overallConfidence },
    });

    return result;
  }

  public reviewPrescription(
    id: string,
    decision: 'ACCEPTED' | 'MODIFIED' | 'REJECTED',
    clinicianNotes?: string
  ): void {
    store.addAuditLog({
      actorId: 'usr-doctor-marcus',
      actorName: 'Dr. Marcus Vance, MD, FACC',
      actorRole: 'DOCTOR',
      organizationId: 'org-metro-health',
      action: 'AI_REVIEW',
      resourceType: 'PrescriptionExtraction',
      resourceId: id,
      metadata: { decision, clinicianNotes },
    });
  }
}

export const prescriptionOCR = new PrescriptionOCRService();
