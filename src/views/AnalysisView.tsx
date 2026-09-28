import React, { useState } from 'react';
import { BatchRecord, OnionRecord, OnionCondition, ViewTab } from '../types';
import { evaluateOnionGrade, calculateBatchSummary } from '../engine/gradingEngine';
import { createCorrectionAuditEntry, generateVerificationHash } from '../engine/evidencePack';
import { DetectionCanvas } from '../components/DetectionCanvas';
import { OnionLedger } from '../components/OnionLedger';
import { ExplainabilityModal } from '../components/ExplainabilityModal';
import { CorrectionModal } from '../components/CorrectionModal';
import { 
  BarChart3, 
  ShieldCheck, 
  FileText, 
  Building2, 
  Clock, 
  User, 
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface AnalysisViewProps {
  batch: BatchRecord;
  onUpdateBatch: (updatedBatch: BatchRecord) => void;
  onNavigateTab: (tab: ViewTab) => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  batch,
  onUpdateBatch,
  onNavigateTab
}) => {
  const [selectedOnionId, setSelectedOnionId] = useState<number | null>(batch.onions[0]?.id || 1);
  const [explainingOnion, setExplainingOnion] = useState<OnionRecord | null>(null);
  const [correctingOnion, setCorrectingOnion] = useState<OnionRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedOnion = batch.onions.find(o => o.id === selectedOnionId) || batch.onions[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Human-in-the-loop correction handler
  const handleSaveCorrection = (
    onionId: number,
    newCondition: OnionCondition,
    newDiameter: number,
    reason: string
  ) => {
    const updatedOnions = batch.onions.map(onion => {
      if (onion.id !== onionId) return onion;

      const oldCondition = onion.condition;
      const oldDiameter = onion.diameterMm;
      const evalResult = evaluateOnionGrade(newCondition, newDiameter, batch.gradingRules);

      return {
        ...onion,
        condition: newCondition,
        diameterMm: newDiameter,
        grade: evalResult.grade,
        isManuallyCorrected: true,
        originalCondition: onion.originalCondition || oldCondition,
        originalDiameterMm: onion.originalDiameterMm || oldDiameter,
        originalGrade: onion.originalGrade || onion.grade,
        correctionReason: reason,
        correctedAt: new Date().toISOString(),
        correctedBy: batch.operator,
        gradingExplanation: evalResult.explanation,
        summaryReason: evalResult.summaryReason
      };
    });

    const targetOnion = batch.onions.find(o => o.id === onionId)!;
    const auditEntry = createCorrectionAuditEntry(
      targetOnion,
      targetOnion.condition,
      newCondition,
      targetOnion.diameterMm,
      newDiameter,
      batch.operator,
      reason
    );

    const newSummary = calculateBatchSummary(updatedOnions);
    const newHash = generateVerificationHash(batch.id, batch.createdAt, updatedOnions);

    const updatedBatch: BatchRecord = {
      ...batch,
      onions: updatedOnions,
      summary: newSummary,
      verificationHash: newHash,
      auditTrail: [auditEntry, ...batch.auditTrail]
    };

    onUpdateBatch(updatedBatch);
    showToast(`Bulb #${onionId} corrected to ${newCondition} (${newDiameter.toFixed(1)}mm). Batch metrics recalculated!`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 200,
          backgroundColor: '#10b981',
          color: '#042f1a',
          fontWeight: 600,
          padding: '0.75rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeIn 0.2s ease'
        }}>
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Batch Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '1rem 1.25rem',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8' }}>
              {batch.id}
            </span>
            <span className="prototype-tag">{batch.sourceType === 'demo' ? 'Pre-calibrated Demo Lot' : 'Live Inference Capture'}</span>
            {batch.auditTrail.some(a => a.action === 'OPERATOR_CORRECTION') && (
              <span className="badge badge-corrected">Human Verified</span>
            )}
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
            {batch.name}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Building2 size={12} /> {batch.procurementCenter}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <User size={12} /> {batch.operator}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} /> {new Date(batch.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Action Quick Shortcuts */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onNavigateTab('summary')}
          >
            <BarChart3 size={14} />
            Batch Summary
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onNavigateTab('evidence')}
          >
            <ShieldCheck size={14} />
            Evidence Pack
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onNavigateTab('report')}
          >
            <FileText size={14} />
            Generate Quality Report
          </button>
        </div>
      </div>

      {/* Real-time Summary Metric Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '0.75rem'
      }}>
        <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sample Count</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{batch.summary.totalCount} bulbs</div>
        </div>

        <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <div style={{ fontSize: '0.72rem', color: '#10b981', textTransform: 'uppercase', fontWeight: 600 }}>Grade A (FAQ)</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
            {batch.summary.gradeAPct}% <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>({batch.summary.gradeACount})</span>
          </div>
        </div>

        <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
          <div style={{ fontSize: '0.72rem', color: '#f59e0b', textTransform: 'uppercase', fontWeight: 600 }}>URS (35-44mm)</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>
            {batch.summary.ursPct}% <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>({batch.summary.ursCount})</span>
          </div>
        </div>

        <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <div style={{ fontSize: '0.72rem', color: '#ef4444', textTransform: 'uppercase', fontWeight: 600 }}>Defective</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ef4444', fontFamily: 'var(--font-mono)' }}>
            {batch.summary.defectivePct}% <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>({batch.summary.defectiveCount})</span>
          </div>
        </div>

        <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Avg. Diameter</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
            {batch.summary.avgDiameterMm} <span style={{ fontSize: '0.85rem' }}>mm</span>
          </div>
        </div>
      </div>

      {/* Main Detection Canvas View */}
      <DetectionCanvas
        imageUrl={batch.imageUrl}
        onions={batch.onions}
        selectedOnionId={selectedOnionId}
        onSelectOnion={(id) => {
          setSelectedOnionId(id);
          const found = batch.onions.find(o => o.id === id);
          if (found) setExplainingOnion(found);
        }}
      />

      {/* Detected Bulbs Ledger Table */}
      <OnionLedger
        onions={batch.onions}
        selectedOnionId={selectedOnionId}
        onSelectOnion={id => setSelectedOnionId(id)}
        onOpenExplain={onion => setExplainingOnion(onion)}
        onOpenCorrect={onion => setCorrectingOnion(onion)}
      />

      {/* Modals */}
      {explainingOnion && (
        <ExplainabilityModal
          onion={explainingOnion}
          rules={batch.gradingRules}
          onClose={() => setExplainingOnion(null)}
          onOpenCorrect={onion => setCorrectingOnion(onion)}
        />
      )}

      {correctingOnion && (
        <CorrectionModal
          onion={correctingOnion}
          rules={batch.gradingRules}
          operatorName={batch.operator}
          onClose={() => setCorrectingOnion(null)}
          onSaveCorrection={handleSaveCorrection}
        />
      )}
    </div>
  );
};
