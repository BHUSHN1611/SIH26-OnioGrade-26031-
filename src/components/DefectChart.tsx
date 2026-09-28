import React from 'react';
import { BatchSummary } from '../types';

interface DefectChartProps {
  summary: BatchSummary;
}

export const DefectChart: React.FC<DefectChartProps> = ({ summary }) => {
  const total = summary.totalCount || 1;

  const defectCategories = [
    {
      name: 'Sound / Healthy',
      count: summary.defectCounts.healthy,
      pct: ((summary.defectCounts.healthy / total) * 100).toFixed(1),
      color: '#10b981',
      description: 'Clean dry scales, firm neck, FAQ standard'
    },
    {
      name: 'Damaged (Mechanical Cuts)',
      count: summary.defectCounts.damaged,
      pct: ((summary.defectCounts.damaged / total) * 100).toFixed(1),
      color: '#fb923c',
      description: 'Harvester cut wounds, puncture abrasions'
    },
    {
      name: 'Rotten (Mold / Bacterial Decay)',
      count: summary.defectCounts.rotten,
      pct: ((summary.defectCounts.rotten / total) * 100).toFixed(1),
      color: '#ef4444',
      description: 'Aspergillus niger, wet rot, liquefaction'
    },
    {
      name: 'Sprouted (Vegetative Shoots)',
      count: summary.defectCounts.sprouted,
      pct: ((summary.defectCounts.sprouted / total) * 100).toFixed(1),
      color: '#84cc16',
      description: 'Active emergent apical shoot growth'
    },
    {
      name: 'Undersized (<35mm)',
      count: summary.defectCounts.undersized,
      pct: ((summary.defectCounts.undersized / total) * 100).toFixed(1),
      color: '#facc15',
      description: 'Severe diminutive size below procurement floor'
    }
  ];

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Defect &amp; Morphological Breakdown</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Categorical incidence distribution across {summary.totalCount} sampled onions
          </p>
        </div>
      </div>

      {/* Composite Grade Bar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>
          <span>Grade Composition Ratio:</span>
          <span>{summary.gradeAPct}% Grade A • {summary.ursPct}% URS • {summary.defectivePct}% Defective</span>
        </div>
        <div style={{
          height: '14px',
          width: '100%',
          backgroundColor: '#1e293b',
          borderRadius: '7px',
          overflow: 'hidden',
          display: 'flex'
        }}>
          <div style={{ width: `${summary.gradeAPct}%`, backgroundColor: '#10b981' }} title={`Grade A: ${summary.gradeAPct}%`} />
          <div style={{ width: `${summary.ursPct}%`, backgroundColor: '#f59e0b' }} title={`URS: ${summary.ursPct}%`} />
          <div style={{ width: `${summary.defectivePct}%`, backgroundColor: '#ef4444' }} title={`Defective: ${summary.defectivePct}%`} />
        </div>
      </div>

      {/* Individual Category Distribution Meters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {defectCategories.map((cat, idx) => (
          <div key={idx}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: cat.color }} />
                <span style={{ fontSize: '0.825rem', fontWeight: 500, color: '#f1f5f9' }}>{cat.name}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>— {cat.description}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 600, color: cat.color }}>
                  {cat.pct}%
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', minWidth: '45px', textAlign: 'right' }}>
                  ({cat.count} {cat.count === 1 ? 'bulb' : 'bulbs'})
                </span>
              </div>
            </div>
            {/* Progress track */}
            <div style={{
              height: '6px',
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${cat.pct}%`,
                backgroundColor: cat.color,
                borderRadius: '3px',
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
