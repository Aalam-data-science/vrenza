/**
 * VIRENZA FHIR R4 Interoperability Adapter
 * Translates domain entities to standard HL7 FHIR R4 JSON schemas.
 */

import { PatientProfile } from '../../types';

export class FHIRAdapter {
  public static toFHIRPatient(profile: PatientProfile) {
    return {
      resourceType: 'Patient',
      id: profile.id,
      identifier: [
        {
          use: 'usual',
          system: 'urn:oid:virenza:mrn',
          value: profile.mrn,
        },
      ],
      active: true,
      name: [
        {
          use: 'official',
          family: profile.fullName.split(' ').slice(-1)[0],
          given: profile.fullName.split(' ').slice(0, -1),
        },
      ],
      telecom: [
        {
          system: 'phone',
          value: profile.primaryPhone,
          use: 'mobile',
        },
      ],
      gender: profile.gender.toLowerCase(),
      birthDate: profile.dateOfBirth,
    };
  }

  public static toFHIRObservations(profile: PatientProfile) {
    return profile.vitalsHistory.map((vital) => ({
      resourceType: 'Observation',
      id: vital.id,
      status: 'final',
      category: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/observation-category',
              code: 'vital-signs',
              display: 'Vital Signs',
            },
          ],
        },
      ],
      subject: {
        reference: `Patient/${profile.id}`,
      },
      effectiveDateTime: vital.timestamp,
      component: [
        {
          code: {
            coding: [{ system: 'http://loinc.org', code: '8480-6', display: 'Systolic blood pressure' }],
          },
          valueQuantity: { value: vital.systolicBp, unit: 'mmHg', system: 'http://unitsofmeasure.org' },
        },
        {
          code: {
            coding: [{ system: 'http://loinc.org', code: '8462-4', display: 'Diastolic blood pressure' }],
          },
          valueQuantity: { value: vital.diastolicBp, unit: 'mmHg', system: 'http://unitsofmeasure.org' },
        },
        {
          code: {
            coding: [{ system: 'http://loinc.org', code: '8867-4', display: 'Heart rate' }],
          },
          valueQuantity: { value: vital.heartRate, unit: 'beats/minute', system: 'http://unitsofmeasure.org' },
        },
        {
          code: {
            coding: [{ system: 'http://loinc.org', code: '2708-6', display: 'Oxygen saturation' }],
          },
          valueQuantity: { value: vital.oxygenSaturation, unit: '%', system: 'http://unitsofmeasure.org' },
        },
      ],
    }));
  }

  public static toFHIRBundle(profile: PatientProfile) {
    return {
      resourceType: 'Bundle',
      type: 'collection',
      entry: [
        { resource: this.toFHIRPatient(profile) },
        ...this.toFHIRObservations(profile).map((obs) => ({ resource: obs })),
      ],
    };
  }
}
