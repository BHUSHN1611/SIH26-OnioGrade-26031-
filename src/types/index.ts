// ============================================================================
// ONIOGRADE - DOMAIN TYPES & DATA ARCHITECTURE
// Smart India Hackathon 2026 - Problem Statement 26031 (DoCA)
// ============================================================================

export type DefectType = 
  | 'rot'          // Fungal rot, wet rot, black mold
  | 'sprout'       // Emerging vegetative green shoots
  | 'cut_damage'   // Mechanical cuts, punctures, abrasions
  | 'skin_peel'    // Peeled outer protective tunic
  | 'double_bulb'  // Twin/split bulb deformation
  | 'undersized'   // Below physical grading threshold
  | null;

export type OnionCondition = 
  | 'Healthy' 
  | 'Damaged' 
  | 'Rotten' 
  | 'Sprouted' 
  | 'Undersized';

export type OnionGrade = 
  | 'Grade A' 
  | 'URS'         // Under-sized / Re-sorted / Sub-standard
  | 'Defective';  // Reject / Non-procurement grade

export interface BoundingBox {
  id: number;
  x: number;      // % from left (0 to 100)
  y: number;      // % from top (0 to 100)
  w: number;      // % width (0 to 100)
  h: number;      // % height (0 to 100)
}

export interface RuleStepExplanation {
  stepIndex: number;
  stepName: string;
  ruleDescription: string;
  conditionEvaluated: string;
  passed: boolean;
  impactOnGrade: string;
}

export interface OnionRecord {
  id: number;
  box: BoundingBox;
  condition: OnionCondition;
  defectType: DefectType;
  diameterMm: number;
  confidence: number;
  grade: OnionGrade;
  
  // Human-in-the-Loop tracking
  isManuallyCorrected: boolean;
  originalCondition?: OnionCondition;
  originalGrade?: OnionGrade;
  originalDiameterMm?: number;
  correctionReason?: string;
  correctedAt?: string;
  correctedBy?: string;

  // Decision transparency
  gradingExplanation: RuleStepExplanation[];
  summaryReason: string;
}

export interface BatchDefectSummary {
  healthy: number;
  damaged: number;
  rotten: number;
  sprouted: number;
  undersized: number;
}

export interface BatchSummary {
  totalCount: number;
  gradeACount: number;
  gradeAPct: number;
  ursCount: number;
  ursPct: number;
  defectiveCount: number;
  defectivePct: number;
  avgDiameterMm: number;
  minDiameterMm: number;
  maxDiameterMm: number;
  defectCounts: BatchDefectSummary;
  estimatedWeightKg?: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  operator: string;
  action: string;
  onionId?: number;
  beforeState?: string;
  afterState?: string;
  reason?: string;
  details?: string;
}

export interface GradingRulesConfig {
  version: string;
  title: string;
  minGradeADiameterMm: number;       // default 45 mm
  minUrsDiameterMm: number;          // default 35 mm
  allowMinorSkinPeelInGradeA: boolean;
  rejectRottenImmediately: boolean;
  rejectSproutedImmediately: boolean;
  rejectCutDamageImmediately: boolean;
}

export interface BatchRecord {
  id: string;                         // e.g. "ONIO-2026-001"
  name: string;
  scenario: string;
  description: string;
  createdAt: string;
  operator: string;
  procurementCenter: string;
  sourceType: 'demo' | 'upload' | 'camera';
  imageUrl: string;
  annotatedImageUrl?: string;
  imageDimensions: { width: number; height: number };
  
  onions: OnionRecord[];
  summary: BatchSummary;
  gradingRules: GradingRulesConfig;
  auditTrail: AuditLogEntry[];
  verificationHash: string;          // Cryptographic tamper evidence string
}

export type ViewTab = 
  | 'dashboard'
  | 'assessment'
  | 'demo-gallery'
  | 'analysis'
  | 'summary'
  | 'evidence'
  | 'report'
  | 'compare'
  | 'methodology';
