// ============================================================================
// ONIOGRADE - GRADING ENGINE (PROTOTYPE RULES)
// Smart India Hackathon 2026 - Problem Statement 26031 (DoCA)
// ============================================================================

import { 
  OnionCondition, 
  OnionGrade, 
  GradingRulesConfig, 
  RuleStepExplanation,
  OnionRecord,
  BatchSummary,
  BatchDefectSummary
} from '../types';

export const DEFAULT_PROTOTYPE_RULES: GradingRulesConfig = {
  version: 'DoCA-Prototype-v1.2',
  title: 'Prototype Procurement Grading Specification',
  minGradeADiameterMm: 45,        // Grade A minimum diameter threshold (mm)
  minUrsDiameterMm: 35,           // URS (Under-sized/Re-sorted) minimum diameter (mm)
  allowMinorSkinPeelInGradeA: true,
  rejectRottenImmediately: true,
  rejectSproutedImmediately: true,
  rejectCutDamageImmediately: true,
};

/**
 * Pure evaluation function for a single onion bulb against grading rules.
 * Generates both the resulting grade and an auditable decision trace.
 */
export function evaluateOnionGrade(
  condition: OnionCondition,
  diameterMm: number,
  rules: GradingRulesConfig = DEFAULT_PROTOTYPE_RULES
): {
  grade: OnionGrade;
  explanation: RuleStepExplanation[];
  summaryReason: string;
} {
  const explanation: RuleStepExplanation[] = [];

  // Step 1: Biological & Structural Decay (Rot)
  const isRotten = condition === 'Rotten';
  explanation.push({
    stepIndex: 1,
    stepName: 'Fungal & Soft Rot Check',
    ruleDescription: 'Any active soft rot, black mold (Aspergillus niger), or liquefaction renders the bulb immediately defective.',
    conditionEvaluated: `Condition is ${condition}`,
    passed: !isRotten,
    impactOnGrade: isRotten ? 'Immediate Rejection (Defective)' : 'Passes to sprouting check'
  });

  if (isRotten) {
    return {
      grade: 'Defective',
      explanation,
      summaryReason: 'Classified as Defective due to soft/fungal rot detection. Unfit for public buffer stock.'
    };
  }

  // Step 2: Vegetative Growth (Sprouting)
  const isSprouted = condition === 'Sprouted';
  explanation.push({
    stepIndex: 2,
    stepName: 'Vegetative Sprouting Check',
    ruleDescription: 'Sprouted bulbs indicate dormancy break and moisture loss. Disallowed in Grade A & URS procurement.',
    conditionEvaluated: `Condition is ${condition}`,
    passed: !isSprouted,
    impactOnGrade: isSprouted ? 'Immediate Rejection (Defective)' : 'Passes to mechanical damage check'
  });

  if (isSprouted) {
    return {
      grade: 'Defective',
      explanation,
      summaryReason: 'Classified as Defective due to active green shoot sprouting (end of storage dormancy).'
    };
  }

  // Step 3: Mechanical Damage (Cuts / Bruises)
  const isDamaged = condition === 'Damaged';
  explanation.push({
    stepIndex: 3,
    stepName: 'Mechanical Damage & Cut Check',
    ruleDescription: 'Severe mechanical cuts, crushed scales, or deep puncture wounds breach tissue integrity.',
    conditionEvaluated: `Condition is ${condition}`,
    passed: !isDamaged,
    impactOnGrade: isDamaged ? 'Immediate Rejection (Defective)' : 'Passes to dimensional sizing'
  });

  if (isDamaged) {
    return {
      grade: 'Defective',
      explanation,
      summaryReason: 'Classified as Defective due to mechanical cut/crush damage exposing flesh.'
    };
  }

  // Step 4: Minimum Floor Sizing Check (< minUrsDiameterMm)
  const isSeverelyUndersized = diameterMm < rules.minUrsDiameterMm || condition === 'Undersized';
  const belowFloor = diameterMm < rules.minUrsDiameterMm;
  
  explanation.push({
    stepIndex: 4,
    stepName: 'Procurement Floor Diameter Check',
    ruleDescription: `Bulbs below ${rules.minUrsDiameterMm} mm are non-procurement grade culled stock.`,
    conditionEvaluated: `Diameter = ${diameterMm.toFixed(1)} mm (Threshold: >= ${rules.minUrsDiameterMm} mm)`,
    passed: !belowFloor,
    impactOnGrade: belowFloor ? 'Floor violation -> Defective' : 'Eligible for procurement sizing'
  });

  if (belowFloor) {
    return {
      grade: 'Defective',
      explanation,
      summaryReason: `Classified as Defective because diameter (${diameterMm.toFixed(1)} mm) is strictly below the ${rules.minUrsDiameterMm} mm procurement floor.`
    };
  }

  // Step 5: Grade A Threshold Check (>= minGradeADiameterMm)
  const meetsGradeASize = diameterMm >= rules.minGradeADiameterMm;
  explanation.push({
    stepIndex: 5,
    stepName: 'Grade A Size Compliance',
    ruleDescription: `Sound healthy bulbs with diameter >= ${rules.minGradeADiameterMm} mm qualify for Grade A Fair Average Quality (FAQ).`,
    conditionEvaluated: `Diameter = ${diameterMm.toFixed(1)} mm (Threshold: >= ${rules.minGradeADiameterMm} mm)`,
    passed: meetsGradeASize,
    impactOnGrade: meetsGradeASize ? 'Qualified for Grade A' : 'Falls into URS (Under-sized / Re-sorted) band'
  });

  if (meetsGradeASize) {
    return {
      grade: 'Grade A',
      explanation,
      summaryReason: `Qualified as Grade A: Sound bulb, defect-free, diameter ${diameterMm.toFixed(1)} mm meets the >= ${rules.minGradeADiameterMm} mm benchmark.`
    };
  }

  // Step 6: URS (Under-sized / Re-sorted) Band (minUrsDiameterMm <= diameter < minGradeADiameterMm)
  explanation.push({
    stepIndex: 6,
    stepName: 'URS (Under-sized / Re-sorted) Classification',
    ruleDescription: `Bulbs between ${rules.minUrsDiameterMm} mm and ${rules.minGradeADiameterMm - 1} mm are sound but sub-standard in size. Eligible for discounted release.`,
    conditionEvaluated: `${rules.minUrsDiameterMm} mm <= ${diameterMm.toFixed(1)} mm < ${rules.minGradeADiameterMm} mm`,
    passed: true,
    impactOnGrade: 'Assigned URS Grade'
  });

  return {
    grade: 'URS',
    explanation,
    summaryReason: `Assigned URS Grade: Biologically sound, but diameter (${diameterMm.toFixed(1)} mm) falls in the sub-standard ${rules.minUrsDiameterMm}–${rules.minGradeADiameterMm - 1} mm band.`
  };
}

