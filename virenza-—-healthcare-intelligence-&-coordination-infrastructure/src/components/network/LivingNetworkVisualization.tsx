import React, { useState, useEffect } from 'react';
import { Shield, Activity, Stethoscope, Building2, Siren, FileText, Cpu } from 'lucide-react';

interface NetworkNode {
  id: string;
  name: string;
  role: string;
  x: number;
  y: number;
  icon: React.ReactNode;
  activeSignal: string;
  throughput: string;
  securityTier: string;
  connectedTo: string[];
}

export const LivingNetworkVisualization: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string>('ai');
  const [pulseIndex, setPulseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const nodes: NetworkNode[] = [
    {
      id: 'patient',
      name: 'PATIENT',
      role: 'Telemetry & Consent Ingress',
      x: 160,
      y: 220,
      icon: <Activity className="w-5 h-5 text-[#3C7049]" />,
      activeSignal: 'Vitals stream (122/78 mmHg) & Encrypted vault',
      throughput: '12 events/min',
      securityTier: 'AES-256-GCM Ephemeral Token',
      connectedTo: ['ai', 'clinician', 'emergency'],
    },
    {
      id: 'clinician',
      name: 'CLINICIAN',
      role: 'Clinical Decision & Oversight',
      x: 320,
      y: 90,
      icon: <Stethoscope className="w-5 h-5 text-[#3E6B8E]" />,
      activeSignal: 'SOAP note validation & Rx titration sign-off',
      throughput: '8 reviews/hr',
      securityTier: 'EPCS Hardware Key Verified',
      connectedTo: ['ai', 'patient', 'hospital'],
    },
    {
      id: 'hospital',
      name: 'HOSPITAL / HEALTH SYSTEM',
      role: 'Acuity Flow & Bed Capacity',
      x: 640,
      y: 110,
      icon: <Building2 className="w-5 h-5 text-[#22241F]" />,
      activeSignal: 'ED bed occupancy (14/64) & Ingress routing',
      throughput: '1.4k HL7 messages/hr',
      securityTier: 'FHIR R4 VPC Bridge',
      connectedTo: ['clinician', 'emergency', 'insurer'],
    },
    {
      id: 'ai',
      name: 'AI SYSTEM',
      role: 'Clinical Safety Gateway & Triage',
      x: 400,
      y: 240,
      icon: <Cpu className="w-5 h-5 text-[#3E6B8E]" />,
      activeSignal: 'Red flag surveillance & Prescription OCR',
      throughput: '340 inferences/min (0.94 conf)',
      securityTier: 'Mandatory Human-in-the-Loop',
      connectedTo: ['patient', 'clinician', 'sentinel', 'emergency'],
    },
    {
      id: 'emergency',
      name: 'EMERGENCY OPERATIONS',
      role: 'Incident State Machine & Dispatch',
      x: 630,
      y: 260,
      icon: <Siren className="w-5 h-5 text-[#B03A28]" />,
      activeSignal: 'GPS coordinate telemetry & Unit MEDIC-44 ETA',
      throughput: 'Sub-second incident routing',
      securityTier: 'E911/PSAP Interop Protocol',
      connectedTo: ['patient', 'ai', 'hospital'],
    },
    {
      id: 'sentinel',
      name: 'PUBLIC HEALTH / SENTINEL',
      role: 'Bio-Surveillance & Outbreak Detection',
      x: 240,
      y: 380,
      icon: <Shield className="w-5 h-5 text-[#B8822E]" />,
      activeSignal: 'Influenza H3N2 cluster signal (+11.2%)',
      throughput: 'State-wide lab aggregate',
      securityTier: 'De-identified Differential Privacy',
      connectedTo: ['ai', 'hospital', 'insurer'],
    },
    {
      id: 'insurer',
      name: 'INSURER / PAYER',
      role: 'Claims Signals & Care Gaps',
      x: 540,
      y: 380,
      icon: <FileText className="w-5 h-5 text-[#5A564C]" />,
      activeSignal: 'Preventive gap alert: SGLT2i adherence flag',
      throughput: '58 claims/min',
      securityTier: 'HIPAA Standard B2B API',
      connectedTo: ['hospital', 'sentinel'],
    },
  ];

  const activeNodeData = nodes.find((n) => n.id === selectedNode) || nodes[3];

  return (
    <div className="bg-[#FBFBF7] border border-[#E7E4DC] rounded-2xl p-5 sm:p-8 shadow-[0_4px_24px_rgba(34,36,31,0.05)] overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7E4DC] pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#3C7049] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-[#7A7568]">
              VIRENZA Intelligent Network Topology
            </span>
          </div>
          <h3 className="text-base font-semibold text-[#22241F] mt-1">
            Real-Time Cross-Enterprise Coordination Layer
          </h3>
        </div>
        <div className="text-xs font-mono text-[#5A564C] bg-[#F4F2EE] px-3 py-1.5 rounded-lg border border-[#E7E4DC]">
          Interactive: Click any node to inspect data flow
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Visual Canvas */}
        <div className="lg:col-span-8 relative w-full aspect-16/10 sm:aspect-16/9 bg-[#F5F5F0] rounded-xl border border-[#E7E4DC] overflow-hidden">
          <svg viewBox="0 0 800 460" className="w-full h-full select-none">
            <defs>
              <linearGradient id="edgeGradClinical" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3C7049" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#3E6B8E" stopOpacity="0.6" />
              </linearGradient>
              <linearGradient id="edgeGradEmergency" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#B03A28" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#3E6B8E" stopOpacity="0.7" />
              </linearGradient>
            </defs>

            {/* Background grid markings */}
            <g opacity="0.4" stroke="#E7E4DC" strokeWidth="1">
              <line x1="100" y1="0" x2="100" y2="460" strokeDasharray="4 8" />
              <line x1="300" y1="0" x2="300" y2="460" strokeDasharray="4 8" />
              <line x1="500" y1="0" x2="500" y2="460" strokeDasharray="4 8" />
              <line x1="700" y1="0" x2="700" y2="460" strokeDasharray="4 8" />
              <line x1="0" y1="120" x2="800" y2="120" strokeDasharray="4 8" />
              <line x1="0" y1="240" x2="800" y2="240" strokeDasharray="4 8" />
              <line x1="0" y1="360" x2="800" y2="360" strokeDasharray="4 8" />
            </g>

            {/* Network Edges */}
            {nodes.map((node) =>
              node.connectedTo.map((targetId) => {
                const target = nodes.find((n) => n.id === targetId);
                if (!target) return null;
                const isSelectedEdge =
                  selectedNode === node.id || selectedNode === target.id;

                return (
                  <g key={`${node.id}-${target.id}`}>
                    <line
                      x1={node.x}
                      y1={node.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={isSelectedEdge ? '#3C7049' : '#D1CDC2'}
                      strokeWidth={isSelectedEdge ? 2.5 : 1.2}
                      strokeDasharray={isSelectedEdge ? 'none' : '4 4'}
                    />
                  </g>
                );
              })
            )}

            {/* Traveling Data Packets */}
            {nodes.map((node, i) => {
              const target = nodes.find((n) => n.id === node.connectedTo[0]);
              if (!target) return null;
              const ratio = ((pulseIndex * 1.5 + i * 25) % 100) / 100;
              const px = node.x + (target.x - node.x) * ratio;
              const py = node.y + (target.y - node.y) * ratio;

              return (
                <circle
                  key={`pulse-${node.id}`}
                  cx={px}
                  cy={py}
                  r={3.5}
                  fill={node.id === 'emergency' ? '#B03A28' : '#3C7049'}
                  className="transition-all duration-75"
                />
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const isSelected = selectedNode === node.id;
              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNode(node.id)}
                  className="cursor-pointer transition-transform duration-150"
                  transform={`translate(${node.x}, ${node.y})`}
                >
                  {/* Outer glow ring if selected */}
                  {isSelected && (
                    <circle
                      r={30}
                      fill="none"
                      stroke="#3C7049"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      className="animate-spin"
                      style={{ transformOrigin: '0 0', animationDuration: '14s' }}
                    />
                  )}

                  {/* Node container */}
                  <circle
                    r={22}
                    fill="#FBFBF7"
                    stroke={isSelected ? '#3C7049' : '#E7E4DC'}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    className="shadow-sm hover:scale-105 transition-transform"
                  />

                  {/* Node icon */}
                  <g transform="translate(-10, -10)">
                    {node.icon}
                  </g>

                  {/* Node Label */}
                  <text
                    y={34}
                    textAnchor="middle"
                    className={`text-[11px] font-mono tracking-tight font-semibold ${
                      isSelected ? 'fill-[#22241F]' : 'fill-[#5A564C]'
                    }`}
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Telemetry & Node Inspection Panel */}
        <div className="lg:col-span-4 bg-[#F4F2EE] border border-[#E7E4DC] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E7E4DC] pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#FBFBF7] border border-[#E7E4DC]">
                {activeNodeData.icon}
              </span>
              <div>
                <h4 className="text-sm font-semibold text-[#22241F]">
                  {activeNodeData.name}
                </h4>
                <span className="text-[11px] text-[#5A564C] font-mono">
                  {activeNodeData.role}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#7A7568] block">
                Active Telemetry Stream
              </span>
              <p className="font-mono text-xs text-[#22241F] mt-0.5 bg-[#FBFBF7] p-2 rounded border border-[#E7E4DC]">
                {activeNodeData.activeSignal}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-[#7A7568] block">
                Message Throughput
              </span>
              <p className="font-mono text-xs text-[#22241F] mt-0.5">
                {activeNodeData.throughput}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-[#7A7568] block">
                Security & Verification Boundary
              </span>
              <p className="font-mono text-xs text-[#3C7049] mt-0.5 font-medium">
                {activeNodeData.securityTier}
              </p>
            </div>

            <div className="pt-2 border-t border-[#E7E4DC]">
              <span className="text-[10px] font-mono uppercase text-[#7A7568] block">
                Direct Coordinated Channels
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {activeNodeData.connectedTo.map((c) => {
                  const target = nodes.find((n) => n.id === c);
                  return (
                    <span
                      key={c}
                      onClick={() => setSelectedNode(c)}
                      className="cursor-pointer font-mono text-[10px] px-2 py-0.5 rounded bg-[#FBFBF7] border border-[#E7E4DC] text-[#22241F] hover:border-[#3C7049]"
                    >
                      → {target?.name.split(' ')[0]}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
