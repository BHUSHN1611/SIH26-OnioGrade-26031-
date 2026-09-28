import React from 'react';
import { ViewTab, BatchRecord } from '../types';
import { 
  Scan, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Scale, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Building2, 
  AlertCircle 
} from 'lucide-react';

interface DashboardViewProps {
  onSelectTab: (tab: ViewTab) => void;
  recentBatches: BatchRecord[];
  onSelectBatch: (batch: BatchRecord) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectTab,
  recentBatches,
  onSelectBatch
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Hero Problem Statement & Primary Action Banner */}
      <div style={{
        position: 'relative',
        padding: '2.25rem 2rem',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-strong)',
        overflow: 'hidden'
      }}>
        {/* Subtle background decorative agricultural grid */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '40%',
          height: '100%',
          opacity: 0.05,
          backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '820px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <span className="doca-pill">Smart India Hackathon 2026 • Problem ID 26031</span>
            <span className="prototype-tag">Prototype Verification Mode</span>
          </div>

          <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.65rem' }}>
            AI-Powered Onion Quality Assessment &amp; Sizing
          </h2>

          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            A transparent computer-vision quality control platform for the Department of Consumer Affairs (DoCA). 
            Eliminating subjective grading disputes across procurement centers through instant defect segmentation, 
            calibrated diameter measurement, explainable Grade A / URS estimation, and tamper-evident digital quality reports.
          </p>

          {/* Primary Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              onClick={() => onSelectTab('assessment')}
              style={{ padding: '0.75rem 1.4rem', fontSize: '0.95rem' }}
            >
              <Scan size={18} />
              Start New Assessment
              <ArrowRight size={16} />
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => onSelectTab('demo-gallery')}
              style={{ padding: '0.75rem 1.4rem', fontSize: '0.95rem' }}
            >
              <Sparkles size={18} style={{ color: '#38bdf8' }} />
              Try Demo Images (10 Cases)
            </button>
          </div>
        </div>
      </div>

      {/* Trust & Transparency Feature Pillars */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.25rem'
      }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: '6px', backgroundColor: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <Scan size={18} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Individual Bulb CV Analysis</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Automated boundary segmentation, equatorial diameter sizing (px to mm), and multi-defect classification (rot, sprouting, cuts, and undersize).
          </p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: '6px', backgroundColor: 'rgba(56, 189, 248, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
              <Scale size={18} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Explainable Grading Engine</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Audit-ready decision trees explain exactly why each onion bulb is designated Grade A, URS, or Defective according to DoCA rulesets.
          </p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: '6px', backgroundColor: 'rgba(168, 85, 247, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc' }}>
              <ShieldCheck size={18} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Human-in-the-Loop &amp; Evidence</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Allows operator corrections with recorded justifications, instant batch metric recalculation, and SHA-256 tamper-evident digital reports.
          </p>
        </div>
      </div>

      {/* Prototype Telemetry & Recent Batches Ledger */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Recent Assessment Batches</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Prototype evaluation records from APMC procurement centers
            </p>
          </div>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            DEMO DATA • {recentBatches.length} BATCHES LOGGED
          </span>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Batch ID</th>
                <th>Scenario / Name</th>
                <th>Procurement APMC</th>
                <th>Total Sampled</th>
                <th>Grade A %</th>
                <th>URS %</th>
                <th>Defective %</th>
                <th>Avg Size</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentBatches.map(batch => (
                <tr key={batch.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#38bdf8' }}>
                    {batch.id}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#f8fafc' }}>{batch.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{batch.scenario}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem' }}>
                      <Building2 size={13} color="#94a3b8" />
                      {batch.procurementCenter.split(',')[0]}
                    </div>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{batch.summary.totalCount}</td>
                  <td>
                    <span className="badge badge-grade-a">{batch.summary.gradeAPct}%</span>
                  </td>
                  <td>
                    <span className="badge badge-grade-urs">{batch.summary.ursPct}%</span>
                  </td>
                  <td>
                    <span className="badge badge-grade-defective">{batch.summary.defectivePct}%</span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>
                    {batch.summary.avgDiameterMm} mm
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onSelectBatch(batch)}
                      style={{ padding: '0.3rem 0.75rem' }}
                    >
                      Open Analysis
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
