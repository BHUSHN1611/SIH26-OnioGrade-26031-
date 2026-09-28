import React, { useState } from 'react';
import { BatchRecord } from '../types';
import { GitCompare, ArrowRight, CheckCircle2, AlertTriangle, XCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ComparisonViewProps {
  batches: BatchRecord[];
  activeBatchId: string;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ batches, activeBatchId }) => {
  const [batchIdA, setBatchIdA] = useState<string>(activeBatchId || batches[0]?.id || '');
  const [batchIdB, setBatchIdB] = useState<string>(
    batches.find(b => b.id !== activeBatchId)?.id || batches[1]?.id || batches[0]?.id || ''
  );

  const batchA = batches.find(b => b.id === batchIdA) || batches[0];
  const batchB = batches.find(b => b.id === batchIdB) || batches[1] || batches[0];

  if (!batchA || !batchB) {
    return <div className="card">At least two batches are required for comparative analysis.</div>;
  }

  // Delta calculations (Batch B relative to Batch A)
  const deltaGradeA = Number((batchB.summary.gradeAPct - batchA.summary.gradeAPct).toFixed(1));
  const deltaURS = Number((batchB.summary.ursPct - batchA.summary.ursPct).toFixed(1));
  const deltaDefective = Number((batchB.summary.defectivePct - batchA.summary.defectivePct).toFixed(1));
  const deltaDiameter = Number((batchB.summary.avgDiameterMm - batchA.summary.avgDiameterMm).toFixed(1));

  const renderDelta = (delta: number, unit = '%', invertColor = false) => {
    if (delta === 0) {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          <Minus size={13} /> 0.0{unit}
        </span>
      );
    }
    const isPositive = delta > 0;
    const isGood = invertColor ? !isPositive : isPositive;
    const color = isGood ? '#10b981' : '#ef4444';

    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
        {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
        {isPositive ? `+${delta}` : delta}{unit}
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{
        padding: '1.25rem 1.5rem',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <GitCompare size={18} color="#38bdf8" />
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Side-by-Side Batch Comparative Analysis</h2>
          <span className="doca-pill">Cross-Lot Evaluation</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Directly evaluate two distinct procurement lots or inspect pre-correction vs post-correction shift statistics.
        </p>
      </div>

      {/* Batch Selectors */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem'
      }}>
        <div className="card">
          <label className="form-label">Primary Lot (Batch A)</label>
          <select
            className="form-select"
            value={batchIdA}
            onChange={e => setBatchIdA(e.target.value)}
          >
            {batches.map(b => (
              <option key={b.id} value={b.id}>
                {b.id} — {b.name} ({b.summary.totalCount} bulbs)
              </option>
            ))}
          </select>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            {batchA.procurementCenter}
          </div>
        </div>

        <div className="card">
          <label className="form-label">Comparison Lot (Batch B)</label>
          <select
            className="form-select"
            value={batchIdB}
            onChange={e => setBatchIdB(e.target.value)}
          >
            {batches.map(b => (
              <option key={b.id} value={b.id}>
                {b.id} — {b.name} ({b.summary.totalCount} bulbs)
              </option>
            ))}
          </select>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            {batchB.procurementCenter}
          </div>
        </div>
      </div>

      {/* Comparative Metrics Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Comparative Metric Matrix</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Quantitative comparison of quality metrics and defect rates
            </p>
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Quality Dimension</th>
                <th>Batch A ({batchA.id})</th>
                <th>Batch B ({batchB.id})</th>
                <th style={{ textAlign: 'right' }}>Observed Shift (B vs A)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600 }}>Grade A (FAQ) Ratio</td>
                <td style={{ fontFamily: 'var(--font-mono)', color: '#10b981', fontWeight: 600 }}>
                  {batchA.summary.gradeAPct}% ({batchA.summary.gradeACount} bulbs)
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', color: '#10b981', fontWeight: 600 }}>
                  {batchB.summary.gradeAPct}% ({batchB.summary.gradeACount} bulbs)
                </td>
                <td style={{ textAlign: 'right' }}>{renderDelta(deltaGradeA, '%')}</td>
              </tr>

              <tr>
                <td style={{ fontWeight: 600 }}>URS (Sub-Standard) Ratio</td>
                <td style={{ fontFamily: 'var(--font-mono)', color: '#f59e0b', fontWeight: 600 }}>
                  {batchA.summary.ursPct}% ({batchA.summary.ursCount} bulbs)
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', color: '#f59e0b', fontWeight: 600 }}>
                  {batchB.summary.ursPct}% ({batchB.summary.ursCount} bulbs)
                </td>
                <td style={{ textAlign: 'right' }}>{renderDelta(deltaURS, '%')}</td>
              </tr>

              <tr>
                <td style={{ fontWeight: 600 }}>Defective (Rejected) Ratio</td>
                <td style={{ fontFamily: 'var(--font-mono)', color: '#ef4444', fontWeight: 600 }}>
                  {batchA.summary.defectivePct}% ({batchA.summary.defectiveCount} bulbs)
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', color: '#ef4444', fontWeight: 600 }}>
                  {batchB.summary.defectivePct}% ({batchB.summary.defectiveCount} bulbs)
                </td>
                <td style={{ textAlign: 'right' }}>{renderDelta(deltaDefective, '%', true)}</td>
              </tr>

              <tr>
                <td style={{ fontWeight: 600 }}>Mean Equatorial Diameter</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{batchA.summary.avgDiameterMm} mm</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{batchB.summary.avgDiameterMm} mm</td>
                <td style={{ textAlign: 'right' }}>{renderDelta(deltaDiameter, 'mm')}</td>
              </tr>

              <tr>
                <td style={{ fontWeight: 600 }}>Total Sampled Count</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{batchA.summary.totalCount} bulbs</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{batchB.summary.totalCount} bulbs</td>
                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {batchB.summary.totalCount - batchA.summary.totalCount} bulbs
                </td>
              </tr>

              <tr>
                <td style={{ fontWeight: 600 }}>Rotten / Mold Infestation</td>
                <td style={{ fontFamily: 'var(--font-mono)', color: '#f87171' }}>{batchA.summary.defectCounts.rotten} bulbs</td>
                <td style={{ fontFamily: 'var(--font-mono)', color: '#f87171' }}>{batchB.summary.defectCounts.rotten} bulbs</td>
                <td style={{ textAlign: 'right' }}>{renderDelta(batchB.summary.defectCounts.rotten - batchA.summary.defectCounts.rotten, ' bulbs', true)}</td>
              </tr>

              <tr>
                <td style={{ fontWeight: 600 }}>Vegetative Sprouting</td>
                <td style={{ fontFamily: 'var(--font-mono)', color: '#84cc16' }}>{batchA.summary.defectCounts.sprouted} bulbs</td>
                <td style={{ fontFamily: 'var(--font-mono)', color: '#84cc16' }}>{batchB.summary.defectCounts.sprouted} bulbs</td>
                <td style={{ textAlign: 'right' }}>{renderDelta(batchB.summary.defectCounts.sprouted - batchA.summary.defectCounts.sprouted, ' bulbs', true)}</td>
              </tr>

              <tr>
                <td style={{ fontWeight: 600 }}>Mechanical Cut Damage</td>
                <td style={{ fontFamily: 'var(--font-mono)', color: '#fb923c' }}>{batchA.summary.defectCounts.damaged} bulbs</td>
                <td style={{ fontFamily: 'var(--font-mono)', color: '#fb923c' }}>{batchB.summary.defectCounts.damaged} bulbs</td>
                <td style={{ textAlign: 'right' }}>{renderDelta(batchB.summary.defectCounts.damaged - batchA.summary.defectCounts.damaged, ' bulbs', true)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Dual Image Comparison */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem'
      }}>
        <div className="card">
          <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Batch A Imagery ({batchA.id})</h4>
          <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: '#0a0f14' }}>
            <img src={batchA.imageUrl} alt={batchA.name} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
        </div>

        <div className="card">
          <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Batch B Imagery ({batchB.id})</h4>
          <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: '#0a0f14' }}>
            <img src={batchB.imageUrl} alt={batchB.name} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
