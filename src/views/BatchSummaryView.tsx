import React from 'react';
import { BatchRecord, ViewTab } from '../types';
import { BatchQualityCards } from '../components/BatchQualityCards';
import { DefectChart } from '../components/DefectChart';
import { 
  Building2, 
  User, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Layers, 
  ArrowRight,
  GitCompare
} from 'lucide-react';

interface BatchSummaryViewProps {
  batch: BatchRecord;
  onNavigateTab: (tab: ViewTab) => void;
}

export const BatchSummaryView: React.FC<BatchSummaryViewProps> = ({
  batch,
  onNavigateTab
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
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
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8' }}>
              {batch.id}
            </span>
            <span className="prototype-tag">Batch Quality Summary</span>
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff' }}>
            {batch.name}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Aggregated procurement metrics calculated dynamically from {batch.summary.totalCount} individual bulb detections.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => onNavigateTab('analysis')}>
            <Layers size={14} />
            Back to Canvas
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => onNavigateTab('evidence')}>
            <ShieldCheck size={14} />
            Evidence Pack
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => onNavigateTab('report')}>
            <FileText size={14} />
            Print Report
          </button>
        </div>
      </div>

      {/* KPI Cards Component */}
      <BatchQualityCards summary={batch.summary} />

      {/* Two Column Layout: Defect Breakdown & Batch Dossier */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Defect Chart */}
        <DefectChart summary={batch.summary} />

        {/* Batch Metadata & Chain of Custody */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Batch Procurement Metadata</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Field verification &amp; regulatory tracking parameters
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Procurement Mandi:</span>
              <strong style={{ color: '#f8fafc' }}>{batch.procurementCenter}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Quality Inspector:</span>
              <strong style={{ color: '#f8fafc' }}>{batch.operator}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Timestamp:</span>
              <strong style={{ fontFamily: 'var(--font-mono)' }}>{new Date(batch.createdAt).toLocaleString()}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Grading Rules Applied:</span>
              <strong style={{ color: '#38bdf8' }}>{batch.gradingRules.version}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Grade A Size Benchmark:</span>
              <strong style={{ fontFamily: 'var(--font-mono)' }}>≥ {batch.gradingRules.minGradeADiameterMm} mm</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>URS Size Band:</span>
              <strong style={{ fontFamily: 'var(--font-mono)' }}>{batch.gradingRules.minUrsDiameterMm} mm – {batch.gradingRules.minGradeADiameterMm - 1} mm</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Cryptographic Hash:</span>
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#10b981', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {batch.verificationHash}
              </code>
            </div>
          </div>

          <div style={{
            marginTop: '1.25rem',
            padding: '0.75rem',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.78rem',
            color: 'var(--text-muted)'
          }}>
            All summary metrics are derived dynamically through functional reduction of individual bulb vectors. 
            Percentages are recalculated upon any human inspection adjustments.
          </div>
        </div>
      </div>
    </div>
  );
};
