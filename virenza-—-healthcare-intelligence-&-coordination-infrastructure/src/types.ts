/**
 * VIRENZA Healthcare Intelligence & Coordination Infrastructure
 * Core Domain Models & Strict Type Definitions
 */

export type UserRole =
  | 'PATIENT'
  | 'DOCTOR'
  | 'CLINIC_ADMIN'
  | 'EMERGENCY_OPERATOR'
  | 'HEALTH_SYSTEM_ADMIN'
  | 'INSURER_ADMIN'
  | 'GOVERNMENT_OPERATOR'
  | 'AI_HEALTH_ADMIN'
  | 'SUPER_ADMIN';

export type UserPermission =
  | 'patient.record.read.self'
  | 'patient.record.share'
  | 'clinical.patient.read'
  | 'clinical.patient.write'
  | 'clinical.ai.review'
  | 'emergency.incident.create'
  | 'emergency.incident.manage'
  | 'emergency.dispatch.view'
  | 'organization.admin'
  | 'audit.read'
  | 'insurance.member.read'
  | 'insurance.claims.view'
  | 'public_health.signal.read'
  | 'public_health.cluster.manage'
  | 'system.configuration.write'
  | 'ai.gateway.manage';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string;
  organizationName: string;
  permissions: UserPermission[];
  avatarUrl?: string;
  department?: string;
  title?: string;
  mfaEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  type: 'HOSPITAL' | 'HEALTH_SYSTEM' | 'INSURER' | 'GOVERNMENT' | 'EMERGENCY_SERVICES' | 'AI_HEALTH' | 'CLINIC';
  region: string;
  jurisdiction: string;
  activeFeatures: string[];
  complianceTier: 'STANDARD' | 'ENTERPRISE_HIGH_SECURITY';
}

export interface AuditEvent {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  organizationId: string;
  action:
    | 'LOGIN'
    | 'LOGOUT'
    | 'RECORD_VIEW'
    | 'RECORD_SHARED'
    | 'RECORD_REVOKED'
    | 'PRESCRIPTION_DECODED'
    | 'AI_TRIAGE'
    | 'AI_RECOMMENDATION'
    | 'AI_REVIEW'
    | 'SOS_CREATED'
    | 'SOS_UPDATED'
    | 'ADMIN_ACTION'
    | 'PERMISSION_CHANGED'
    | 'USER_CREATED'
    | 'USER_DELETED'
    | 'EXPORT_CREATED';
  resourceType: string;
  resourceId: string;
  timestamp: string;
  ipHash: string;
  metadata?: Record<string, unknown>;
}

// ----------------------------------------------------
// PATIENT DOMAIN
// ----------------------------------------------------

export interface VitalSignReading {
  id: string;
  timestamp: string;
  heartRate: number; // bpm
  systolicBp: number; // mmHg
  diastolicBp: number; // mmHg
  oxygenSaturation: number; // %
  respiratoryRate: number; // breaths/min
  temperatureC: number; // Celsius
  glucoseMgDl?: number;
}

export interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  route: string;
  prescribedBy: string;
  startDate: string;
  endDate?: string;
  status: 'ACTIVE' | 'DISCONTINUED' | 'COMPLETED';
  adherenceRate: number; // percentage 0-100
  instructions: string;
}

export interface AllergyItem {
  id: string;
  substance: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';
  reaction: string;
  recordedDate: string;
}

export interface AppointmentItem {
  id: string;
  clinicianId: string;
  clinicianName: string;
  specialty: string;
  facility: string;
  scheduledTime: string;
  durationMinutes: number;
  type: 'IN_PERSON' | 'TELEMEDICINE' | 'FOLLOW_UP';
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  reason: string;
  notes?: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: 'ENCOUNTER' | 'TRIAGE' | 'PRESCRIPTION' | 'DOCUMENT' | 'LAB_RESULT' | 'VITAL_ALERT' | 'SOS_INCIDENT';
  title: string;
  summary: string;
  author: string;
  badgeType?: 'CLINICAL' | 'AI_ASSISTED' | 'EMERGENCY' | 'ROUTINE';
}

export interface CarePlan {
  goals: string[];
  primaryFocus?: string;
  reviewDate?: string;
  targetA1c?: string;
  bpTarget?: string;
}

