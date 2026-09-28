import React from 'react';
import { OnionRecord, GradingRulesConfig } from '../types';
import { generateOnionExplanation } from '../engine/explainabilityEngine';
import { X, CheckCircle2, AlertTriangle, AlertCircle, Info, ShieldCheck, Scale } from 'lucide-react';

interface ExplainabilityModalProps {
  onion: OnionRecord | null;
  rules: GradingRulesConfig;
  onClose: () => void;
  onOpenCorrect: (onion: OnionRecord) => void;
}

export const ExplainabilityModal: React.FC<ExplainabilityModalProps> = ({
  onion,
  rules,
  onClose,
  onOpenCorrect
}) => {
  if (!onion) return null;

  const explanation = generateOnionExplanation(onion, rules);

  const getStatusIcon = (status: 'pass' | 'fail' | 'warn' | 'info') => {
    switch (status) {
      case 'pass': return <CheckCircle2 size={16} color="#10b981" />;
      case 'fail': return <AlertCircle size={16} color="#ef4444" />;
      case 'warn': return <AlertTriangle size={16} color="#f59e0b" />;
      case 'info': return <Info size={16} color="#38bdf8" />;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '6px',
              backgroundColor: 'rgba(56, 189, 248, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>
                Explainable Decision Trace — Bulb #{onion.id.toString().padStart(2, '0')}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Auditable evaluation tree against {rules.version}
              </p>
            </div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose} style={{ padding: '0.3rem' }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Top Verdict Banner */}
          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: onion.grade === 'Grade A' ? 'rgba(16, 185, 129, 0.08)' : onion.grade === 'URS' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(239, 68, 68, 0.08)',
            border: `1px solid ${onion.grade === 'Grade A' ? 'rgba(16, 185, 129, 0.3)' : onion.grade === 'URS' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            marginBottom: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: onion.grade === 'Grade A' ? '#10b981' : onion.grade === 'URS' ? '#f59e0b' : '#ef4444',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                Final Determination
              </span>
              <span className={`badge ${onion.grade === 'Grade A' ? 'badge-grade-a' : onion.grade === 'URS' ? 'badge-grade-urs' : 'badge-grade-defective'}`}>
                {onion.grade}
              </span>
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem' }}>
              {explanation.verdictTitle}
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              {explanation.verdictDescription}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.75rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Surface State</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f1f5f9', marginTop: '2px' }}>{onion.condition}</div>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Equatorial Caliber</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f1f5f9', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>{onion.diameterMm.toFixed(1)} mm</div>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Confidence</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f1f5f9', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>{(onion.confidence * 100).toFixed(0)}%</div>
            </div>
          </div>

          {/* Step-by-Step Rule Decision Hierarchy */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
              Sequential Inference &amp; Rule Trace
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {explanation.pipelineTrace.map((trace, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ marginTop: '2px' }}>{getStatusIcon(trace.status)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '2px' }}>
                      <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#f1f5f9' }}>{trace.stage}</span>
                      <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{trace.confidenceOrValue}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{trace.finding}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regulatory Context (DoCA Buffer Storage Standard) */}
          <div style={{
            padding: '0.85rem',
            backgroundColor: 'rgba(56, 189, 248, 0.05)',
            border: '1px dashed rgba(56, 189, 248, 0.25)',
            borderRadius: 'var(--radius-md)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px', color: '#38bdf8', fontSize: '0.78rem', fontWeight: 600 }}>
              <Scale size={13} />
              DoCA Procurement Context
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {explanation.regulatoryRationale}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              onClose();
              onOpenCorrect(onion);
            }}
          >
            Manual Correction...
          </button>
        </div>
      </div>
    </div>
  );
};
