import React from 'react';
import { BatchSummary } from '../types';
import { CheckCircle2, AlertTriangle, XCircle, Gauge, Package, Scale } from 'lucide-react';

interface BatchQualityCardsProps {
  summary: BatchSummary;
}

export const BatchQualityCards: React.FC<BatchQualityCardsProps> = ({ summary }) => {
  return (
    <div className="metrics-grid">
      {/* Total Onions */}
      <div className="metric-card neutral">
        <div className="metric-label">
          <span>Total Sampled</span>
          <Package size={14} color="#38bdf8" />
        </div>
        <div className="metric-value">{summary.totalCount}</div>
        <div className="metric-sub">
          Est. Weight: ~{summary.estimatedWeightKg || '0.00'} kg
        </div>
      </div>

      {/* Grade A */}
      <div className="metric-card grade-a">
        <div className="metric-label">
          <span>Grade A (FAQ)</span>
          <CheckCircle2 size={14} color="#10b981" />
        </div>
        <div className="metric-value" style={{ color: '#10b981' }}>
          {summary.gradeAPct}%
        </div>
        <div className="metric-sub">
          {summary.gradeACount} of {summary.totalCount} bulbs (≥45mm, Healthy)
        </div>
      </div>

      {/* URS */}
      <div className="metric-card urs">
        <div className="metric-label">
          <span>URS (Sub-Standard)</span>
          <AlertTriangle size={14} color="#f59e0b" />
        </div>
        <div className="metric-value" style={{ color: '#f59e0b' }}>
          {summary.ursPct}%
        </div>
        <div className="metric-sub">
          {summary.ursCount} of {summary.totalCount} bulbs (35–44mm)
        </div>
      </div>

      {/* Defective */}
      <div className="metric-card defective">
        <div className="metric-label">
          <span>Defective (Rejected)</span>
          <XCircle size={14} color="#ef4444" />
        </div>
        <div className="metric-value" style={{ color: '#ef4444' }}>
          {summary.defectivePct}%
        </div>
        <div className="metric-sub">
          {summary.defectiveCount} bulbs (Rot/Sprout/Cuts/&lt;35mm)
        </div>
      </div>

      {/* Average Diameter */}
      <div className="metric-card neutral">
        <div className="metric-label">
          <span>Avg. Diameter</span>
          <Gauge size={14} color="#38bdf8" />
        </div>
        <div className="metric-value" style={{ fontFamily: 'var(--font-mono)' }}>
          {summary.avgDiameterMm} <span style={{ fontSize: '1rem', fontWeight: 500 }}>mm</span>
        </div>
        <div className="metric-sub">
          Range: {summary.minDiameterMm} mm – {summary.maxDiameterMm} mm
        </div>
      </div>
    </div>
  );
};
