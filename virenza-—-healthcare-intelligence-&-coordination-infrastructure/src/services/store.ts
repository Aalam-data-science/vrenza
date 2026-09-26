/**
 * VIRENZA Centralized Persistent Data Store
 * Persistent across sessions via localStorage with deterministic seed initialization.
 */

import {
  PatientProfile,
  PatientQueueItem,
  ClinicalNote,
  VaultDocument,
  ShareToken,
  EmergencyIncident,
  FacilityCapacity,
  SentinelSignal,
  InsurerMember,
  ClaimSignalItem,
  SystemHealthMetric,
  FeatureFlag,
  SubscriptionPlan,
  SimulatedInvoice,
  AuditEvent,
  User,
  Organization,
} from '../types';

import {
  SEED_ORGANIZATIONS,
  DEMO_USERS,
  SEED_PATIENT_PROFILE,
  SEED_PATIENT_QUEUE,
  SEED_CLINICAL_NOTES,
  SEED_DOCUMENTS,
  SEED_SHARE_TOKENS,
  SEED_FACILITIES,
  SEED_INCIDENTS,
  SEED_SENTINEL_SIGNALS,
  SEED_INSURER_MEMBERS,
  SEED_CLAIM_SIGNALS,
  SEED_SYSTEM_HEALTH,
  SEED_FEATURE_FLAGS,
  SEED_SUBSCRIPTION_PLANS,
  SEED_INVOICES,
  SEED_AUDIT_LOGS,
} from '../data/seed';

const STORAGE_KEY = 'virenza_platform_db_v2';

interface PlatformDatabaseState {
  users: (User & { passwordHash: string })[];
  organizations: Organization[];
  patientProfile: PatientProfile;
  patientQueue: PatientQueueItem[];
  clinicalNotes: ClinicalNote[];
  documents: VaultDocument[];
  shareTokens: ShareToken[];
  incidents: EmergencyIncident[];
  facilities: FacilityCapacity[];
  sentinelSignals: SentinelSignal[];
  insurerMembers: InsurerMember[];
  claimSignals: ClaimSignalItem[];
  systemHealth: SystemHealthMetric[];
  featureFlags: FeatureFlag[];
  subscriptionPlans: SubscriptionPlan[];
  invoices: SimulatedInvoice[];
  auditLogs: AuditEvent[];
  activeUserPlan: string;
}

function getInitialState(): PlatformDatabaseState {
  return {
    users: [...DEMO_USERS],
    organizations: [...SEED_ORGANIZATIONS],
    patientProfile: JSON.parse(JSON.stringify(SEED_PATIENT_PROFILE)),
    patientQueue: JSON.parse(JSON.stringify(SEED_PATIENT_QUEUE)),
    clinicalNotes: JSON.parse(JSON.stringify(SEED_CLINICAL_NOTES)),
    documents: JSON.parse(JSON.stringify(SEED_DOCUMENTS)),
    shareTokens: JSON.parse(JSON.stringify(SEED_SHARE_TOKENS)),
    incidents: JSON.parse(JSON.stringify(SEED_INCIDENTS)),
    facilities: JSON.parse(JSON.stringify(SEED_FACILITIES)),
    sentinelSignals: JSON.parse(JSON.stringify(SEED_SENTINEL_SIGNALS)),
    insurerMembers: JSON.parse(JSON.stringify(SEED_INSURER_MEMBERS)),
    claimSignals: JSON.parse(JSON.stringify(SEED_CLAIM_SIGNALS)),
    systemHealth: JSON.parse(JSON.stringify(SEED_SYSTEM_HEALTH)),
    featureFlags: JSON.parse(JSON.stringify(SEED_FEATURE_FLAGS)),
    subscriptionPlans: JSON.parse(JSON.stringify(SEED_SUBSCRIPTION_PLANS)),
    invoices: JSON.parse(JSON.stringify(SEED_INVOICES)),
    auditLogs: JSON.parse(JSON.stringify(SEED_AUDIT_LOGS)),
    activeUserPlan: 'PLUS',
  };
}

