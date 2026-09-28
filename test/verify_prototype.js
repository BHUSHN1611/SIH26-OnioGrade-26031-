// ============================================================================
// ONIOGRADE - AUTOMATED INTEGRATION & VERIFICATION SUITE
// Tests all 10 demo batches, grading engine logic, human-in-the-loop recalculation,
// explainability traces, evidence hashes, and summary aggregation.
// ============================================================================

import { getDemoBatches } from '../src/data/demoBatches.ts';
import { evaluateOnionGrade, calculateBatchSummary, DEFAULT_PROTOTYPE_RULES } from '../src/engine/gradingEngine.ts';
import { generateOnionExplanation } from '../src/engine/explainabilityEngine.ts';
import { generateVerificationHash, createCorrectionAuditEntry } from '../src/engine/evidencePack.ts';

console.log('🧪 Starting OnioGrade Automated Verification Suite...\n');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    testsFailed++;
  }
}

// ----------------------------------------------------------------------------
// TEST 1: 10 Predefined Demo Batches Ingestion
// ----------------------------------------------------------------------------
console.log('📋 Test Group 1: 10 Predefined Agricultural Demo Batches');
const demoBatches = getDemoBatches();
assert(demoBatches.length === 10, `Loaded exactly 10 demo batches (Actual: ${demoBatches.length})`);

demoBatches.forEach((batch, idx) => {
  assert(batch.onions.length >= 14, `Batch #${idx + 1} (${batch.id}) has ${batch.onions.length} detected bulbs`);
  assert(batch.summary.totalCount === batch.onions.length, `Batch #${idx + 1} summary total matches bulb array length`);
  assert(batch.verificationHash.startsWith('0x'), `Batch #${idx + 1} has valid cryptographic hash (${batch.verificationHash.slice(0, 10)}...)`);
  assert(batch.imageUrl.startsWith('data:image/svg+xml'), `Batch #${idx + 1} has procedural SVG visual asset`);
});

// ----------------------------------------------------------------------------
// TEST 2: Dynamic Grading Engine Logic (Pure Functional)
// ----------------------------------------------------------------------------
console.log('\n⚖️ Test Group 2: Grading Engine Dynamic Rules');

// Case A: Sound 55mm bulb -> Grade A
const evalGradeA = evaluateOnionGrade('Healthy', 55.0, DEFAULT_PROTOTYPE_RULES);
assert(evalGradeA.grade === 'Grade A', `Healthy 55mm bulb allocated Grade A (Actual: ${evalGradeA.grade})`);

// Case B: Sound 40mm bulb -> URS (35-44mm)
const evalURS = evaluateOnionGrade('Healthy', 40.0, DEFAULT_PROTOTYPE_RULES);
assert(evalURS.grade === 'URS', `Healthy 40mm bulb allocated URS (Actual: ${evalURS.grade})`);

// Case C: Sound 32mm bulb -> Defective (<35mm)
const evalUndersized = evaluateOnionGrade('Healthy', 32.0, DEFAULT_PROTOTYPE_RULES);
assert(evalUndersized.grade === 'Defective', `Healthy 32mm bulb allocated Defective floor (Actual: ${evalUndersized.grade})`);

// Case D: Rotten 56mm bulb -> Defective
const evalRot = evaluateOnionGrade('Rotten', 56.0, DEFAULT_PROTOTYPE_RULES);
assert(evalRot.grade === 'Defective', `Rotten 56mm bulb allocated Defective (Actual: ${evalRot.grade})`);

// Case E: Sprouted 54mm bulb -> Defective
const evalSprout = evaluateOnionGrade('Sprouted', 54.0, DEFAULT_PROTOTYPE_RULES);
assert(evalSprout.grade === 'Defective', `Sprouted 54mm bulb allocated Defective (Actual: ${evalSprout.grade})`);

// Case F: Damaged 52mm bulb -> Defective
const evalDamage = evaluateOnionGrade('Damaged', 52.0, DEFAULT_PROTOTYPE_RULES);
assert(evalDamage.grade === 'Defective', `Cut-Damaged 52mm bulb allocated Defective (Actual: ${evalDamage.grade})`);