export interface PatientProfile {
  id: string;
  userId: string;
  mrn: string; // Medical Record Number
  fullName: string;
  dateOfBirth: string;
  gender: 'FEMALE' | 'MALE' | 'OTHER';
  bloodGroup: string;
  primaryPhone: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  vitalsHistory: VitalSignReading[];
  medications: MedicationItem[];
  allergies: AllergyItem[];
  appointments: AppointmentItem[];
  timeline: TimelineEvent[];
  carePlan?: CarePlan;
}

// ----------------------------------------------------
// CLINICAL DOMAIN
// ----------------------------------------------------

export interface PatientQueueItem {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  mrn: string;
  arrivalTime: string;
  acuityLevel: 'ROUTINE' | 'URGENT' | 'EMERGENT';
  chiefComplaint: string;
  vitalsSummary: string;
  status: 'WAITING' | 'TRIAGE_REVIEW' | 'IN_CONSULTATION' | 'DISCHARGE_PENDING';
  assignedClinicianId?: string;
  aiTriageSummary?: string;
  requiresReview: boolean;
}

export interface ClinicalNote {
  id: string;
  patientId: string;
  clinicianId: string;
  clinicianName: string;
  createdAt: string;
  type: 'SOAP' | 'CONSULT' | 'DISCHARGE_SUMMARY' | 'PROCEDURE';
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  aiAssistedSummary?: string;
  reviewStatus: 'PENDING_REVIEW' | 'ACCEPTED' | 'MODIFIED' | 'REJECTED';
}

// ----------------------------------------------------
// AI TRIAGE & PRESCRIPTION INTELLIGENCE
// ----------------------------------------------------

export type UrgencyLevel = 'ROUTINE' | 'URGENT' | 'EMERGENCY';

export interface TriageAssessment {
  id: string;
  patientId: string;
  timestamp: string;
  chiefConcern: string;
  symptoms: string[];
  duration: string;
  severityScore: number; // 1-10
  associatedSymptoms: string[];
  observedVitals?: Partial<VitalSignReading>;
  redFlagsTriggered: string[];
  urgency: UrgencyLevel;
  urgencyReasoning: string;
  confidenceScore: number; // 0.0 - 1.0
  uncertaintyFactors: string[];
  evidenceSignals: string[];
  recommendedAction: string;
  safetyWarning: string;
  humanEscalationRequired: boolean;
  isSimulated: boolean;
}

export interface PrescriptionExtractedField {
  value: string;
  confidence: number; // 0.0 - 1.0
  isUncertain: boolean;
}

