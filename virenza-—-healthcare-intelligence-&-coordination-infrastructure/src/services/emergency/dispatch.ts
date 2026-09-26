/**
 * VIRENZA Emergency Dispatch State Machine & Facility Ingress
 * Manages deliberate multi-stage SOS lifecycle and dispatch events.
 */

import { EmergencyIncident, SOSStatus } from '../../types';
import { store } from '../store';

export class EmergencyDispatchService {
  public transitionState(
    incidentId: string,
    nextStatus: SOSStatus,
    actorName: string,
    metadataMsg: string
  ): EmergencyIncident | null {
    const incidents = store.getIncidents();
    const incident = incidents.find((i) => i.id === incidentId);
    if (!incident) return null;

    const newTransition = {
      timestamp: new Date().toISOString(),
      status: nextStatus,
      actor: actorName,
      metadata: metadataMsg,
    };

    const updatedIncident: EmergencyIncident = {
      ...incident,
      status: nextStatus,
      transitions: [...incident.transitions, newTransition],
    };

    store.updateEmergencyIncident(incidentId, updatedIncident);

    store.addAuditLog({
      actorId: 'sys-emergency-engine',
      actorName: actorName,
      actorRole: 'EMERGENCY_OPERATOR',
      organizationId: 'org-eoc-regional',
      action: 'SOS_UPDATED',
      resourceType: 'EmergencyIncident',
      resourceId: incidentId,
      metadata: { from: incident.status, to: nextStatus, detail: metadataMsg },
    });

    return updatedIncident;
  }

  public resetSimulation(incidentId: string): EmergencyIncident | null {
    return this.transitionState(
      incidentId,
      'IDLE',
      'Operations Commander',
      'Simulation reset to baseline standby state.'
    );
  }
}

export const emergencyDispatch = new EmergencyDispatchService();
