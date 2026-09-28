import React, { useState } from 'react';
import { OnionRecord, OnionGrade } from '../types';
import { HelpCircle, Edit3, CheckCircle2, AlertTriangle, XCircle, Filter } from 'lucide-react';

interface OnionLedgerProps {
  onions: OnionRecord[];
  selectedOnionId: number | null;
  onSelectOnion: (id: number) => void;
  onOpenExplain: (onion: OnionRecord) => void;
  onOpenCorrect: (onion: OnionRecord) => void;
}

export const OnionLedger: React.FC<OnionLedgerProps> = ({
  onions,
  selectedOnionId,
  onSelectOnion,
  onOpenExplain,
  onOpenCorrect
}) => {
  const [filterGrade, setFilterGrade] = useState<string>('ALL');

  const filteredOnions = onions.filter(o => {
    if (filterGrade === 'ALL') return true;
    if (filterGrade === 'CORRECTED') return o.isManuallyCorrected;
    return o.grade === filterGrade;
  });

  const getGradeBadge = (grade: OnionGrade) => {
    switch (grade) {
      case 'Grade A':
        return <span className="badge badge-grade-a">GRADE A</span>;
      case 'URS':
        return <span className="badge badge-grade-urs">URS</span>;
      case 'Defective':
        return <span className="badge badge-grade-defective">DEFECTIVE</span>;
    }
  };

  const getConditionColor = (cond: string) => {
    switch (cond) {
      case 'Healthy': return '#34d399';
      case 'Sprouted': return '#a3e635';
      case 'Rotten': return '#f87171';
      case 'Damaged': return '#fb923c';
      case 'Undersized': return '#facc15';
      default: return '#94a3b8';
    }
  };

  return (
    <div className="card">
      {/* Table Header & Filter Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Detected Bulbs Ledger</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Individual inspection analysis • Showing {filteredOnions.length} of {onions.length} detected bulbs
          </p>
        </div>

        {/* Filter Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Filter size={12} /> Filter:
          </span>
          {['ALL', 'Grade A', 'URS', 'Defective', 'CORRECTED'].map(f => (
            <button
              key={f}
              onClick={() => setFilterGrade(f)}
              className={`btn btn-sm ${filterGrade === f ? 'btn-secondary' : 'btn-outline'}`}
              style={{
                fontSize: '0.72rem',
                padding: '0.2rem 0.55rem',
                border: filterGrade === f ? '1px solid #38bdf8' : undefined
              }}
            >
              {f === 'CORRECTED' ? 'Modified' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive Table / Card Container */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Bulb ID</th>
              <th>Status / Defect</th>
              <th>Est. Diameter</th>
              <th>Assigned Grade</th>
              <th>Confidence</th>
              <th>Inspection Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOnions.map(onion => {
              const isSelected = selectedOnionId === onion.id;

              return (
                <tr
                  key={onion.id}
                  className={isSelected ? 'selected' : ''}
                  onClick={() => onSelectOnion(onion.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#f8fafc' }}>
                    #{onion.id.toString().padStart(2, '0')}
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      color: getConditionColor(onion.condition),
                      fontWeight: 600
                    }}>
                      <span style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        backgroundColor: getConditionColor(onion.condition)
                      }} />
                      {onion.condition}
                      {onion.defectType && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          ({onion.defectType})
                        </span>
                      )}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>
                    {onion.diameterMm.toFixed(1)} mm
                  </td>
                  <td>{getGradeBadge(onion.grade)}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {(onion.confidence * 100).toFixed(0)}%
                  </td>
                  <td>
                    {onion.isManuallyCorrected ? (
                      <span className="badge badge-corrected">
                        Manually Corrected
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        AI Verified
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenExplain(onion);
                        }}
                        title="Explain Why this onion was graded this way"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      >
                        <HelpCircle size={13} style={{ color: '#38bdf8' }} />
                        Why?
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenCorrect(onion);
                        }}
                        title="Operator Manual Correction"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      >
                        <Edit3 size={13} />
                        Correct
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