class VirenzaStore {
  private state: PlatformDatabaseState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.load();
  }

  private load(): PlatformDatabaseState {
    const initial = getInitialState();
    if (typeof window === 'undefined') return initial;
    try {
      const serialized = localStorage.getItem(STORAGE_KEY);
      if (serialized) {
        const parsed = JSON.parse(serialized);
        // Merge with initial state to guarantee newly added fields and collections are populated
        return {
          ...initial,
          ...parsed,
          patientProfile: {
            ...initial.patientProfile,
            ...(parsed.patientProfile || {}),
            carePlan: {
              ...initial.patientProfile.carePlan,
              ...(parsed.patientProfile?.carePlan || {}),
              goals:
                parsed.patientProfile?.carePlan?.goals && Array.isArray(parsed.patientProfile.carePlan.goals)
                  ? parsed.patientProfile.carePlan.goals
                  : initial.patientProfile.carePlan?.goals || [],
            },
            appointments:
              Array.isArray(parsed.patientProfile?.appointments) && parsed.patientProfile.appointments.length > 0
                ? parsed.patientProfile.appointments
                : initial.patientProfile.appointments,
            vitalsHistory:
              Array.isArray(parsed.patientProfile?.vitalsHistory) && parsed.patientProfile.vitalsHistory.length > 0
                ? parsed.patientProfile.vitalsHistory
                : initial.patientProfile.vitalsHistory,
            medications:
              Array.isArray(parsed.patientProfile?.medications) && parsed.patientProfile.medications.length > 0
                ? parsed.patientProfile.medications
                : initial.patientProfile.medications,
            timeline:
              Array.isArray(parsed.patientProfile?.timeline) && parsed.patientProfile.timeline.length > 0
                ? parsed.patientProfile.timeline
                : initial.patientProfile.timeline,
          },
        };
      }
    } catch (e) {
      console.warn('Virenza store state recovery:', e);
    }
    const fresh = getInitialState();
    this.save(fresh);
    return fresh;
  }

  private save(state: PlatformDatabaseState) {
    this.state = state;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (err) {
        console.warn('Virenza storage sync warning:', err);
      }
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public resetAll() {
    const fresh = getInitialState();
    this.save(fresh);
  }

  public resetToSeed() {
    this.resetAll();
  }

  // Getters
  public getUsers() {
    return this.state.users;
  }
  public getOrganizations() {
    return this.state.organizations;
  }
  public getPatientProfile(): PatientProfile {
    if (!this.state.patientProfile) {
      this.state.patientProfile = JSON.parse(JSON.stringify(SEED_PATIENT_PROFILE));
    }
    if (!this.state.patientProfile.carePlan || !Array.isArray(this.state.patientProfile.carePlan.goals)) {
      this.state.patientProfile.carePlan = {
        primaryFocus: 'Cardiovascular Risk Reduction & Arterial Elasticity',
        reviewDate: '2026-10-24',
        bpTarget: '< 125/80 mmHg',
        goals: [
          'Maintain resting blood pressure < 125/80 mmHg with daily telemetry sync',
          'Adhere to daily Rosuvastatin & lifestyle regimen with 95%+ consistency',
          'Complete bi-annual cardiovascular lipid & arterial stiffness panel',
        ],
      };
    }
    if (!Array.isArray(this.state.patientProfile.appointments)) {
      this.state.patientProfile.appointments = JSON.parse(JSON.stringify(SEED_PATIENT_PROFILE.appointments));
    }
    if (!Array.isArray(this.state.patientProfile.medications)) {
      this.state.patientProfile.medications = JSON.parse(JSON.stringify(SEED_PATIENT_PROFILE.medications));
    }
    if (!Array.isArray(this.state.patientProfile.vitalsHistory)) {
      this.state.patientProfile.vitalsHistory = JSON.parse(JSON.stringify(SEED_PATIENT_PROFILE.vitalsHistory));
    }
    if (!Array.isArray(this.state.patientProfile.timeline)) {
      this.state.patientProfile.timeline = JSON.parse(JSON.stringify(SEED_PATIENT_PROFILE.timeline));
    }
    return this.state.patientProfile;
  }
  public getPatientQueue() {
    return this.state.patientQueue;
  }
  public getClinicalNotes() {
    return this.state.clinicalNotes;
  }
  public getDocuments() {
    return this.state.documents;
  }
  public getShareTokens() {
    return this.state.shareTokens;
  }
  public getIncidents() {
    return this.state.incidents;
  }
  public getFacilities() {
    return this.state.facilities;
  }
  public getSentinelSignals() {
    return this.state.sentinelSignals;
  }
  public getInsurerMembers() {
    return this.state.insurerMembers;
  }
  public getClaimSignals() {
    return this.state.claimSignals;
  }
  public getSystemHealth() {
    return this.state.systemHealth;
  }
  public getFeatureFlags() {
    return this.state.featureFlags;
  }
  public getSubscriptionPlans() {
    return this.state.subscriptionPlans;
  }
  public getInvoices() {
    return this.state.invoices;
  }
  public getAuditLogs() {
    return this.state.auditLogs;
  }
  public getActivePlan() {
    return this.state.activeUserPlan;
  }

  // Mutations
  public updatePatientProfile(updater: (prev: PatientProfile) => PatientProfile) {
    const next = updater(this.state.patientProfile);
    this.save({ ...this.state, patientProfile: next });
  }

  public addVitalSign(vital: Omit<PatientProfile['vitalsHistory'][0], 'id'>) {
    const id = 'vit-' + Date.now();
    const newVital = { ...vital, id };
    this.updatePatientProfile((prev) => ({
      ...prev,
      vitalsHistory: [newVital, ...prev.vitalsHistory],
    }));
  }

  public updatePatientQueueItem(id: string, partial: Partial<PatientQueueItem>) {
    const updated = this.state.patientQueue.map((item) =>
      item.id === id ? { ...item, ...partial } : item
    );
    this.save({ ...this.state, patientQueue: updated });
  }

  public addClinicalNote(note: Omit<ClinicalNote, 'id' | 'createdAt'>) {
    const newNote: ClinicalNote = {
      ...note,
      id: 'note-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    this.save({
      ...this.state,
      clinicalNotes: [newNote, ...this.state.clinicalNotes],
    });
    return newNote;
  }

  public updateClinicalNote(id: string, partial: Partial<ClinicalNote>) {
    const updated = this.state.clinicalNotes.map((n) =>
      n.id === id ? { ...n, ...partial } : n
    );
    this.save({ ...this.state, clinicalNotes: updated });
  }

  public addDocument(doc: Omit<VaultDocument, 'id' | 'dateCreated'>) {
    const newDoc: VaultDocument = {
      ...doc,
      id: 'doc-' + Date.now(),
      dateCreated: new Date().toISOString(),
    };
    this.save({
      ...this.state,
      documents: [newDoc, ...this.state.documents],
    });
    return newDoc;
  }

  public deleteDocument(id: string) {
    this.save({
      ...this.state,
      documents: this.state.documents.filter((d) => d.id !== id),
      shareTokens: this.state.shareTokens.map((st) => ({
        ...st,
        documentIds: st.documentIds.filter((docId) => docId !== id),
      })),
    });
  }

  public createShareToken(
    documentIds: string[],
    recipientOrganization: string,
    duration: ShareToken['duration'],
    recipientEmail?: string
  ): ShareToken {
    const now = new Date();
    let expireHours = 24;
    if (duration === '15_MIN') expireHours = 0.25;
    if (duration === '1_HOUR') expireHours = 1;
    if (duration === '24_HOURS') expireHours = 24;

    const expiresAt = new Date(now.getTime() + expireHours * 60 * 60 * 1000).toISOString();
    const tokenCode = 'VRZ-SHR-' + Math.floor(1000 + Math.random() * 9000);

    const newToken: ShareToken = {
      id: 'tok-' + Date.now(),
      tokenCode,
      patientId: this.state.patientProfile.id,
      documentIds,
      recipientOrganization,
      recipientEmail,
      duration,
      createdAt: now.toISOString(),
      expiresAt,
      isRevoked: false,
      accessCount: 0,
    };

    this.save({
      ...this.state,
      shareTokens: [newToken, ...this.state.shareTokens],
    });

    return newToken;
  }

  public revokeShareToken(id: string) {
    const updated = this.state.shareTokens.map((t) =>
      t.id === id
        ? { ...t, isRevoked: true, revokedAt: new Date().toISOString() }
        : t
    );
    this.save({ ...this.state, shareTokens: updated });
  }

  public recordTokenAccess(tokenCode: string): { success: boolean; reason?: string; token?: ShareToken } {
    const token = this.state.shareTokens.find((t) => t.tokenCode === tokenCode);
    if (!token) {
      return { success: false, reason: 'Share token code not found.' };
    }
    if (token.isRevoked) {
      return { success: false, reason: 'This share link was revoked by the patient.' };
    }
    if (new Date(token.expiresAt).getTime() < Date.now()) {
      return { success: false, reason: 'This share link has expired.' };
    }

    const updated = this.state.shareTokens.map((t) =>
      t.id === token.id
        ? {
            ...t,
            accessCount: t.accessCount + 1,
            lastAccessedAt: new Date().toISOString(),
          }
        : t
    );
    this.save({ ...this.state, shareTokens: updated });
    return { success: true, token };
  }

  public updateEmergencyIncident(id: string, partial: Partial<EmergencyIncident>) {
    const updated = this.state.incidents.map((inc) =>
      inc.id === id ? { ...inc, ...partial } : inc
    );
    this.save({ ...this.state, incidents: updated });
  }

  public toggleFeatureFlag(key: string) {
    const updated = this.state.featureFlags.map((f) =>
      f.key === key ? { ...f, enabled: !f.enabled } : f
    );
    this.save({ ...this.state, featureFlags: updated });
  }

  public setActivePlan(plan: string) {
    this.save({ ...this.state, activeUserPlan: plan });
  }

  public addAuditLog(event: Omit<AuditEvent, 'id' | 'timestamp' | 'ipHash'>) {
    const newLog: AuditEvent = {
      ...event,
      id: 'aud-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      ipHash: 'sha256:' + Math.random().toString(36).substring(2, 10),
    };
    this.save({
      ...this.state,
      auditLogs: [newLog, ...this.state.auditLogs].slice(0, 200), // maintain last 200 append-only logs
    });
    return newLog;
  }
}

export const store = new VirenzaStore();