// ----------------------------------------------------------------------------
// TEST 3: Dynamic Percentage Calculation
// ----------------------------------------------------------------------------
console.log('\n📊 Test Group 3: Dynamic Batch Percentage Calculations');
const mixedBatch = demoBatches.find(b => b.id === 'ONIO-2026-DEMO-06');
assert(!!mixedBatch, 'Found Recommended Mixed Mandi Batch');

const sumPcts = Number((mixedBatch.summary.gradeAPct + mixedBatch.summary.ursPct + mixedBatch.summary.defectivePct).toFixed(1));
assert(Math.abs(sumPcts - 100) <= 0.2, `Percentages sum to 100% (Actual sum: ${sumPcts}%)`);

// ----------------------------------------------------------------------------
// TEST 4: Human-in-the-Loop Override & Recalculation
// ----------------------------------------------------------------------------
console.log('\n🧑‍🌾 Test Group 4: Human-in-the-Loop Correction & Recalculation');
const originalGradeACount = mixedBatch.summary.gradeACount;
const originalGradeAPct = mixedBatch.summary.gradeAPct;
const damagedBulb = mixedBatch.onions.find(o => o.condition === 'Damaged');

assert(!!damagedBulb, `Found damaged bulb #${damagedBulb?.id} for operator test`);

// Simulate Operator correcting damaged bulb to Healthy
const updatedOnions = mixedBatch.onions.map(o => {
  if (o.id === damagedBulb.id) {
    const reEval = evaluateOnionGrade('Healthy', o.diameterMm, DEFAULT_PROTOTYPE_RULES);
    return {
      ...o,
      condition: 'Healthy',
      grade: reEval.grade,
      isManuallyCorrected: true,
      correctionReason: 'Visual check confirmed superficial skin dust, not flesh cut'
    };
  }
  return o;
});

const recalculatedSummary = calculateBatchSummary(updatedOnions);
assert(recalculatedSummary.gradeACount === originalGradeACount + 1, `Grade A count increased from ${originalGradeACount} to ${recalculatedSummary.gradeACount}`);
assert(recalculatedSummary.gradeAPct > originalGradeAPct, `Grade A % increased dynamically (${originalGradeAPct}% -> ${recalculatedSummary.gradeAPct}%)`);
assert(recalculatedSummary.defectCounts.damaged === mixedBatch.summary.defectCounts.damaged - 1, 'Damaged count decremented by 1');

// ----------------------------------------------------------------------------
// TEST 5: Explainability Engine Traces
// ----------------------------------------------------------------------------
console.log('\n🔍 Test Group 5: Explainability Decision Traces');
const sampleExplanation = generateOnionExplanation(mixedBatch.onions[0], DEFAULT_PROTOTYPE_RULES);
assert(sampleExplanation.pipelineTrace.length >= 4, `Generated 4-step pipeline trace for Bulb #${mixedBatch.onions[0].id}`);
assert(sampleExplanation.verdictTitle.length > 0, `Verdict Title generated: "${sampleExplanation.verdictTitle}"`);
assert(sampleExplanation.regulatoryRationale.includes('DoCA'), 'Regulatory rationale includes DoCA policy reference');

// ----------------------------------------------------------------------------
// TEST 6: Cryptographic Verification Digest
// ----------------------------------------------------------------------------
console.log('\n🔐 Test Group 6: Cryptographic Evidence Hash Integrity');
const hash1 = generateVerificationHash(mixedBatch.id, mixedBatch.createdAt, mixedBatch.onions);
const hash2 = generateVerificationHash(mixedBatch.id, mixedBatch.createdAt, updatedOnions);
assert(hash1.length === 66, `Hash has 66 characters: ${hash1}`);
assert(hash1 !== hash2, `Hash changed after human correction to reflect modified ledger state`);

console.log('\n==================================================');
console.log(`TEST RESULTS: ${testsPassed} PASSED, ${testsFailed} FAILED`);
console.log('==================================================\n');

if (testsFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
