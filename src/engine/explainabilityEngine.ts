// ============================================================================
// ONIOGRADE - EXPLAINABILITY ENGINE
// Transparent reasoning generator for onion grading decisions
// ============================================================================

import { OnionRecord, GradingRulesConfig } from '../types';

export interface DetailedExplanation {
  onionId: number;
  condition: string;
  defectType: string | null;
  diameterMm: number;
  grade: string;
  isCorrected: boolean;
  correctionNote?: string;
  verdictTitle: string;
  verdictDescription: string;
  regulatoryRationale: string;
  pipelineTrace: {
    stage: string;
    finding: string;
    confidenceOrValue: string;
    status: 'pass' | 'fail' | 'warn' | 'info';
  }[];
}

export function generateOnionExplanation(
  onion: OnionRecord,
  rules: GradingRulesConfig
): DetailedExplanation {
  const isHealthy = onion.condition === 'Healthy';
  const isRotten = onion.condition === 'Rotten';
  const isSprouted = onion.condition === 'Sprouted';
  const isDamaged = onion.condition === 'Damaged';
  const isUndersized = onion.condition === 'Undersized' || onion.diameterMm < rules.minUrsDiameterMm;

  let verdictTitle = '';
  let verdictDescription = '';
  let regulatoryRationale = '';

  if (isRotten) {
    verdictTitle = 'DEFECTIVE (Soft Rot / Fungal Decay)';
    verdictDescription = `The computer vision surface analysis detected microbial or fungal tissue breakdown (Rot). Under storage buffer conditions, rotting bulbs spread fungal spores to adjacent healthy stock.`;
    regulatoryRationale = `DoCA Buffer Procurement Rule: Immediate zero-tolerance rejection. Rotting bulbs cannot enter central storage reservoirs.`;
  } else if (isSprouted) {
    verdictTitle = 'DEFECTIVE (Vegetative Sprouting)';
    verdictDescription = `Visible apical shoot extension detected. Sprouting consumes interior bulb sucrose and water reserves, causing hollow inner scales and rapid deterioration.`;
    regulatoryRationale = `Storage Durability Standard: Sprouted onions exhibit broken dormancy and accelerate moisture loss, making them unviable for long-term price stabilization stocks.`;
  } else if (isDamaged) {
    verdictTitle = 'DEFECTIVE (Mechanical Cut / Crush Damage)';
    verdictDescription = `Surface continuity breached. Deep mechanical lesions, harvesters cuts, or crush injuries create infection entry points.`;
    regulatoryRationale = `Packaging Standard: Cut/damaged onions are segregated to prevent bacterial soft rot outbreaks in transit and storage crates.`;
  } else if (isUndersized) {
    verdictTitle = 'DEFECTIVE (Severe Undersize)';
    verdictDescription = `Estimated bulb diameter of ${onion.diameterMm.toFixed(1)} mm is strictly below the minimum procurement floor (${rules.minUrsDiameterMm} mm).`;
    regulatoryRationale = `Size Grade Floor: Bulbs under ${rules.minUrsDiameterMm} mm fall below marketable procurement size and are categorized as non-procurement cull.`;
  } else if (onion.grade === 'URS') {
    verdictTitle = 'URS (Under-sized / Re-sorted / Sub-standard)';
    verdictDescription = `Sound, healthy bulb with good outer scale integrity, but estimated diameter of ${onion.diameterMm.toFixed(1)} mm is between ${rules.minUrsDiameterMm} mm and ${rules.minGradeADiameterMm - 1} mm.`;
    regulatoryRationale = `Secondary Procurement Tier: Accepted under URS specification at differential valuation for immediate local market release rather than long-term cold storage.`;
  } else {
    verdictTitle = 'GRADE A (Fair Average Quality - FAQ)';
    verdictDescription = `Sound, firm, unblemished bulb with intact dry outer tunic and an estimated diameter of ${onion.diameterMm.toFixed(1)} mm (exceeds ${rules.minGradeADiameterMm} mm standard).`;
    regulatoryRationale = `DoCA Buffer Procurement Standard: Fully meets central buffer stock quality benchmarks for high storage life and public distribution.`;
  }

  const pipelineTrace: DetailedExplanation['pipelineTrace'] = [
    {
      stage: '1. Segmentation & Contour Analysis',
      finding: `Detected single bulb bounding contour at [${onion.box.x}%, ${onion.box.y}%]`,
      confidenceOrValue: `${(onion.confidence * 100).toFixed(1)}% detection confidence`,
      status: 'pass' as const
    },
    {
      stage: '2. Defect Classifier',
      finding: `Identified condition as "${onion.condition}"${onion.defectType ? ` (${onion.defectType})` : ''}`,
      confidenceOrValue: `${(onion.confidence * 100).toFixed(0)}% model score`,
      status: isHealthy ? ('pass' as const) : ('fail' as const)
    },
    {
      stage: '3. Calibrated Sizing',
      finding: `Estimated equatorial diameter: ${onion.diameterMm.toFixed(1)} mm`,
      confidenceOrValue: `Reference calibrated mm/px scale`,
      status: onion.diameterMm >= rules.minGradeADiameterMm ? ('pass' as const) : (onion.diameterMm >= rules.minUrsDiameterMm ? 'warn' as const : 'fail' as const)
    },
    {
      stage: '4. Prototype Grading Rules Engine',
      finding: `Evaluated against ruleset ${rules.version}`,
      confidenceOrValue: `Result: ${onion.grade}`,
      status: onion.grade === 'Grade A' ? ('pass' as const) : (onion.grade === 'URS' ? 'warn' as const : 'fail' as const)
    }
  ];

  if (onion.isManuallyCorrected) {
    pipelineTrace.push({
      stage: '5. Human-in-the-Loop Override',
      finding: `Procurement operator adjusted state from "${onion.originalCondition || 'Unknown'}" to "${onion.condition}"`,
      confidenceOrValue: `Note: ${onion.correctionReason || 'Operator field correction'}`,
      status: 'info' as const
    });
  }

  return {
    onionId: onion.id,
    condition: onion.condition,
    defectType: onion.defectType,
    diameterMm: onion.diameterMm,
    grade: onion.grade,
    isCorrected: onion.isManuallyCorrected,
    correctionNote: onion.correctionReason,
    verdictTitle,
    verdictDescription,
    regulatoryRationale,
    pipelineTrace
  };
}