/**
 * Calculates complete batch summary statistics dynamically from active onion records.
 * NEVER hardcodes percentages.
 */
export function calculateBatchSummary(onions: OnionRecord[]): BatchSummary {
  const totalCount = onions.length;
  if (totalCount === 0) {
    return {
      totalCount: 0,
      gradeACount: 0,
      gradeAPct: 0,
      ursCount: 0,
      ursPct: 0,
      defectiveCount: 0,
      defectivePct: 0,
      avgDiameterMm: 0,
      minDiameterMm: 0,
      maxDiameterMm: 0,
      defectCounts: {
        healthy: 0,
        damaged: 0,
        rotten: 0,
        sprouted: 0,
        undersized: 0,
      },
      estimatedWeightKg: 0
    };
  }

  let gradeACount = 0;
  let ursCount = 0;
  let defectiveCount = 0;

  const defectCounts: BatchDefectSummary = {
    healthy: 0,
    damaged: 0,
    rotten: 0,
    sprouted: 0,
    undersized: 0,
  };

  let sumDiameter = 0;
  let minDiameter = Infinity;
  let maxDiameter = -Infinity;

  for (const onion of onions) {
    // Grade tally
    if (onion.grade === 'Grade A') gradeACount++;
    else if (onion.grade === 'URS') ursCount++;
    else defectiveCount++;

    // Defect breakdown tally
    const cond = onion.condition.toLowerCase();
    if (cond === 'healthy') defectCounts.healthy++;
    else if (cond === 'damaged') defectCounts.damaged++;
    else if (cond === 'rotten') defectCounts.rotten++;
    else if (cond === 'sprouted') defectCounts.sprouted++;
    else if (cond === 'undersized') defectCounts.undersized++;

    // Diameter stats
    sumDiameter += onion.diameterMm;
    if (onion.diameterMm < minDiameter) minDiameter = onion.diameterMm;
    if (onion.diameterMm > maxDiameter) maxDiameter = onion.diameterMm;
  }

  const gradeAPct = Number(((gradeACount / totalCount) * 100).toFixed(1));
  const ursPct = Number(((ursCount / totalCount) * 100).toFixed(1));
  const defectivePct = Number(((defectiveCount / totalCount) * 100).toFixed(1));
  const avgDiameterMm = Number((sumDiameter / totalCount).toFixed(1));

  // Rough volumetric weight estimation model (density ~ 0.95 g/cm3 for red onion sphere)
  // V = (4/3)*pi*(r^3), mass = V * density
  let totalMassGrams = 0;
  for (const o of onions) {
    const rCm = (o.diameterMm / 10) / 2;
    const volCm3 = (4 / 3) * Math.PI * Math.pow(rCm, 3);
    totalMassGrams += volCm3 * 0.95;
  }
  const estimatedWeightKg = Number((totalMassGrams / 1000).toFixed(2));

  return {
    totalCount,
    gradeACount,
    gradeAPct,
    ursCount,
    ursPct,
    defectiveCount,
    defectivePct,
    avgDiameterMm,
    minDiameterMm: minDiameter === Infinity ? 0 : Number(minDiameter.toFixed(1)),
    maxDiameterMm: maxDiameter === -Infinity ? 0 : Number(maxDiameter.toFixed(1)),
    defectCounts,
    estimatedWeightKg
  };
}
