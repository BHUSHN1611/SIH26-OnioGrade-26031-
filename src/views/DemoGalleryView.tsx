import React from 'react';
import { BatchRecord } from '../types';
import { Sparkles, ArrowRight, CheckCircle2, AlertTriangle, XCircle, Building2, Package } from 'lucide-react';

interface DemoGalleryViewProps {
  demoBatches: BatchRecord[];
  onAnalyzeDemo: (batchId: string) => void;
  isLoading: boolean;
}

export const DemoGalleryView: React.FC<DemoGalleryViewProps> = ({
  demoBatches,
  onAnalyzeDemo,
  isLoading
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
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
            <Sparkles size={18} color="#38bdf8" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>
              Pre-Calibrated Agricultural Demo Batches
            </h2>
            <span className="prototype-tag">Judge Ready • 10 Test Cases</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Select any predefined lot scenario below to run instant computer-vision defect segmentation, diameter estimation, and Grade A / URS calculations.
          </p>
        </div>
      </div>

      {/* Grid of 10 Demo Cases */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem'
      }}>
        {demoBatches.map((batch, idx) => {
          const isRecommended = batch.name.includes('Recommended');

          return (
            <div
              key={batch.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                border: isRecommended ? '1px solid #10b981' : undefined,
                boxShadow: isRecommended ? '0 0 16px rgba(16, 185, 129, 0.15)' : undefined
              }}
            >
              {isRecommended && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '15px',
                  backgroundColor: '#10b981',
                  color: '#042f1a',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase'
                }}>
                  Recommended For Judges
                </div>
              )}

              <div>
                {/* Image Thumbnail Preview */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '4 / 3',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  backgroundColor: '#0f172a',
                  marginBottom: '1rem',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <img
                    src={batch.imageUrl}
                    alt={batch.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '8px',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    color: '#94a3b8'
                  }}>
                    {batch.onions.length} Onions Detected
                  </div>
                </div>

                {/* Case Scenario & Details */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#38bdf8' }}>
                    CASE #{idx + 1} • {batch.id}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {batch.procurementCenter.split(',')[0]}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.35rem' }}>
                  {batch.name}
                </h3>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '0.85rem' }}>
                  {batch.description}
                </p>

                {/* Expected Scenario Metric Strip */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.75rem',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Grade A: </span>
                    <strong style={{ color: '#10b981' }}>{batch.summary.gradeAPct}%</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>URS: </span>
                    <strong style={{ color: '#f59e0b' }}>{batch.summary.ursPct}%</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Defects: </span>
                    <strong style={{ color: '#ef4444' }}>{batch.summary.defectivePct}%</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Avg: </span>
                    <strong style={{ fontFamily: 'var(--font-mono)' }}>{batch.summary.avgDiameterMm}mm</strong>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                className="btn btn-primary"
                onClick={() => onAnalyzeDemo(batch.id)}
                disabled={isLoading}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <span>Analyze This Batch</span>
                <ArrowRight size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
