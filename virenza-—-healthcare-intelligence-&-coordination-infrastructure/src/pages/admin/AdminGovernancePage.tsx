import React, { useState } from 'react';
import {
  Shield,
  FileText,
  Users,
  Settings,
  Activity,
  CheckCircle,
  Download,
  Search,
  Database,
  Lock,
} from 'lucide-react';
import { store } from '../../services/store';
import { DEMO_USERS } from '../../data/seed';
import { FHIRAdapter } from '../../services/fhir/adapter';
import { AuditEvent } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { toast } from '../../hooks/useToast';

export const AdminGovernancePage: React.FC = () => {
  const [logs, setLogs] = useState<AuditEvent[]>(store.getAuditLogs());
  const [activeTab, setActiveTab] = useState<'audit' | 'users' | 'flags' | 'fhir'>('audit');
  const [logFilter, setLogFilter] = useState('');
  const [flags, setFlags] = useState({
    aiTriageSafetyGateway: true,
    clientSideWebCrypto: true,
    sentinelSurveillance: true,
    emergencyStateEngine: true,
    fhirExportEndpoints: true,
  });

  const filteredLogs = logs.filter(
    (l) =>
      !logFilter ||
      l.actorName.toLowerCase().includes(logFilter.toLowerCase()) ||
      l.action.toLowerCase().includes(logFilter.toLowerCase()) ||
      l.resourceType.toLowerCase().includes(logFilter.toLowerCase())
  );

  const handleToggleFlag = (key: keyof typeof flags) => {
    const updated = { ...flags, [key]: !flags[key] };
    setFlags(updated);
    toast({
      type: 'INFO',
      title: 'Feature Flag Updated',
      message: `${String(key)} set to ${updated[key] ? 'ENABLED' : 'DISABLED'}.`,
    });
  };

  const handleExportFHIR = () => {
    const profile = store.getPatientProfile();
    const bundle = FHIRAdapter.toFHIRBundle(profile);
    const jsonStr = JSON.stringify(bundle, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FHIR_R4_Bundle_${profile.mrn}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      type: 'SUCCESS',
      title: 'FHIR R4 Bundle Exported',
      message: 'Validated HL7 FHIR collection bundle exported to your machine.',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-[#E7E4DC] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="clinical" size="xs">
              Enterprise Governance
            </Badge>
            <span className="text-xs font-mono text-[#7A7568]">Append-Only Audit Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-[#22241F] mt-1">
            Governance, Access Control & Audit
          </h1>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleExportFHIR}
            leftIcon={<Download className="w-3.5 h-3.5 text-[#3C7049]" />}
          >
            Export FHIR R4 Bundle
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#E7E4DC] pb-2 font-mono text-xs">
        {[
          { id: 'audit', label: `Immutable Audit Ledger (${logs.length})`, icon: <FileText className="w-3.5 h-3.5" /> },
          { id: 'users', label: 'RBAC Directory', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'flags', label: 'Platform Flags & Engine', icon: <Settings className="w-3.5 h-3.5" /> },
          { id: 'fhir', label: 'FHIR R4 Inspector', icon: <Database className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-[#22241F] text-white font-semibold'
                : 'text-[#5A564C] hover:bg-[#F4F2EE]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Audit Log Tab */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#7A7568]" />
              <input
                type="text"
                placeholder="Search audit actions, actors, resources..."
                value={logFilter}
                onChange={(e) => setLogFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#E7E4DC] bg-[#FBFBF7] focus:outline-[#3C7049]"
              />
            </div>
            <span className="text-[11px] font-mono text-[#7A7568]">
              Cryptographically chained • Tamper-evident
            </span>
          </div>

          <div className="border border-[#E7E4DC] rounded-xl overflow-hidden bg-[#FBFBF7] shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F4F2EE] text-[10px] font-mono uppercase text-[#7A7568] border-b border-[#E7E4DC]">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Actor & Role</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Resource Target</th>
                  <th className="p-3">Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E4DC] font-mono text-[11px]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F4F2EE]/50 transition-colors">
                    <td className="p-3 text-[#7A7568] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-[#22241F] block">{log.actorName}</span>
                      <span className="text-[10px] text-[#7A7568]">{log.actorRole}</span>
                    </td>
                    <td className="p-3">
                      <Badge variant="clinical" size="xs">
                        {log.action}
                      </Badge>
                    </td>
                    <td className="p-3 text-[#5A564C]">
                      {log.resourceType} ({log.resourceId.substring(0, 10)}...)
                    </td>
                    <td className="p-3 text-[10px] text-[#7A7568] max-w-xs truncate">
                      {JSON.stringify(log.metadata || {})}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DEMO_USERS.map((u) => (
            <Card key={u.id} padding="md" variant="surface" className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[#22241F]">{u.name}</h3>
                  <span className="text-xs text-[#5A564C]">{u.email}</span>
                </div>
                <Badge variant="clinical" size="xs">
                  {u.role}
                </Badge>
              </div>

              <div className="text-xs text-[#5A564C] pt-1">
                <div>Organization: {u.organizationId}</div>
                <div>Title: {u.title} • {u.department}</div>
              </div>

              <div className="pt-2 border-t border-[#E7E4DC] flex flex-wrap gap-1 text-[10px] font-mono text-[#7A7568]">
                {u.permissions.map((p) => (
                  <span key={p} className="bg-[#F4F2EE] px-1.5 py-0.5 rounded border border-[#E7E4DC]">
                    {p}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Flags Tab */}
      {activeTab === 'flags' && (
        <div className="max-w-2xl space-y-4">
          <Card padding="md" variant="surface" className="space-y-4">
            <h3 className="text-sm font-semibold text-[#22241F] border-b border-[#E7E4DC] pb-2">
              Core Platform Feature Gates
            </h3>
            {Object.entries(flags).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between text-xs py-1">
                <div>
                  <span className="font-semibold text-[#22241F] font-mono">{key}</span>
                  <p className="text-[11px] text-[#5A564C]">Runtime validation switch</p>
                </div>
                <button
                  onClick={() => handleToggleFlag(key as any)}
                  className={`px-3 py-1 rounded font-mono text-xs font-semibold transition-colors ${
                    val ? 'bg-[#3C7049] text-white' : 'bg-[#E7E4DC] text-[#7A7568]'
                  }`}
                >
                  {val ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* FHIR Inspector Tab */}
      {activeTab === 'fhir' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#7A7568]">
              HL7 FHIR R4 Bundle Representation (Eleanor Vance)
            </h3>
            <Button size="sm" onClick={handleExportFHIR} leftIcon={<Download className="w-3.5 h-3.5" />}>
              Download JSON
            </Button>
          </div>

          <div className="bg-[#F4F2EE] border border-[#E7E4DC] p-4 rounded-xl font-mono text-xs text-[#22241F] max-h-[500px] overflow-y-auto whitespace-pre">
            {JSON.stringify(FHIRAdapter.toFHIRBundle(store.getPatientProfile()), null, 2)}
          </div>
        </div>
      )}
    </div>
  );
};
