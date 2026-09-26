import React, { useState } from 'react';
import {
  Stethoscope,
  Activity,
  User,
  Search,
  CheckCircle,
  AlertTriangle,
  FileText,
  Clock,
  Scan,
  Cpu,
  Edit3,
  Check,
  X,
  ChevronRight,
  Shield,
  Pill,
} from 'lucide-react';
import { store } from '../../services/store';
import { prescriptionOCR } from '../../services/ai/ocr';
import { PatientQueueItem, PrescriptionExtractionResult } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { toast } from '../../hooks/useToast';

export const ClinicianCommandCenter: React.FC = () => {
  const [queue, setQueue] = useState<PatientQueueItem[]>(store.getPatientQueue());
  const [selectedQueueId, setSelectedQueueId] = useState<string>(queue[0]?.id || '');
  const [searchFilter, setSearchFilter] = useState('');
  const [acuityFilter, setAcuityFilter] = useState<string>('ALL');

  const profile = store.getPatientProfile(); // Eleanor Vance
  const activeQueuePatient = queue.find((p) => p.id === selectedQueueId) || queue[0];

  // SOAP Draft state with editing capability
  const [soapDraft, setSoapDraft] = useState({
    subjective:
      'Patient reports 4-week history of mild evening ankle edema and persistent dry cough after initiation of ACE-inhibitor (Lisinopril 10mg). Denies orthopnea, chest tightness, or paroxysmal nocturnal dyspnea.',
    objective:
      'BP 122/78 mmHg, HR 72 bpm, SpO2 98% room air. Bilateral breath sounds vesicular without wheezing. Trace non-pitting ankle edema bilaterally.',
    assessment:
      '1. Well-controlled essential hypertension.\n2. Likely ACE-inhibitor-induced dry cough vs seasonal post-nasal drip.\n3. Type 2 Diabetes Mellitus with optimal glycemic control (HbA1c 6.8%).',
    plan:
      '1. Discontinue Lisinopril 10mg.\n2. Initiate ARB (Losartan Potassium 50mg PO once daily).\n3. Recheck BMP (serum creatinine, potassium) in 14 days.\n4. Continue Atorvastatin 20mg and Metformin 500mg BID.\n5. Follow-up in clinic in 6 weeks.',
  });

  const [isEditingSoap, setIsEditingSoap] = useState(false);
  const [soapStatus, setSoapStatus] = useState<'PENDING' | 'ACCEPTED' | 'REJECTED'>('PENDING');
  const [mobileTab, setMobileTab] = useState<'queue' | 'chart' | 'ai'>('chart');

  // OCR Modal & Simulation state
  const [ocrModalOpen, setOcrModalOpen] = useState(false);
  const [ocrResult, setOcrResult] = useState<PrescriptionExtractionResult | null>(null);
  const [isScanningOCR, setIsScanningOCR] = useState(false);

  const handleScanPrescription = async (sampleName: string) => {
    setIsScanningOCR(true);
    setOcrResult(null);

    setTimeout(async () => {
      const result = await prescriptionOCR.extractPrescription(sampleName);
      setOcrResult(result);
      setIsScanningOCR(false);
      toast({
        type: 'SUCCESS',
        title: 'Prescription Scanned & Decoded',
        message: `OCR confidence: ${Math.round(result.overallConfidence * 100)}%. Field-level extraction ready for clinician review.`,
      });
    }, 700);
  };

  const handleAcceptSoap = () => {
    setSoapStatus('ACCEPTED');
    store.addAuditLog({
      actorId: 'usr-doctor-marcus',
      actorName: 'Dr. Marcus Vance, MD',
      actorRole: 'DOCTOR',
      organizationId: 'org-metro-health',
      action: 'AI_REVIEW',
      resourceType: 'ClinicalNote',
      resourceId: 'soap-' + Date.now(),
      metadata: { action: 'ACCEPTED', patientId: activeQueuePatient.id },
    });
    toast({
      type: 'SUCCESS',
      title: 'SOAP Note Signed & Appended',
      message: 'Clinical note formally committed to the patient’s permanent FHIR chart.',
    });
  };

  const handleRejectSoap = () => {
    setSoapStatus('REJECTED');
    store.addAuditLog({
      actorId: 'usr-doctor-marcus',
      actorName: 'Dr. Marcus Vance, MD',
      actorRole: 'DOCTOR',
      organizationId: 'org-metro-health',
      action: 'AI_REVIEW',
      resourceType: 'ClinicalNote',
      resourceId: 'soap-' + Date.now(),
      metadata: { action: 'REJECTED', reason: 'Clinician authored manual documentation' },
    });
    toast({
      type: 'INFO',
      title: 'AI Draft Rejected',
      message: 'Draft discarded. Documenting freeform clinical record.',
    });
  };

  // Filtered queue items
  const filteredQueue = queue.filter((p) => {
    const matchesSearch =
      p.patientName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.mrn.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.chiefComplaint.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesAcuity = acuityFilter === 'ALL' || p.acuityLevel === acuityFilter;
    return matchesSearch && matchesAcuity;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Clinical Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E4DC] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3C7049]" />
            <span className="text-xs font-mono uppercase tracking-wider text-[#7A7568]">
              Metropolitan Cardiology & Acute Triage Command
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-semibold text-[#22241F] mt-1">
            Clinician Decision Support Center
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setOcrModalOpen(true);
              handleScanPrescription('Rx_Atorvastatin_Metformin_2026.pdf');
            }}
            leftIcon={<Scan className="w-3.5 h-3.5 text-[#3E6B8E]" />}
          >
            Prescription OCR Tool
          </Button>
          <div className="font-mono text-xs bg-[#F4F2EE] border border-[#E7E4DC] px-3 py-1.5 rounded-lg text-[#22241F]">
            Attending: Dr. Marcus Vance, MD, FACC
          </div>
        </div>
      </div>

      {/* Mobile Responsive Segmented Control (< lg) */}
      <div className="lg:hidden flex items-center p-1 bg-[#E7E4DC]/60 rounded-xl border border-[#E7E4DC]">
        <button
          onClick={() => setMobileTab('queue')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            mobileTab === 'queue'
              ? 'bg-[#FBFBF7] text-[#22241F] shadow-xs'
              : 'text-[#5A564C] hover:text-[#22241F]'
          }`}
        >
          <span>Queue</span>
          <span className="font-mono text-[10px] bg-[#E7E4DC] px-1.5 py-0.5 rounded-full">
            {filteredQueue.length}
          </span>
        </button>
        <button
          onClick={() => setMobileTab('chart')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            mobileTab === 'chart'
              ? 'bg-[#FBFBF7] text-[#22241F] shadow-xs'
              : 'text-[#5A564C] hover:text-[#22241F]'
          }`}
        >
          <span>Patient Chart</span>
        </button>
        <button
          onClick={() => setMobileTab('ai')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            mobileTab === 'ai'
              ? 'bg-[#FBFBF7] text-[#22241F] shadow-xs'
              : 'text-[#5A564C] hover:text-[#22241F]'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-[#3E6B8E]" />
          <span>AI / SOAP</span>
        </button>
      </div>

      {/* Three-Pane Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pane 1 (Left 3 Cols): Clinical Queue */}
        <div className={`lg:col-span-3 space-y-3 ${mobileTab === 'queue' ? 'block' : 'hidden lg:block'}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#7A7568]">
              Patient Queue ({filteredQueue.length})
            </h3>
            <span className="text-[11px] font-mono text-[#3C7049]">Live ESI Triage</span>
          </div>

          {/* Search and Acuity Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#7A7568]" />
              <input
                type="text"
                placeholder="Search MRN or name..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 text-xs rounded-lg border border-[#E7E4DC] bg-[#FBFBF7] focus:outline-[#3C7049]"
              />
            </div>

            <div className="flex gap-1 text-[10px] font-mono">
              {['ALL', 'RED', 'AMBER', 'GREEN'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setAcuityFilter(lvl)}
                  className={`flex-1 py-1 rounded border transition-colors ${
                    acuityFilter === lvl
                      ? 'bg-[#22241F] text-white border-[#22241F]'
                      : 'bg-[#F4F2EE] text-[#5A564C] border-[#E7E4DC] hover:bg-[#EAE7DF]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Queue List */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredQueue.map((p) => {
              const isSelected = p.id === activeQueuePatient.id;
              const acuityBadge =
                p.acuityLevel === 'RED'
                  ? 'emergency'
                  : p.acuityLevel === 'AMBER'
                  ? 'amber'
                  : 'clinical';

              return (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedQueueId(p.id);
                    setMobileTab('chart');
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#FBFBF7] border-l-4 border-l-[#3C7049] border-t-[#E7E4DC] border-r-[#E7E4DC] border-b-[#E7E4DC] shadow-xs'
                      : 'bg-[#F4F2EE] border-[#E7E4DC] hover:bg-[#EAE7DF]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-semibold text-xs text-[#22241F]">{p.patientName}</span>
                    <Badge variant={acuityBadge} size="xs">
                      {p.acuityLevel}
                    </Badge>
                  </div>
                  <div className="font-mono text-[10px] text-[#7A7568] mt-0.5">
                    MRN: {p.mrn} • Age: {p.age}
                  </div>
                  <p className="text-[11px] text-[#5A564C] mt-1 line-clamp-1">{p.chiefComplaint}</p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#7A7568] pt-1 mt-1 border-t border-[#E7E4DC]/60">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Wait: {p.waitingTimeMinutes}m
                    </span>
                    <span>{p.assignedPhysician}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pane 2 (Center 5 Cols): Active Patient Chart */}
        <div className={`lg:col-span-5 space-y-4 ${mobileTab === 'chart' ? 'block' : 'hidden lg:block'}`}>
          {/* Patient Banner */}
          <Card padding="md" variant="surface" className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-[#22241F]">
                    {activeQueuePatient.patientName}
                  </h2>
                  <span className="font-mono text-xs text-[#7A7568]">
                    MRN: {activeQueuePatient.mrn}
                  </span>
                </div>
                <div className="text-xs text-[#5A564C] mt-0.5">
                  Age: {activeQueuePatient.age} • Gender: Female • Primary Dr: Dr. Marcus Vance
                </div>
              </div>
              <Badge variant={activeQueuePatient.acuityLevel === 'RED' ? 'emergency' : 'clinical'} size="sm">
                ESI Level {activeQueuePatient.acuityLevel === 'RED' ? '1 (Urgent)' : '3 (Stable)'}
              </Badge>
            </div>

            {/* Severe Allergy Alert */}
            <div className="p-2.5 bg-[#FBE9E7] border border-[#B03A28]/30 rounded-lg flex items-center justify-between text-xs text-[#852516]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#B03A28] shrink-0" />
                <span>
                  <strong>ALLERGIES:</strong> {profile.allergies.map((a) => `${a.substance} (${a.severity})`).join(', ')}
                </span>
              </div>
              <span className="font-mono text-[10px] uppercase font-bold text-[#B03A28]">
                CONTRAINDICATED: PENICILLIN
              </span>
            </div>

            {/* Current Vitals Snapshot */}
            <div className="grid grid-cols-4 gap-2 pt-1 text-center font-mono">
              <div className="bg-[#F4F2EE] p-2 rounded border border-[#E7E4DC]">
                <span className="text-[10px] text-[#7A7568] block">BP (mmHg)</span>
                <span className="text-xs font-semibold text-[#22241F]">122/78</span>
              </div>
              <div className="bg-[#F4F2EE] p-2 rounded border border-[#E7E4DC]">
                <span className="text-[10px] text-[#7A7568] block">HR (bpm)</span>
                <span className="text-xs font-semibold text-[#22241F]">72</span>
              </div>
              <div className="bg-[#F4F2EE] p-2 rounded border border-[#E7E4DC]">
                <span className="text-[10px] text-[#7A7568] block">SpO2 (%)</span>
                <span className="text-xs font-semibold text-[#22241F]">98%</span>
              </div>
              <div className="bg-[#F4F2EE] p-2 rounded border border-[#E7E4DC]">
                <span className="text-[10px] text-[#7A7568] block">Glucose</span>
                <span className="text-xs font-semibold text-[#22241F]">108 mg/dL</span>
              </div>
            </div>
          </Card>

          {/* Active Medications & Chronic Conditions */}
          <Card padding="md" variant="surface" className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#7A7568]">
              Active Medications & Verification
            </h3>
            <div className="space-y-2">
              {profile.medications.map((m) => (
                <div
                  key={m.id}
                  className="p-2.5 bg-[#F4F2EE] border border-[#E7E4DC] rounded-lg flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-[#22241F]">{m.name}</span>{' '}
                    <span className="font-mono text-[#5A564C]">{m.dosage}</span>
                    <p className="text-[11px] text-[#7A7568]">{m.instructions}</p>
                  </div>
                  <Badge variant={m.status === 'ACTIVE' ? 'clinical' : 'amber'} size="xs">
                    {m.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Clinical Documents & Encrypted Labs */}
          <Card padding="md" variant="surface" className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#7A7568]">
              Recent Vault Records
            </h3>
            <div className="space-y-2 text-xs">
              {store.getDocuments().slice(0, 3).map((d) => (
                <div
                  key={d.id}
                  className="p-2.5 bg-[#F4F2EE] border border-[#E7E4DC] rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-[#3C7049]" />
                    <span className="font-medium text-[#22241F]">{d.title}</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#7A7568]">{d.dateCreated.split('T')[0]}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Pane 3 (Right 4 Cols): AI Clinical Intelligence & SOAP Draft */}
        <div className={`lg:col-span-4 space-y-4 ${mobileTab === 'ai' ? 'block' : 'hidden lg:block'}`}>
          <Card padding="md" variant="surface" className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E7E4DC] pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#3E6B8E]" />
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#1E435E] font-semibold">
                  AI-Assisted SOAP Draft
                </h3>
              </div>
              <Badge variant="ai" size="xs">
                Assistive Model v4.2
              </Badge>
            </div>

            <div className="text-[11px] text-[#5A564C] leading-normal bg-[#F4F2EE] p-2.5 rounded-lg border border-[#E7E4DC]">
              <strong>MANDATORY HUMAN SIGN-OFF:</strong> This note draft synthesizes patient-reported symptoms, ambient vitals, and EHR medication logs. Review and approve before finalizing into the medical record.
            </div>

            {/* SOAP Note Fields */}
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-[#7A7568] block">
                  Subjective (S)
                </span>
                {isEditingSoap ? (
                  <textarea
                    rows={3}
                    value={soapDraft.subjective}
                    onChange={(e) => setSoapDraft({ ...soapDraft, subjective: e.target.value })}
                    className="w-full text-xs p-2 rounded border border-[#E7E4DC] bg-[#F4F2EE]"
                  />
                ) : (
                  <p className="text-[#22241F] bg-[#F4F2EE] p-2.5 rounded border border-[#E7E4DC] leading-relaxed">
                    {soapDraft.subjective}
                  </p>
                )}
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-[#7A7568] block">
                  Objective (O)
                </span>
                {isEditingSoap ? (
                  <textarea
                    rows={2}
                    value={soapDraft.objective}
                    onChange={(e) => setSoapDraft({ ...soapDraft, objective: e.target.value })}
                    className="w-full text-xs p-2 rounded border border-[#E7E4DC] bg-[#F4F2EE]"
                  />
                ) : (
                  <p className="text-[#22241F] bg-[#F4F2EE] p-2.5 rounded border border-[#E7E4DC] leading-relaxed">
                    {soapDraft.objective}
                  </p>
                )}
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-[#7A7568] block">
                  Assessment (A)
                </span>
                {isEditingSoap ? (
                  <textarea
                    rows={3}
                    value={soapDraft.assessment}
                    onChange={(e) => setSoapDraft({ ...soapDraft, assessment: e.target.value })}
                    className="w-full text-xs p-2 rounded border border-[#E7E4DC] bg-[#F4F2EE]"
                  />
                ) : (
                  <p className="text-[#22241F] bg-[#F4F2EE] p-2.5 rounded border border-[#E7E4DC] whitespace-pre-wrap leading-relaxed">
                    {soapDraft.assessment}
                  </p>
                )}
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-[#7A7568] block">
                  Plan (P)
                </span>
                {isEditingSoap ? (
                  <textarea
                    rows={4}
                    value={soapDraft.plan}
                    onChange={(e) => setSoapDraft({ ...soapDraft, plan: e.target.value })}
                    className="w-full text-xs p-2 rounded border border-[#E7E4DC] bg-[#F4F2EE]"
                  />
                ) : (
                  <p className="text-[#22241F] bg-[#F4F2EE] p-2.5 rounded border border-[#E7E4DC] whitespace-pre-wrap leading-relaxed">
                    {soapDraft.plan}
                  </p>
                )}
              </div>
            </div>

            {/* Clinician Action Buttons: Accept / Modify / Reject */}
            <div className="pt-2 border-t border-[#E7E4DC] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#7A7568]">
                  Status: <strong className="text-[#22241F]">{soapStatus}</strong>
                </span>
                <button
                  onClick={() => setIsEditingSoap(!isEditingSoap)}
                  className="text-xs font-medium text-[#3E6B8E] hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{isEditingSoap ? 'Done Editing' : 'Modify Fields'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleAcceptSoap}
                  disabled={soapStatus === 'ACCEPTED'}
                  leftIcon={<Check className="w-3.5 h-3.5" />}
                >
                  Sign & Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRejectSoap}
                  disabled={soapStatus === 'REJECTED'}
                  leftIcon={<X className="w-3.5 h-3.5 text-[#B03A28]" />}
                >
                  Reject Draft
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Prescription OCR Scanner Modal */}
      <Modal
        isOpen={ocrModalOpen}
        onClose={() => setOcrModalOpen(false)}
        title="Prescription OCR Normalization & Interaction Scanner"
        subtitle="Extracts structured medicine, strength, frequency, route, and evaluates dangerous pharmacological cross-interactions."
        maxWidth="2xl"
      >
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleScanPrescription('Rx_Atorvastatin_Cardio.pdf')}
            >
              Scan Statin Sample
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleScanPrescription('Rx_Metformin_Diabetic.pdf')}
            >
              Scan Metformin Sample
            </Button>
          </div>

          {isScanningOCR ? (
            <div className="py-12 text-center space-y-3">
              <Scan className="w-8 h-8 text-[#3E6B8E] animate-pulse mx-auto" />
              <p className="text-xs font-mono text-[#5A564C]">Extracting optical text and mapping LOINC/RxNorm codes...</p>
            </div>
          ) : ocrResult ? (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between bg-[#F4F2EE] p-2.5 rounded border border-[#E7E4DC]">
                <span className="font-semibold text-[#22241F]">Source: {ocrResult.sourceFileName}</span>
                <span className="font-mono text-[#3C7049] font-bold">
                  Overall Confidence: {Math.round(ocrResult.overallConfidence * 100)}%
                </span>
              </div>

              {/* Interaction Warning Callout if present */}
              {ocrResult.potentialInteractionsWarning && (
                <div className="p-3 bg-[#FBE9E7] border border-[#B03A28]/30 rounded-lg text-[#852516] flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#B03A28] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">CLINICAL INTERACTION WARNING:</span>
                    <p className="mt-0.5">{ocrResult.potentialInteractionsWarning}</p>
                  </div>
                </div>
              )}

              {/* Field-level extraction table with confidence scores */}
              <div className="border border-[#E7E4DC] rounded-lg overflow-hidden bg-[#FBFBF7]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F4F2EE] text-[10px] font-mono uppercase text-[#7A7568] border-b border-[#E7E4DC]">
                    <tr>
                      <th className="p-2.5">Field</th>
                      <th className="p-2.5">Extracted Value</th>
                      <th className="p-2.5 text-right">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E4DC] font-mono text-[11px]">
                    <tr>
                      <td className="p-2.5 font-semibold text-[#5A564C]">Medicine Name</td>
                      <td className="p-2.5 text-[#22241F]">{ocrResult.medicineName.value}</td>
                      <td className="p-2.5 text-right text-[#3C7049]">{(ocrResult.medicineName.confidence * 100).toFixed(0)}%</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-[#5A564C]">Active Ingredient</td>
                      <td className="p-2.5 text-[#22241F]">{ocrResult.activeIngredient.value}</td>
                      <td className="p-2.5 text-right text-[#3C7049]">{(ocrResult.activeIngredient.confidence * 100).toFixed(0)}%</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-[#5A564C]">Strength & Dose</td>
                      <td className="p-2.5 text-[#22241F]">{ocrResult.strength.value} • {ocrResult.dose.value}</td>
                      <td className="p-2.5 text-right text-[#3C7049]">{(ocrResult.strength.confidence * 100).toFixed(0)}%</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-[#5A564C]">Frequency & Route</td>
                      <td className="p-2.5 text-[#22241F]">{ocrResult.frequency.value} • {ocrResult.route.value}</td>
                      <td className="p-2.5 text-right text-[#3C7049]">{(ocrResult.frequency.confidence * 100).toFixed(0)}%</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-[#5A564C]">Instructions</td>
                      <td className="p-2.5 text-[#22241F]">{ocrResult.instructions.value}</td>
                      <td className="p-2.5 text-right text-[#B8822E]">{(ocrResult.instructions.confidence * 100).toFixed(0)}% (Flagged)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setOcrModalOpen(false)}>
                  Close
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    prescriptionOCR.reviewPrescription(ocrResult.id, 'ACCEPTED');
                    toast({
                      type: 'SUCCESS',
                      title: 'Prescription Verified',
                      message: 'Prescription normalized and queued for e-signature dispensing.',
                    });
                    setOcrModalOpen(false);
                  }}
                >
                  Verify & Import to Chart
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </Modal>
    </div>
  );
};
