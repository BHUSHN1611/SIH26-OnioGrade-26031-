import React from 'react';
import { BatchRecord, ViewTab } from '../types';
import { exportEvidenceJson } from '../engine/evidencePack';
import { 
  ShieldCheck, 
  Download, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Lock, 
  UserCheck, 
  Building2,
  Scale,
  FileCheck
} from 'lucide-react';

interface EvidencePackViewProps {
  batch: BatchRecord;
  onNavigateTab: (tab: ViewTab) => void;
}

export const EvidencePackView: React.FC<EvidencePackViewProps> = ({
  batch,
  onNavigateTab
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Evidence Pack Top Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '1.25rem 1.5rem',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <ShieldCheck size={20} color="#10b981" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>
              Procurement Quality Evidence Pack
            </h2>
            <span className="doca-pill">Dispute Resolution Ledger</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Tamper-evident digital quality dossier designed to resolve procurement discrepancies between APMC mandis and central DoCA storage buffer reservoirs.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => exportEvidenceJson(batch)}
          >
            <Download size={14} />
            Export JSON Passport
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onNavigateTab('report')}
          >
            <FileText size={14} />
            View Printable Certificate
          </button>
        </div>
      </div>

      {/* Cryptographic Hash & Verification Seal */}
      <div className="card" style={{
        backgroundColor: 'rgba(16, 185, 129, 0.04)',
        border: '1px solid rgba(16, 185, 129, 0.25)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: '8px',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Lock size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Cryptographic Integrity Verification Hash
              </div>
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc', wordBreak: 'break-all' }}>
                {batch.verificationHash}
              </code>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Canonical Hash represents bulb states, conditions, diameters, grading rules, and operator corrections.
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '4px',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            color: '#34d399',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            fontWeight: 600
          }}>
            <CheckCircle2 size={15} />
            AUTHENTICATED LOT RECORD
          </div>
        </div>
      </div>

      {/* Two Column Image Evidence: Capture vs Annotation */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Visual Evidence Artifacts</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Side-by-side photographic records preserved for dispute verification
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem'
        }}>
          {/* Visual Tray Record */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f1f5f9', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileCheck size={14} color="#38bdf8" />
              Raw Optical Sensor Record ({batch.imageDimensions.width}x{batch.imageDimensions.height}px)
            </div>
            <div style={{
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              border: '1px solid var(--border-subtle)',
              backgroundColor: '#0a0f14'
            }}>
              <img src={batch.imageUrl} alt="Raw Tray Record" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          </div>

          {/* Key Evidence Parameters */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem' }}>Evidence Dossier Summary</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.825rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Batch ID:</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{batch.id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Procurement APMC:</span>
                  <span>{batch.procurementCenter}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Quality Inspector:</span>
                  <span>{batch.operator}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Certified Grade A Ratio:</span>
                  <strong style={{ color: '#10b981' }}>{batch.summary.gradeAPct}% ({batch.summary.gradeACount} bulbs)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>URS Sub-Standard Ratio:</span>
                  <strong style={{ color: '#f59e0b' }}>{batch.summary.ursPct}% ({batch.summary.ursCount} bulbs)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Defective Rejection Ratio:</span>
                  <strong style={{ color: '#ef4444' }}>{batch.summary.defectivePct}% ({batch.summary.defectiveCount} bulbs)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Mean Diameter:</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{batch.summary.avgDiameterMm} mm</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Certified under Department of Consumer Affairs (DoCA) Prototype Ruleset {batch.gradingRules.version}. 
              All data is exportable as a standardized JSON Quality Passport for cross-mandi ERP ingestion.
            </div>
          </div>
        </div>
      </div>

      {/* Audit Trail & Chain of Custody */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Inspection Audit Ledger &amp; Chain of Custody</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Complete chronological audit trail including initial inference and human operator overrides
            </p>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {batch.auditTrail.length} ENTRIES LOGGED
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {batch.auditTrail.map((entry, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2px' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '3px',
                    backgroundColor: entry.action === 'OPERATOR_CORRECTION' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                    color: entry.action === 'OPERATOR_CORRECTION' ? '#c084fc' : '#38bdf8'
                  }}>
                    {entry.action}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc' }}>
                    {entry.operator}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {entry.details || (entry.onionId ? `Bulb #${entry.onionId}: Changed ${entry.beforeState} -> ${entry.afterState}. Note: "${entry.reason}"` : '')}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                <Clock size={12} />
                {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
