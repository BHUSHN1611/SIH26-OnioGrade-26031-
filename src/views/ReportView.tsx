import React from 'react';
import { BatchRecord, ViewTab } from '../types';
import { Printer, Download, ArrowLeft, ShieldCheck, CheckCircle2, Building2 } from 'lucide-react';
import { exportEvidenceJson } from '../engine/evidencePack';

interface ReportViewProps {
  batch: BatchRecord;
  onNavigateTab: (tab: ViewTab) => void;
}

export const ReportView: React.FC<ReportViewProps> = ({ batch, onNavigateTab }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Action Bar (Hidden during Print) */}
      <div className="no-print" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        padding: '1rem 1.25rem',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button className="btn btn-outline btn-sm" onClick={() => onNavigateTab('analysis')}>
            <ArrowLeft size={14} /> Back to Analysis
          </button>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Official Printable Procurement Quality Certificate
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => exportEvidenceJson(batch)}>
            <Download size={14} /> Download JSON Data
          </button>
          <button className="btn btn-primary btn-sm" onClick={handlePrint}>
            <Printer size={14} /> Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Main Printable Document Card */}
      <div className="card report-print-container" style={{
        padding: '2.5rem',
        backgroundColor: '#ffffff',
        color: '#0f172a',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid #cbd5e1'
      }}>
        {/* Formal Government Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2px solid #0f172a',
          paddingBottom: '1.25rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Government of India • Ministry of Consumer Affairs, Food &amp; Public Distribution
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
              Department of Consumer Affairs (DoCA) — Price Stabilization Fund Buffer Division
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
              ONIOGRADE DIGITAL QUALITY ASSESSMENT CERTIFICATE
            </h1>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Smart India Hackathon 2026 Problem Statement ID: 26031 Verification Prototype
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{
              display: 'inline-block',
              padding: '6px 12px',
              border: '2px solid #16a34a',
              borderRadius: '4px',
              color: '#16a34a',
              fontWeight: 800,
              fontSize: '0.85rem',
              letterSpacing: '0.05em',
              fontFamily: 'monospace'
            }}>
              AUTHENTICATED LOT
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px', fontFamily: 'monospace' }}>
              DOCA-QC-2026-CERT
            </div>
          </div>
        </div>

        {/* Batch Metadata Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.85rem',
          backgroundColor: '#f8fafc',
          padding: '1rem',
          borderRadius: '6px',
          border: '1px solid #e2e8f0',
          marginBottom: '1.5rem',
          fontSize: '0.85rem'
        }}>
          <div>
            <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Batch Identifier</span>
            <strong style={{ fontFamily: 'monospace', fontSize: '1rem', color: '#0f172a' }}>{batch.id}</strong>
          </div>
          <div>
            <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Procurement APMC Location</span>
            <strong style={{ color: '#0f172a' }}>{batch.procurementCenter}</strong>
          </div>
          <div>
            <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Assessment Timestamp</span>
            <span style={{ color: '#0f172a', fontFamily: 'monospace' }}>{new Date(batch.createdAt).toLocaleString()}</span>
          </div>
          <div>
            <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Certifying Inspector</span>
            <span style={{ color: '#0f172a' }}>{batch.operator}</span>
          </div>
        </div>

        {/* Executive Grade Breakdown Table */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            1. Procurement Grade Allocation Summary
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', border: '1px solid #cbd5e1' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                <th style={{ padding: '8px 12px', textAlign: 'left' }}>Grade Tier</th>
                <th style={{ padding: '8px 12px', textAlign: 'left' }}>Compliance Criteria</th>
                <th style={{ padding: '8px 12px', textAlign: 'center' }}>Count (Bulbs)</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>Composition (%)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px 12px', fontWeight: 700, color: '#15803d' }}>GRADE A (FAQ)</td>
                <td style={{ padding: '8px 12px', color: '#475569' }}>Sound tissue, unblemished outer tunic, diameter ≥ 45 mm</td>
                <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 600, fontFamily: 'monospace' }}>{batch.summary.gradeACount}</td>
                <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: '#15803d', fontFamily: 'monospace' }}>{batch.summary.gradeAPct}%</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px 12px', fontWeight: 700, color: '#b45309' }}>URS (Sub-standard)</td>
                <td style={{ padding: '8px 12px', color: '#475569' }}>Sound tissue, intact scales, diameter 35 mm to 44 mm</td>
                <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 600, fontFamily: 'monospace' }}>{batch.summary.ursCount}</td>
                <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: '#b45309', fontFamily: 'monospace' }}>{batch.summary.ursPct}%</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px 12px', fontWeight: 700, color: '#b91c1c' }}>DEFECTIVE (Rejected)</td>
                <td style={{ padding: '8px 12px', color: '#475569' }}>Soft rot, Aspergillus niger mold, sprouting, cuts, &lt; 35 mm</td>
                <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 600, fontFamily: 'monospace' }}>{batch.summary.defectiveCount}</td>
                <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: '#b91c1c', fontFamily: 'monospace' }}>{batch.summary.defectivePct}%</td>
              </tr>
              <tr style={{ backgroundColor: '#f8fafc', fontWeight: 700 }}>
                <td style={{ padding: '8px 12px' }}>TOTAL SAMPLED</td>
                <td style={{ padding: '8px 12px', color: '#475569' }}>Mean Diameter: {batch.summary.avgDiameterMm} mm • Est. Mass: {batch.summary.estimatedWeightKg || '0.00'} kg</td>
                <td style={{ padding: '8px 12px', textAlign: 'center', fontFamily: 'monospace' }}>{batch.summary.totalCount}</td>
                <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: 'monospace' }}>100.0%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Defect Analysis Breakdown */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            2. Defect Incidence Analysis
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '8px',
            textAlign: 'center',
            fontSize: '0.8rem'
          }}>
            <div style={{ padding: '8px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px' }}>
              <div style={{ color: '#15803d', fontWeight: 600 }}>Sound (FAQ)</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, fontFamily: 'monospace' }}>{batch.summary.defectCounts.healthy}</div>
            </div>
            <div style={{ padding: '8px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '4px' }}>
              <div style={{ color: '#b91c1c', fontWeight: 600 }}>Rotten / Mold</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, fontFamily: 'monospace' }}>{batch.summary.defectCounts.rotten}</div>
            </div>
            <div style={{ padding: '8px', backgroundColor: '#fefce8', border: '1px solid #fef08a', borderRadius: '4px' }}>
              <div style={{ color: '#854d0e', fontWeight: 600 }}>Sprouted</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, fontFamily: 'monospace' }}>{batch.summary.defectCounts.sprouted}</div>
            </div>
            <div style={{ padding: '8px', backgroundColor: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '4px' }}>
              <div style={{ color: '#c2410c', fontWeight: 600 }}>Cut Damaged</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, fontFamily: 'monospace' }}>{batch.summary.defectCounts.damaged}</div>
            </div>
            <div style={{ padding: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
              <div style={{ color: '#475569', fontWeight: 600 }}>Undersized</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, fontFamily: 'monospace' }}>{batch.summary.defectCounts.undersized}</div>
            </div>
          </div>
        </div>

        {/* Visual Inspection Tray Record */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            3. Photographic Inspection Evidence
          </h3>
          <div style={{
            maxHeight: '260px',
            overflow: 'hidden',
            borderRadius: '4px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#0a0f14',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img src={batch.imageUrl} alt="Onion Quality Record" style={{ maxHeight: '260px', width: 'auto' }} />
          </div>
        </div>

        {/* Individual Itemized Ledger Table */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            4. Itemized Bulb Inspection Ledger
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', border: '1px solid #cbd5e1' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9' }}>
                <th style={{ padding: '6px 8px', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '6px 8px', textAlign: 'left' }}>Condition</th>
                <th style={{ padding: '6px 8px', textAlign: 'center' }}>Diameter (mm)</th>
                <th style={{ padding: '6px 8px', textAlign: 'center' }}>Allocated Grade</th>
                <th style={{ padding: '6px 8px', textAlign: 'left' }}>Decision Rule Trace</th>
                <th style={{ padding: '6px 8px', textAlign: 'right' }}>Human Verification</th>
              </tr>
            </thead>
            <tbody>
              {batch.onions.map(onion => (
                <tr key={onion.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '6px 8px', fontWeight: 700, fontFamily: 'monospace' }}>#{onion.id.toString().padStart(2, '0')}</td>
                  <td style={{ padding: '6px 8px', fontWeight: 600 }}>{onion.condition}</td>
                  <td style={{ padding: '6px 8px', textAlign: 'center', fontFamily: 'monospace' }}>{onion.diameterMm.toFixed(1)}</td>
                  <td style={{ padding: '6px 8px', textAlign: 'center', fontWeight: 700, color: onion.grade === 'Grade A' ? '#15803d' : onion.grade === 'URS' ? '#b45309' : '#b91c1c' }}>
                    {onion.grade}
                  </td>
                  <td style={{ padding: '6px 8px', color: '#475569', fontSize: '0.72rem' }}>{onion.summaryReason}</td>
                  <td style={{ padding: '6px 8px', textAlign: 'right', fontSize: '0.7rem' }}>
                    {onion.isManuallyCorrected ? (
                      <span style={{ color: '#7e22ce', fontWeight: 700 }}>[MODIFIED] {onion.correctionReason}</span>
                    ) : (
                      <span style={{ color: '#16a34a' }}>AI VERIFIED</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Verification Digest & Legal Disclaimer */}
        <div style={{
          borderTop: '2px solid #e2e8f0',
          paddingTop: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          fontSize: '0.75rem',
          color: '#64748b'
        }}>
          <div>
            <div><strong>Verification Hash:</strong> <code style={{ fontFamily: 'monospace' }}>{batch.verificationHash}</code></div>
            <div><strong>Applied Ruleset:</strong> {batch.gradingRules.version} ({batch.gradingRules.title})</div>
            <div style={{ marginTop: '4px', maxWidth: '520px', lineHeight: 1.35 }}>
              Prototype evaluation under SIH 26031. Does not supersede official Agmark standards unless designated by gazette notification.
            </div>
          </div>

          <div style={{ textAlign: 'center', minWidth: '180px' }}>
            <div style={{ borderBottom: '1px solid #94a3b8', height: '35px', marginBottom: '4px' }}></div>
            <div style={{ fontWeight: 700, color: '#0f172a' }}>{batch.operator}</div>
            <div style={{ fontSize: '0.7rem' }}>Authorized Procurement Officer</div>
          </div>
        </div>
      </div>
    </div>
  );
};
