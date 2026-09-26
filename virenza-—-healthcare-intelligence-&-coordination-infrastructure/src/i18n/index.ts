/**
 * VIRENZA Multi-Language Internationalization Service
 * Supports English, Hindi, Spanish, Arabic, French with context switching.
 */

import { useState, useEffect } from 'react';

export type SupportedLanguage = 'en' | 'hi' | 'es' | 'ar' | 'fr';

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    tagline: 'Healthcare, connected by intelligence.',
    subtagline:
      'An intelligent coordination layer for patients, clinicians, health systems, emergency operations and health data.',
    explorePlatform: 'Explore the Platform',
    requestBriefing: 'Request Enterprise Briefing',
    patientPortal: 'Patient Intelligence',
    clinicianCommand: 'Clinician Command',
    operationsCenter: 'Emergency & Operations',
    sentinel: 'SENTINEL Bio-Surveillance',
    healthVault: 'Encrypted Health Vault',
    aiTriage: 'AI Clinical Triage',
    adminGovernance: 'Enterprise Governance',
    demoModeNotice: 'SIMULATION MODE — All data is synthetic and internally consistent.',
    emergencyNotice: 'SIMULATION — In a real medical emergency, call local emergency services immediately.',
    emergencySos: 'Emergency SOS',
    holdToActivate: 'Hold 2.5s to Activate SOS',
    auditLedger: 'Immutable Audit Ledger',
    clientEncrypted: 'Encrypted on your device (AES-256-GCM)',
    aiAssistedNotice: 'AI-assisted — clinician review required',
  },
  hi: {
    tagline: 'स्वास्थ्य सेवा, बुद्धिमत्ता से जुड़ी हुई।',
    subtagline:
      'रोगियों, चिकित्सकों, स्वास्थ्य प्रणालियों, आपातकालीन संचालन और स्वास्थ्य डेटा के लिए एक बुद्धिमान समन्वय परत।',
    explorePlatform: 'मंच का अन्वेषण करें',
    requestBriefing: 'उद्यम ब्रीफिंग का अनुरोध करें',
    patientPortal: 'रोगी बुद्धिमत्ता',
    clinicianCommand: 'चिकित्सक कमांड केंद्र',
    operationsCenter: 'आपातकालीन एवं संचालन केंद्र',
    sentinel: 'सेंटिनल जैव-निगरानी',
    healthVault: 'एन्क्रिप्टेड स्वास्थ्य वॉल्ट',
    aiTriage: 'एआई नैदानिक ट्राइएज',
    adminGovernance: 'उद्यम प्रशासन',
    demoModeNotice: 'सिमुलेशन मोड — सभी डेटा सिंथेटिक और आंतरिक रूप से सुसंगत है।',
    emergencyNotice: 'सिमुलेशन — वास्तविक आपात स्थिति में तुरंत स्थानीय आपातकालीन नंबर पर कॉल करें।',
    emergencySos: 'आपातकालीन एसओएस',
    holdToActivate: 'एसओएस सक्रिय करने के लिए 2.5 सेकंड दबाए रखें',
    auditLedger: 'अपरिवर्तनीय ऑडिट लेज़र',
    clientEncrypted: 'आपके उपकरण पर एन्क्रिप्टेड (AES-256-GCM)',
    aiAssistedNotice: 'एआई-सहायता प्राप्त — चिकित्सक समीक्षा आवश्यक',
  },
  es: {
    tagline: 'Atención médica conectada por inteligencia.',
    subtagline:
      'Una capa de coordinación inteligente para pacientes, médicos, sistemas de salud, operaciones de emergencia y datos clínicos.',
    explorePlatform: 'Explorar la Plataforma',
    requestBriefing: 'Solicitar Reunión Corporativa',
    patientPortal: 'Portal del Paciente',
    clinicianCommand: 'Comando Clínico',
    operationsCenter: 'Centro de Operaciones',
    sentinel: 'Bio-Vigilancia SENTINEL',
    healthVault: 'Bóveda de Salud Encriptada',
    aiTriage: 'Triaje Clínico con IA',
    adminGovernance: 'Gobernanza Empresarial',
    demoModeNotice: 'MODO DE SIMULACIÓN — Todos los datos son sintéticos y consistentes.',
    emergencyNotice: 'SIMULACIÓN — En una emergencia médica real, llame a los servicios locales de inmediato.',
    emergencySos: 'SOS de Emergencia',
    holdToActivate: 'Mantenga 2.5s para Activar SOS',
    auditLedger: 'Registro de Auditoría Inmutable',
    clientEncrypted: 'Encriptado en su dispositivo (AES-256-GCM)',
    aiAssistedNotice: 'Asistido por IA — se requiere revisión médica',
  },
  ar: {
    tagline: 'الرعاية الصحية، متصلة بالذكاء.',
    subtagline:
      'طبقة تنسيق ذكية للمرضى والأطباء والأنظمة الصحية وعمليات الطوارئ والبيانات الصحية.',
    explorePlatform: 'استكشف المنصة',
    requestBriefing: 'طلب إحاطة للمؤسسات',
    patientPortal: 'ذكاء المريض',
    clinicianCommand: 'مركز قيادة الأطباء',
    operationsCenter: 'العمليات والطوارئ',
    sentinel: 'سنتينل للمراقبة الوبائية',
    healthVault: 'خزينة الصحة المشفرة',
    aiTriage: 'الفرز السريري بالذكاء الاصطناعي',
    adminGovernance: 'الحوكمة المؤسسية',
    demoModeNotice: 'وضع المحاكاة — جميع البيانات تخليقية ومتسقة داخليًا.',
    emergencyNotice: 'محاكاة — في حالات الطوارئ الطبية الفعلية، اتصل بخدمات الطوارئ فوراً.',
    emergencySos: 'استغاثة الطوارئ',
    holdToActivate: 'اضغط مطولاً لمدة 2.5 ثانية للتفعيل',
    auditLedger: 'سجل التدقيق غير القابل للتعديل',
    clientEncrypted: 'مشفر على جهازك (AES-256-GCM)',
    aiAssistedNotice: 'بمساعدة الذكاء الاصطناعي — يلزم مراجعة الطبيب',
  },
  fr: {
    tagline: 'La santé, reliée par l’intelligence.',
    subtagline:
      'Une infrastructure de coordination intelligente pour les patients, les cliniciens, les hôpitaux et les urgences.',
    explorePlatform: 'Explorer la Plateforme',
    requestBriefing: 'Demander un Briefing Entreprise',
    patientPortal: 'Espace Patient',
    clinicianCommand: 'Poste Clinique',
    operationsCenter: 'Opérations & Urgences',
    sentinel: 'Surveillance SENTINEL',
    healthVault: 'Coffre-fort Santé Chiffré',
    aiTriage: 'Triage Clinique IA',
    adminGovernance: 'Gouvernance Entreprise',
    demoModeNotice: 'MODE SIMULATION — Toutes les données sont synthétiques.',
    emergencyNotice: 'SIMULATION — En cas d’urgence vitale, contactez immédiatement le SAMU/112.',
    emergencySos: 'SOS Urgence',
    holdToActivate: 'Maintenir 2,5s pour Activer le SOS',
    auditLedger: 'Registre d’Audit Immuable',
    clientEncrypted: 'Chiffré sur votre appareil (AES-256-GCM)',
    aiAssistedNotice: 'Assistance IA — validation médicale requise',
  },
};

let currentLang: SupportedLanguage = 'en';
const listeners = new Set<(lang: SupportedLanguage) => void>();

export function setLanguage(lang: SupportedLanguage) {
  currentLang = lang;
  if (typeof window !== 'undefined') {
    localStorage.setItem('virenza_language', lang);
  }
  listeners.forEach((fn) => fn(lang));
}

export function getLanguage(): SupportedLanguage {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('virenza_language') as SupportedLanguage;
    if (saved && TRANSLATIONS[saved]) {
      currentLang = saved;
    }
  }
  return currentLang;
}

export function useI18n() {
  const [lang, setLang] = useState<SupportedLanguage>(getLanguage());

  useEffect(() => {
    const handler = (newLang: SupportedLanguage) => setLang(newLang);
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  const t = (key: string): string => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key;
  };

  return { lang, setLanguage, t };
}