export interface PrescriptionExtractionResult {
  id: string;
  timestamp: string;
  sourceFileName: string;
  medicineName: PrescriptionExtractedField;
  activeIngredient: PrescriptionExtractedField;
  strength: PrescriptionExtractedField;
  dose: PrescriptionExtractedField;
  frequency: PrescriptionExtractedField;
  route: PrescriptionExtractedField;
  duration: PrescriptionExtractedField;
  instructions: PrescriptionExtractedField;
  overallConfidence: number;
  potentialInteractionsWarning?: string;
  reviewStatus: 'PENDING_REVIEW' | 'ACCEPTED' | 'MODIFIED' | 'REJECTED';
  clinicianNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

// ----------------------------------------------------
// HEALTH VAULT & CRYPTO
// ----------------------------------------------------

export type VaultCategory =
  | 'labs'
  | 'radiology'
  | 'prescriptions'
  | 'vaccinations'
  | 'notes'
  | 'discharge'
  | 'insurance';

export interface VaultDocument {
  id: string;
  patientId: string;
  title: string;
  category: VaultCategory;
  dateCreated: string;
  fileSizeBytes: number;
  mimeType: string;
  isClientEncrypted: boolean;
  encryptionAlgorithm: 'AES-256-GCM' | 'NONE';
  keyFingerprint?: string;
  tags: string[];
  summary: string;
  contentPreview?: string;
  uploadedBy: string;
}

export interface ShareToken {
  id: string;
  tokenCode: string;
  patientId: string;
  documentIds: string[];
  recipientOrganization: string;
  recipientEmail?: string;
  duration: '15_MIN' | '1_HOUR' | '24_HOURS' | 'CUSTOM';
  createdAt: string;
  expiresAt: string;
  isRevoked: boolean;
  revokedAt?: string;
  accessCount: number;
  lastAccessedAt?: string;
}

// ----------------------------------------------------
// EMERGENCY DOMAIN
// ----------------------------------------------------

export type SOSStatus =
  | 'IDLE'
  | 'CONNECTING'
  | 'LOCATION_CONFIRMED'
  | 'NETWORK_CONTACTED'
  | 'FACILITY_IDENTIFIED'
  | 'RESPONDER_DISPATCHED'
  | 'EN_ROUTE'
  | 'RESOLVED';

export interface EmergencyTransition {
  timestamp: string;
  status: SOSStatus;
  actor: string;
  metadata: string;
}

export interface EmergencyIncident {
  id: string;
  patientId: string;
  patientName: string;
  status: SOSStatus;
  severity: 'MODERATE' | 'SEVERE' | 'CRITICAL';
  chiefComplaint: string;
  coordinates: {
    lat: number;
    lng: number;
    accuracyMeters: number;
  };
  addressDescription: string;
  targetFacilityName?: string;
  assignedUnitId?: string;
  etaMinutes?: number;
  transitions: EmergencyTransition[];
  isSimulation: boolean;
}

export interface FacilityCapacity {
  id: string;
  name: string;
  type: 'TERTIARY_TRAUMA' | 'REGIONAL_HOSPITAL' | 'COMMUNITY_CLINIC';
  icuBedsAvailable: number;
  icuBedsTotal: number;
  edBedsAvailable: number;
  edBedsTotal: number;
  status: 'REAL' | 'SIMULATED' | 'STALE';
  lastUpdated: string;
  distanceKm: number;
}

// ----------------------------------------------------
// PUBLIC HEALTH / SENTINEL
// ----------------------------------------------------

export type ThreatLevel = 'WATCH' | 'ELEVATED' | 'HIGH' | 'CRITICAL';

export interface SentinelSignal {
  id: string;
  pathogen: string;
  classification: string;
  region: string;
  coordinates: [number, number];
  firstDetected: string;
  casesReported: number;
  trend: 'INCREASING' | 'STABLE' | 'DECREASING';
  threatLevel: ThreatLevel;
  confidencePercent: number;
  sourceAgency: string;
  isSimulated: boolean;
  narrative: {
    whatChanged: string;
    whyItMatters: string;
    nextSignals: string;
    recommendedMonitoring: string;
  };
}

// ----------------------------------------------------
// INSURER DOMAIN
// ----------------------------------------------------

export interface InsurerMember {
  id: string;
  memberNumber: string;
  name: string;
  age: number;
  riskTier: 'LOW' | 'MODERATE' | 'HIGH' | 'RISING';
  chronicConditions: string[];
  careGapsIdentified: string[];
  lastEngagementDate: string;
  preventiveInterventionSuggested: string;
  projectedUtilizationScore: number; // 0-100
}

export interface ClaimSignalItem {
  id: string;
  memberId: string;
  memberName: string;
  providerName: string;
  serviceDate: string;
  serviceCategory: string;
  billedAmount: number;
  status: 'PROCESSING' | 'FLAGGED_CARE_GAP' | 'VERIFIED' | 'PREVENTIVE_TARGET';
  signalAnnotation: string;
}

// ----------------------------------------------------
// OPERATIONS & ADMIN
// ----------------------------------------------------

export interface SystemHealthMetric {
  service: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'MAINTENANCE';
  latencyMs: number;
  uptime30d: number;
  lastIncident?: string;
}

export interface FeatureFlag {
  key: string;
  label: string;
  enabled: boolean;
  description: string;
  scope: 'ALL_ORGS' | 'HOSPITALS_ONLY' | 'PILOT_ONLY';
}

// ----------------------------------------------------
// BILLING & SUBSCRIPTIONS
// ----------------------------------------------------

export type SubscriptionPlanId =
  | 'FREE'
  | 'PLUS'
  | 'CARE'
  | 'CLINICIAN_PRO'
  | 'ENTERPRISE';

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  name: string;
  priceMonthly: number;
  tagline: string;
  targetBuyer: string;
  features: string[];
}

export interface SimulatedInvoice {
  id: string;
  date: string;
  amount: number;
  planName: string;
  status: 'PAID' | 'PENDING';
  pdfRef: string;
}
