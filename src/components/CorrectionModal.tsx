import React, { useState } from 'react';
import { OnionRecord, OnionCondition, GradingRulesConfig } from '../types';
import { evaluateOnionGrade } from '../engine/gradingEngine';
import { X, Edit3, CheckCircle2, RotateCcw } from 'lucide-react';

interface CorrectionModalProps {
  onion: OnionRecord | null;
  rules: GradingRulesConfig;
  operatorName: string;
  onClose: () => void;
  onSaveCorrection: (
    onionId: number, 
    newCondition: OnionCondition, 
    newDiameter: number, 
    reason: string
  ) => void;
}

export const CorrectionModal: React.FC<CorrectionModalProps> = ({
  onion,
  rules,
  operatorName,
  onClose,
  onSaveCorrection
}) => {
  if (!onion) return null;

  const [condition, setCondition] = useState<OnionCondition>(onion.condition);
  const [diameterMm, setDiameterMm] = useState<number>(onion.diameterMm);
  const [reason, setReason] = useState<string>(
    onion.correctionReason || 'Field visual inspection adjustment'
  );

  // Live preview of what the grade will become with these new inputs
  const simulated = evaluateOnionGrade(condition, diameterMm, rules);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCorrection(onion.id, condition, diameterMm, reason);
    onClose();
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
              backgroundColor: 'rgba(168, 85, 247, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#c084fc'
            }}>
              <Edit3 size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>
                Human-in-the-Loop Override — Bulb #{onion.id.toString().padStart(2, '0')}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Field operator decision support &amp; audit logging
              </p>
            </div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose} style={{ padding: '0.3rem' }}>
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Context Box */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '1.25rem'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Original AI Detection:</span>
                <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem' }}>
                  {onion.originalCondition || onion.condition} • {(onion.originalDiameterMm || onion.diameterMm).toFixed(1)} mm
                </div>
              </div>
              <span className={`badge ${onion.grade === 'Grade A' ? 'badge-grade-a' : onion.grade === 'URS' ? 'badge-grade-urs' : 'badge-grade-defective'}`}>
                {onion.grade}
              </span>
            </div>

            {/* Condition Field */}
            <div className="form-group">
              <label className="form-label">
                Corrected Condition / Defect Status <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                className="form-select"
                value={condition}
                onChange={e => setCondition(e.target.value as OnionCondition)}
              >
                <option value="Healthy">Healthy (Sound, unblemished outer tunic)</option>
                <option value="Damaged">Damaged (Cuts, mechanical bruises, skin tears)</option>
                <option value="Rotten">Rotten (Soft fungal decay, black mold)</option>
                <option value="Sprouted">Sprouted (Emergent apical green shoots)</option>
                <option value="Undersized">Undersized (Small cull bulb)</option>
              </select>
            </div>

            {/* Diameter Field */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label className="form-label" style={{ margin: 0 }}>
                  Calibrated Diameter (mm)
                </label>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#38bdf8', fontWeight: 600 }}>
                  {diameterMm.toFixed(1)} mm
                </span>
              </div>
              <input
                type="range"
                min="25"
                max="85"
                step="0.5"
                value={diameterMm}
                onChange={e => setDiameterMm(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>25 mm (Cull)</span>
                <span>35 mm (URS Floor)</span>
                <span>45 mm (Grade A Min)</span>
                <span>85 mm (Jumbo)</span>
              </div>
            </div>

            {/* Operator Justification / Notes */}
            <div className="form-group">
              <label className="form-label">
                Audit Justification / Note <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                className="form-textarea"
                rows={2}
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="e.g. Surface soil stain was misinterpreted by optical model as black mold"
                required
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Recorded in tamper-evident procurement evidence ledger under operator: {operatorName}
              </span>
            </div>

            {/* Recalculation Preview Banner */}
            <div style={{
              padding: '0.85rem 1rem',
              backgroundColor: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>
                  Recalculated Grade Result:
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {simulated.summaryReason}
                </div>
              </div>
              <span className={`badge ${simulated.grade === 'Grade A' ? 'badge-grade-a' : simulated.grade === 'URS' ? 'badge-grade-urs' : 'badge-grade-defective'}`}>
                {simulated.grade}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle2 size={16} />
              Save &amp; Recalculate Batch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
