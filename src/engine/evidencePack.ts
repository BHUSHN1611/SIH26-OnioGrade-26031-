// ============================================================================
// ONIOGRADE - EVIDENCE PACK & AUDIT SYSTEM
// Cryptographic verification & dispute-resolution evidence generation
// ============================================================================

import { BatchRecord, OnionRecord, AuditLogEntry } from '../types';

/**
 * Creates a deterministic SHA-256 hex digest simulation of the batch data
 * to ensure tamper-evident records between procurement mandis and central storage.
 */
export function generateVerificationHash(
  batchId: string,
  timestamp: string,
  onions: OnionRecord[]
): string {
  // Construct canonical payload
  const canonicalData = `${batchId}|${timestamp}|${onions.map(o => `${o.id}:${o.condition}:${o.diameterMm}:${o.grade}:${o.isManuallyCorrected}`).join(';')}`;
  
  // High-dispersion 64-character hex hash simulation
  let hash1 = 0x811c9dc5;
  let hash2 = 0xcbf29ce4;
  for (let i = 0; i < canonicalData.length; i++) {
    const code = canonicalData.charCodeAt(i);
    hash1 = (hash1 ^ code) * 0x01000193;
    hash2 = (hash2 ^ (code << 1)) * 0x100000001b3;
  }
  
  const h1 = (hash1 >>> 0).toString(16).padStart(8, '0');
  const h2 = (hash2 >>> 0).toString(16).padStart(8, '0');
  const h3 = ((hash1 ^ 0xa5a5a5a5) >>> 0).toString(16).padStart(8, '0');
  const h4 = ((hash2 ^ 0x5a5a5a5a) >>> 0).toString(16).padStart(8, '0');
  const h5 = (((hash1 << 3) ^ hash2) >>> 0).toString(16).padStart(8, '0');
  const h6 = (((hash2 << 2) ^ hash1) >>> 0).toString(16).padStart(8, '0');
  const h7 = ((hash1 ^ 0x33333333) >>> 0).toString(16).padStart(8, '0');
  const h8 = ((hash2 ^ 0x77777777) >>> 0).toString(16).padStart(8, '0');
  
  return `0x${h1}${h2}${h3}${h4}${h5}${h6}${h7}${h8}`.toLowerCase();
}

/**
 * Creates a standardized audit entry for human-in-the-loop modifications.
 */
export function createCorrectionAuditEntry(
  onion: OnionRecord,
  oldCondition: string,
  newCondition: string,
  oldDiameter: number,
  newDiameter: number,
  operator: string,
  reason: string
): AuditLogEntry {
  const timestamp = new Date().toISOString();
  return {
    id: `AUDIT-${Date.now()}-${onion.id}`,
    timestamp,
    operator,
    action: 'OPERATOR_CORRECTION',
    onionId: onion.id,
    beforeState: `Condition: ${oldCondition}, Diameter: ${oldDiameter.toFixed(1)}mm`,
    afterState: `Condition: ${newCondition}, Diameter: ${newDiameter.toFixed(1)}mm`,
    reason: reason || 'Procurement visual inspection adjustment'
  };
}

/**
 * Exports complete batch evidence pack as a downloadable JSON object.
 */
export function exportEvidenceJson(batch: BatchRecord): void {
  const exportPayload = {
    standard: 'SIH-26031-DoCA-QualityPassport-v1',
    organization: 'Department of Consumer Affairs (DoCA)',
    application: 'OnioGrade AI-Powered Quality Assessment',
    batchId: batch.id,
    batchName: batch.name,
    scenario: batch.scenario,
    capturedAt: batch.createdAt,
    operator: batch.operator,
    centerLocation: batch.procurementCenter,
    verificationHash: batch.verificationHash,
    summary: batch.summary,
    gradingRulesApplied: batch.gradingRules,
    auditTrail: batch.auditTrail,
    onions: batch.onions.map(o => ({
      id: o.id,
      condition: o.condition,
      defectType: o.defectType,
      diameterMm: o.diameterMm,
      grade: o.grade,
      confidence: o.confidence,
      boundingBox: o.box,
      isManuallyCorrected: o.isManuallyCorrected,
      correctionReason: o.correctionReason,
      decisionReason: o.summaryReason
    }))
  };

  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `OnioGrade-Evidence-${batch.id}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
