// ============================================================================
// ONIOGRADE - 10 PREDEFINED DEMO CASES (SIH 26031)
// Deterministic datasets with high-fidelity visual representations
// ============================================================================

import { BatchRecord, OnionRecord } from '../types';
import { evaluateOnionGrade, calculateBatchSummary, DEFAULT_PROTOTYPE_RULES } from '../engine/gradingEngine';
import { generateVerificationHash } from '../engine/evidencePack';

/**
 * Procedurally generates an ultra-clean, realistic SVG data-URL representing an
 * agricultural quality inspection tray with onions matching the exact detected positions.
 */
function createTraySvg(
  onions: { x: number; y: number; w: number; h: number; condition: string; diameterMm: number; id: number }[],
  trayTitle: string,
  lightingHue: number = 35
): string {
  const width = 800;
  const height = 600;

  let bulbsSvg = '';

  for (const o of onions) {
    const cx = (o.x + o.w / 2) * (width / 100);
    const cy = (o.y + o.h / 2) * (height / 100);
    const rx = (o.w / 2) * (width / 100) * 0.95;
    const ry = (o.h / 2) * (height / 100) * 0.92;

    // Base skin color variations (Nashik red / pinkish copper)
    let skinColor = '#a83248';
    let highlightColor = '#d9667a';
    let shadowColor = '#6e1b2b';

    if (o.condition === 'Rotten') {
      skinColor = '#4a251e';
      highlightColor = '#5c382e';
      shadowColor = '#24100c';
    } else if (o.condition === 'Sprouted') {
      skinColor = '#943242';
      highlightColor = '#b54e5e';
    } else if (o.condition === 'Damaged') {
      skinColor = '#a33b49';
      highlightColor = '#d16675';
    } else if (o.condition === 'Undersized') {
      skinColor = '#b84458';
      highlightColor = '#e0798a';
    }

    // Shadow below bulb
    bulbsSvg += `
      <ellipse cx="${cx + 4}" cy="${cy + ry * 0.8}" rx="${rx * 0.95}" ry="${ry * 0.4}" fill="rgba(20, 25, 20, 0.4)" filter="blur(4px)" />
    `;

    // Main bulb body with realistic gradient and papery striations
    const gradId = `bulbGrad_${o.id}_${Math.round(cx)}`;
    bulbsSvg += `
      <defs>
        <radialGradient id="${gradId}" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stop-color="${highlightColor}" />
          <stop offset="60%" stop-color="${skinColor}" />
          <stop offset="100%" stop-color="${shadowColor}" />
        </radialGradient>
      </defs>
      <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${gradId})" />
    `;

    // Papery tunic striation lines
    bulbsSvg += `
      <path d="M ${cx - rx * 0.7} ${cy - ry * 0.2} Q ${cx} ${cy - ry * 0.7} ${cx + rx * 0.7} ${cy - ry * 0.2}" stroke="${highlightColor}" stroke-width="1.2" fill="none" opacity="0.4" />
      <path d="M ${cx - rx * 0.8} ${cy + ry * 0.1} Q ${cx} ${cy + ry * 0.6} ${cx + rx * 0.8} ${cy + ry * 0.1}" stroke="${shadowColor}" stroke-width="1.2" fill="none" opacity="0.35" />
      <path d="M ${cx - rx * 0.2} ${cy - ry * 0.8} Q ${cx - rx * 0.4} ${cy} ${cx - rx * 0.2} ${cy + ry * 0.8}" stroke="${shadowColor}" stroke-width="1.2" fill="none" opacity="0.35" />
      <path d="M ${cx + rx * 0.2} ${cy - ry * 0.8} Q ${cx + rx * 0.4} ${cy} ${cx + rx * 0.2} ${cy + ry * 0.8}" stroke="${shadowColor}" stroke-width="1.2" fill="none" opacity="0.35" />
    `;

    // Root tuft (bottom)
    bulbsSvg += `
      <path d="M ${cx - 5} ${cy + ry - 2} Q ${cx} ${cy + ry + 7} ${cx + 4} ${cy + ry - 1}" stroke="#78593c" stroke-width="2.2" fill="none" />
      <circle cx="${cx}" cy="${cy + ry}" r="2" fill="#523924" />
    `;

    // Apical neck (top)
    bulbsSvg += `
      <path d="M ${cx - 3} ${cy - ry + 2} L ${cx} ${cy - ry - 6} L ${cx + 3} ${cy - ry + 2}" stroke="#8c4436" stroke-width="2" fill="#693026" />
    `;

    // Condition specific visual markers
    if (o.condition === 'Sprouted') {
      // Vivid green shoots emerging from apex
      bulbsSvg += `
        <!-- Sprout leaves -->
        <path d="M ${cx} ${cy - ry - 4} Q ${cx - 12} ${cy - ry - 28} ${cx - 7} ${cy - ry - 38} Q ${cx - 2} ${cy - ry - 24} ${cx + 2} ${cy - ry - 4}" fill="#4caf50" stroke="#2e7d32" stroke-width="1.2" />
        <path d="M ${cx + 1} ${cy - ry - 4} Q ${cx + 14} ${cy - ry - 30} ${cx + 9} ${cy - ry - 42} Q ${cx + 3} ${cy - ry - 22} ${cx + 3} ${cy - ry - 4}" fill="#66bb6a" stroke="#2e7d32" stroke-width="1.2" />
      `;
    } else if (o.condition === 'Rotten') {
      // Black mold / sunken decay patch
      bulbsSvg += `
        <!-- Soft rot lesion -->
        <ellipse cx="${cx - rx * 0.2}" cy="${cy + ry * 0.1}" rx="${rx * 0.45}" ry="${ry * 0.4}" fill="#1c0f0c" opacity="0.88" />
        <ellipse cx="${cx - rx * 0.2}" cy="${cy + ry * 0.1}" rx="${rx * 0.3}" ry="${ry * 0.25}" fill="#0f0705" />
        <circle cx="${cx - rx * 0.1}" cy="${cy + ry * 0.15}" r="3" fill="#3d2b27" opacity="0.7" />
        <!-- Fungal spore dusting -->
        <circle cx="${cx - rx * 0.3}" cy="${cy + ry * 0.05}" r="2" fill="#616161" />
        <circle cx="${cx - rx * 0.15}" cy="${cy + ry * 0.2}" r="1.5" fill="#757575" />
      `;
    } else if (o.condition === 'Damaged') {
      // Mechanical cut wound exposing lighter pale flesh
      bulbsSvg += `
        <!-- Cut scar -->
        <path d="M ${cx - rx * 0.4} ${cy - ry * 0.3} Q ${cx} ${cy} ${cx + rx * 0.45} ${cy + ry * 0.2}" stroke="#f5e6d3" stroke-width="6" stroke-linecap="round" fill="none" />
        <path d="M ${cx - rx * 0.35} ${cy - ry * 0.28} Q ${cx} ${cy} ${cx + rx * 0.4} ${cy + ry * 0.18}" stroke="#e0c8b0" stroke-width="2.5" fill="none" />
        <line x1="${cx - rx * 0.1}" y1="${cy - 6}" x2="${cx + 8}" y2="${cy + 7}" stroke="#a84343" stroke-width="1.5" />
      `;
    }
  }

  const svgRaw = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
      <!-- Inspection Tray Background (Matte Industrial Blue-Grey Agriculture Tray) -->
      <defs>
        <linearGradient id="trayBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#2a333d" />
          <stop offset="100%" stop-color="#1e252d" />
        </linearGradient>
        <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.035)" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#trayBg)" />
      <rect width="${width}" height="${height}" fill="url(#gridPattern)" />
      
      <!-- Calibration Ruler Bar in Corner -->
      <g transform="translate(25, 25)" opacity="0.85">
        <rect width="180" height="26" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
        <text x="10" y="17" font-family="'JetBrains Mono', monospace" font-size="11" fill="#94a3b8">CALIBRATION: 100mm</text>
        <line x1="140" y1="8" x2="140" y2="18" stroke="#38bdf8" stroke-width="2"/>
        <line x1="170" y1="8" x2="170" y2="18" stroke="#38bdf8" stroke-width="2"/>
        <line x1="140" y1="13" x2="170" y2="13" stroke="#38bdf8" stroke-width="1.5"/>
      </g>

      <!-- Center Procurement Tray Identification Tag -->
      <g transform="translate(${width - 240}, 25)" opacity="0.85">
        <rect width="215" height="26" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
        <text x="10" y="17" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="#34d399">BATCH: ${trayTitle}</text>
      </g>

      <!-- Onion Bulbs Group -->
      ${bulbsSvg}

      <!-- Bottom Status Strip -->
      <g transform="translate(0, ${height - 24})">
        <rect width="${width}" height="24" fill="rgba(15, 23, 42, 0.75)"/>
        <text x="20" y="16" font-family="'Inter', sans-serif" font-size="11" fill="#64748b">
          DoCA Smart Procurement Lab • 2048x1536 Raw Sensor Capture • Calibrated Tray Grid
        </text>
      </g>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgRaw)}`;
}

interface RawDemoDef {
  id: string;
  name: string;
  scenario: string;
  description: string;
  procurementCenter: string;
  rawBulbs: {
    x: number;
    y: number;
    w: number;
    h: number;
    condition: 'Healthy' | 'Damaged' | 'Rotten' | 'Sprouted' | 'Undersized';
    defectType: any;
    diameterMm: number;
    confidence: number;
  }[];
}

const DEMO_DEFINITIONS: RawDemoDef[] = [
  // 1. Healthy-dominant batch (FAQ Grade A Export Standard)
  {
    id: 'ONIO-2026-DEMO-01',
    name: 'Export Grade FAQ Red Onions',
    scenario: 'Healthy-Dominant Procurement Lot',
    description: 'Uniform Nashik red onions from APMC Lasalgaon. Dry outer scales, minimal blemishes, high Grade A compliance.',
    procurementCenter: 'APMC Lasalgaon, Nashik (Maharashtra)',
    rawBulbs: [
      { x: 10, y: 15, w: 14, h: 18, condition: 'Healthy', defectType: null, diameterMm: 56.4, confidence: 0.96 },
      { x: 28, y: 14, w: 15, h: 19, condition: 'Healthy', defectType: null, diameterMm: 58.2, confidence: 0.98 },
      { x: 47, y: 16, w: 13, h: 17, condition: 'Healthy', defectType: null, diameterMm: 52.8, confidence: 0.95 },
      { x: 65, y: 15, w: 14, h: 18, condition: 'Healthy', defectType: null, diameterMm: 55.1, confidence: 0.97 },
      { x: 82, y: 18, w: 12, h: 16, condition: 'Healthy', defectType: null, diameterMm: 48.7, confidence: 0.93 },
      { x: 12, y: 40, w: 15, h: 19, condition: 'Healthy', defectType: null, diameterMm: 60.1, confidence: 0.99 },
      { x: 31, y: 42, w: 14, h: 18, condition: 'Healthy', defectType: null, diameterMm: 54.3, confidence: 0.96 },
      { x: 50, y: 39, w: 15, h: 19, condition: 'Healthy', defectType: null, diameterMm: 59.5, confidence: 0.97 },
      { x: 69, y: 41, w: 13, h: 17, condition: 'Healthy', defectType: null, diameterMm: 51.9, confidence: 0.94 },
      { x: 84, y: 43, w: 11, h: 15, condition: 'Healthy', defectType: null, diameterMm: 42.4, confidence: 0.91 }, // URS
      { x: 14, y: 66, w: 14, h: 18, condition: 'Healthy', defectType: null, diameterMm: 53.6, confidence: 0.95 },
      { x: 33, y: 68, w: 14, h: 17, condition: 'Healthy', defectType: null, diameterMm: 52.1, confidence: 0.96 },
      { x: 52, y: 67, w: 15, h: 19, condition: 'Healthy', defectType: null, diameterMm: 57.8, confidence: 0.97 },
      { x: 71, y: 69, w: 12, h: 16, condition: 'Healthy', defectType: null, diameterMm: 43.8, confidence: 0.92 }, // URS
      { x: 85, y: 70, w: 11, h: 15, condition: 'Healthy', defectType: null, diameterMm: 41.5, confidence: 0.90 }  // URS
    ]
  },

  // 2. Damaged onion batch
  {
    id: 'ONIO-2026-DEMO-02',
    name: 'Mechanical Harvest Damage Lot',
    scenario: 'High Mechanical Impact Cuts & Scuffs',
    description: 'Post-harvest mechanical digger damage. Visible cuts, exposed pale fleshy scales, high rejection risk.',
    procurementCenter: 'APMC Yeola, Nashik (Maharashtra)',
    rawBulbs: [
      { x: 12, y: 16, w: 14, h: 18, condition: 'Damaged', defectType: 'cut_damage', diameterMm: 54.2, confidence: 0.94 },
      { x: 30, y: 15, w: 15, h: 19, condition: 'Healthy', defectType: null, diameterMm: 57.6, confidence: 0.96 },
      { x: 49, y: 17, w: 13, h: 17, condition: 'Damaged', defectType: 'cut_damage', diameterMm: 51.0, confidence: 0.92 },
      { x: 68, y: 16, w: 14, h: 18, condition: 'Damaged', defectType: 'cut_damage', diameterMm: 53.5, confidence: 0.95 },
      { x: 84, y: 19, w: 12, h: 16, condition: 'Healthy', defectType: null, diameterMm: 47.9, confidence: 0.91 },
      { x: 14, y: 42, w: 14, h: 18, condition: 'Damaged', defectType: 'cut_damage', diameterMm: 55.4, confidence: 0.93 },
      { x: 32, y: 40, w: 15, h: 19, condition: 'Healthy', defectType: null, diameterMm: 58.1, confidence: 0.97 },
      { x: 51, y: 43, w: 13, h: 17, condition: 'Damaged', defectType: 'cut_damage', diameterMm: 49.3, confidence: 0.94 },
      { x: 70, y: 41, w: 14, h: 18, condition: 'Healthy', defectType: null, diameterMm: 52.7, confidence: 0.95 },
      { x: 86, y: 44, w: 11, h: 15, condition: 'Healthy', defectType: null, diameterMm: 41.2, confidence: 0.89 }, // URS
      { x: 16, y: 68, w: 14, h: 18, condition: 'Damaged', defectType: 'cut_damage', diameterMm: 53.0, confidence: 0.94 },
      { x: 35, y: 69, w: 14, h: 17, condition: 'Healthy', defectType: null, diameterMm: 51.8, confidence: 0.95 },
      { x: 54, y: 67, w: 15, h: 19, condition: 'Healthy', defectType: null, diameterMm: 56.9, confidence: 0.96 },
      { x: 73, y: 70, w: 12, h: 16, condition: 'Healthy', defectType: null, diameterMm: 43.1, confidence: 0.90 }  // URS
    ]
  },

  // 3. Rotten onion batch
  {
    id: 'ONIO-2026-DEMO-03',
    name: 'Fungal Black Mold & Soft Rot Lot',
    scenario: 'High Microbial & Soft Rot Infestation',
    description: 'Post-monsoon damp storage decay showing Aspergillus niger mold colonies and water-soaked soft rot.',
    procurementCenter: 'APMC Alwar (Rajasthan)',
    rawBulbs: [
      { x: 12, y: 16, w: 14, h: 18, condition: 'Rotten', defectType: 'rot', diameterMm: 53.8, confidence: 0.97 },
      { x: 31, y: 15, w: 14, h: 18, condition: 'Rotten', defectType: 'rot', diameterMm: 52.4, confidence: 0.95 },
      { x: 50, y: 17, w: 15, h: 19, condition: 'Healthy', defectType: null, diameterMm: 58.0, confidence: 0.96 },
      { x: 69, y: 16, w: 14, h: 18, condition: 'Rotten', defectType: 'rot', diameterMm: 50.7, confidence: 0.96 },
      { x: 85, y: 19, w: 12, h: 16, condition: 'Healthy', defectType: null, diameterMm: 46.2, confidence: 0.92 },
      { x: 14, y: 42, w: 15, h: 19, condition: 'Healthy', defectType: null, diameterMm: 59.1, confidence: 0.97 },
      { x: 33, y: 41, w: 14, h: 18, condition: 'Rotten', defectType: 'rot', diameterMm: 54.6, confidence: 0.98 },
      { x: 52, y: 43, w: 14, h: 18, condition: 'Rotten', defectType: 'rot', diameterMm: 51.3, confidence: 0.94 },
      { x: 71, y: 40, w: 15, h: 19, condition: 'Healthy', defectType: null, diameterMm: 57.4, confidence: 0.95 },
      { x: 86, y: 44, w: 11, h: 15, condition: 'Healthy', defectType: null, diameterMm: 40.8, confidence: 0.89 }, // URS
      { x: 16, y: 67, w: 14, h: 18, condition: 'Rotten', defectType: 'rot', diameterMm: 49.5, confidence: 0.96 },
      { x: 35, y: 69, w: 14, h: 17, condition: 'Healthy', defectType: null, diameterMm: 52.0, confidence: 0.94 },
      { x: 54, y: 68, w: 14, h: 18, condition: 'Rotten', defectType: 'rot', diameterMm: 53.2, confidence: 0.95 },
      { x: 73, y: 70, w: 12, h: 16, condition: 'Healthy', defectType: null, diameterMm: 42.6, confidence: 0.91 }  // URS
    ]
  },

  // 4. Sprouted onion batch
  {
    id: 'ONIO-2026-DEMO-04',
    name: 'Vegetative Shoot Sprouted Lot',
    scenario: 'Post-Cold Storage Dormancy Break',
    description: 'Bulbs stored past recommended dormancy window, exhibiting prominent emergent green apical foliage shoots.',
    procurementCenter: 'APMC Hubli (Karnataka)',
    rawBulbs: [
      { x: 12, y: 18, w: 14, h: 18, condition: 'Sprouted', defectType: 'sprout', diameterMm: 55.0, confidence: 0.98 },
      { x: 30, y: 17, w: 15, h: 19, condition: 'Healthy', defectType: null, diameterMm: 58.4, confidence: 0.96 },
      { x: 49, y: 19, w: 14, h: 18, condition: 'Sprouted', defectType: 'sprout', diameterMm: 52.8, confidence: 0.97 },
      { x: 68, y: 18, w: 14, h: 18, condition: 'Sprouted', defectType: 'sprout', diameterMm: 54.1, confidence: 0.99 },
      { x: 84, y: 20, w: 12, h: 16, condition: 'Healthy', defectType: null, diameterMm: 48.0, confidence: 0.92 },
      { x: 14, y: 44, w: 14, h: 18, condition: 'Sprouted', defectType: 'sprout', diameterMm: 53.6, confidence: 0.98 },
      { x: 32, y: 42, w: 15, h: 19, condition: 'Healthy', defectType: null, diameterMm: 57.2, confidence: 0.95 },
      { x: 51, y: 45, w: 14, h: 18, condition: 'Sprouted', defectType: 'sprout', diameterMm: 51.4, confidence: 0.97 },
      { x: 70, y: 43, w: 14, h: 18, condition: 'Healthy', defectType: null, diameterMm: 53.3, confidence: 0.94 },
      { x: 86, y: 46, w: 11, h: 15, condition: 'Healthy', defectType: null, diameterMm: 41.8, confidence: 0.90 }, // URS
      { x: 16, y: 69, w: 14, h: 18, condition: 'Sprouted', defectType: 'sprout', diameterMm: 52.5, confidence: 0.98 },
      { x: 35, y: 70, w: 14, h: 17, condition: 'Healthy', defectType: null, diameterMm: 50.9, confidence: 0.93 },
      { x: 54, y: 68, w: 14, h: 18, condition: 'Sprouted', defectType: 'sprout', diameterMm: 54.7, confidence: 0.99 },
      { x: 73, y: 71, w: 12, h: 16, condition: 'Healthy', defectType: null, diameterMm: 42.0, confidence: 0.91 }  // URS
    ]
  },

  // 5. Undersized onion batch
  {
    id: 'ONIO-2026-DEMO-05',
    name: 'Undersized & Small Bulbs Lot',
    scenario: 'High Cull / Sub-standard Sizing (<35mm)',
    description: 'Immature or moisture-stressed harvest resulting in heavy concentration of small cull onions below 35mm floor.',
    procurementCenter: 'APMC Kurnool (Andhra Pradesh)',
    rawBulbs: [
      { x: 12, y: 18, w: 10, h: 14, condition: 'Undersized', defectType: 'undersized', diameterMm: 31.2, confidence: 0.95 },
      { x: 26, y: 17, w: 11, h: 15, condition: 'Undersized', defectType: 'undersized', diameterMm: 33.8, confidence: 0.96 },
      { x: 41, y: 19, w: 10, h: 14, condition: 'Undersized', defectType: 'undersized', diameterMm: 29.5, confidence: 0.94 },
      { x: 56, y: 18, w: 12, h: 16, condition: 'Healthy', defectType: null, diameterMm: 38.6, confidence: 0.92 }, // URS
      { x: 72, y: 17, w: 14, h: 18, condition: 'Healthy', defectType: null, diameterMm: 49.2, confidence: 0.95 }, // Grade A
      { x: 88, y: 19, w: 10, h: 14, condition: 'Undersized', defectType: 'undersized', diameterMm: 32.1, confidence: 0.93 },
      { x: 13, y: 44, w: 10, h: 14, condition: 'Undersized', defectType: 'undersized', diameterMm: 30.4, confidence: 0.95 },
      { x: 28, y: 43, w: 12, h: 16, condition: 'Healthy', defectType: null, diameterMm: 39.5, confidence: 0.93 }, // URS
      { x: 44, y: 42, w: 11, h: 15, condition: 'Undersized', defectType: 'undersized', diameterMm: 34.0, confidence: 0.94 },
      { x: 59, y: 44, w: 10, h: 14, condition: 'Undersized', defectType: 'undersized', diameterMm: 28.7, confidence: 0.96 },
      { x: 74, y: 43, w: 14, h: 18, condition: 'Healthy', defectType: null, diameterMm: 46.8, confidence: 0.94 }, // Grade A
      { x: 15, y: 69, w: 10, h: 14, condition: 'Undersized', defectType: 'undersized', diameterMm: 31.9, confidence: 0.95 },
      { x: 30, y: 70, w: 12, h: 16, condition: 'Healthy', defectType: null, diameterMm: 40.2, confidence: 0.92 }, // URS
      { x: 47, y: 68, w: 11, h: 15, condition: 'Undersized', defectType: 'undersized', diameterMm: 33.1, confidence: 0.94 },
      { x: 63, y: 70, w: 14, h: 18, condition: 'Healthy', defectType: null, diameterMm: 51.5, confidence: 0.96 }  // Grade A
    ]
  },

  // 6. Mixed-defect batch (Real-World Mandi Lot)
  {
    id: 'ONIO-2026-DEMO-06',
    name: 'Mixed Quality Mandi Lot (Recommended)',
    scenario: 'Realistic Real-World Distribution (All Categories)',
    description: 'Typical mixed procurement lot arriving from farm gate: sound FAQ bulbs, mechanical cuts, rot, sprouting, and undersized.',
    procurementCenter: 'APMC Pimpalgaon Baswant (Maharashtra)',
    rawBulbs: [
      { x: 8, y: 14, w: 14, h: 18, condition: 'Healthy', defectType: null, diameterMm: 55.4, confidence: 0.97 },
      { x: 26, y: 13, w: 14, h: 18, condition: 'Damaged', defectType: 'cut_damage', diameterMm: 52.8, confidence: 0.94 },
      { x: 44, y: 15, w: 15, h: 19, condition: 'Healthy', defectType: null, diameterMm: 58.1, confidence: 0.98 },
      { x: 63, y: 14, w: 14, h: 18, condition: 'Rotten', defectType: 'rot', diameterMm: 50.6, confidence: 0.96 },
      { x: 81, y: 16, w: 12, h: 16, condition: 'Healthy', defectType: null, diameterMm: 42.8, confidence: 0.91 }, // URS
      { x: 10, y: 39, w: 14, h: 18, condition: 'Sprouted', defectType: 'sprout', diameterMm: 53.7, confidence: 0.98 },
      { x: 28, y: 41, w: 15, h: 19, condition: 'Healthy', defectType: null, diameterMm: 60.5, confidence: 0.98 },
      { x: 47, y: 38, w: 14, h: 18, condition: 'Healthy', defectType: null, diameterMm: 54.0, confidence: 0.95 },
      { x: 65, y: 40, w: 10, h: 14, condition: 'Undersized', defectType: 'undersized', diameterMm: 31.5, confidence: 0.95 },
      { x: 82, y: 42, w: 13, h: 17, condition: 'Healthy', defectType: null, diameterMm: 47.9, confidence: 0.93 },
      { x: 11, y: 65, w: 14, h: 18, condition: 'Healthy', defectType: null, diameterMm: 52.3, confidence: 0.96 },
      { x: 29, y: 67, w: 14, h: 18, condition: 'Damaged', defectType: 'cut_damage', diameterMm: 49.8, confidence: 0.92 },
      { x: 48, y: 66, w: 15, h: 19, condition: 'Healthy', defectType: null, diameterMm: 56.7, confidence: 0.97 },
      { x: 66, y: 68, w: 14, h: 18, condition: 'Rotten', defectType: 'rot', diameterMm: 51.2, confidence: 0.95 },
      { x: 83, y: 69, w: 11, h: 15, condition: 'Healthy', defectType: null, diameterMm: 41.0, confidence: 0.90 }  // URS
    ]
  },

  // 7. High Grade-A batch (Nashik Premium)
  {
    id: 'ONIO-2026-DEMO-07',
    name: 'Nashik Premium Red Onions',
    scenario: 'High Grade-A Premium Certified Buffer Lot',
    description: 'Precision graded export quality stock. Over 85% Grade A compliance with optimal bulb density and diameter.',
    procurementCenter: 'APMC Kalwan, Nashik (Maharashtra)',
    rawBulbs: [
      { x: 10, y: 15, w: 15, h: 19, condition: 'Healthy', defectType: null, diameterMm: 62.0, confidence: 0.98 },
      { x: 29, y: 14, w: 15, h: 19, condition: 'Healthy', defectType: null, diameterMm: 64.5, confidence: 0.99 },
      { x: 48, y: 16, w: 14, h: 18, condition: 'Healthy', defectType: null, diameterMm: 59.2, confidence: 0.97 },
      { x: 67, y: 15, w: 15, h: 19, condition: 'Healthy', defectType: null, diameterMm: 61.8, confidence: 0.98 },
      { x: 84, y: 17, w: 13, h: 17, condition: 'Healthy', defectType: null, diameterMm: 53.4, confidence: 0.94 },
      { x: 12, y: 40, w: 15, h: 19, condition: 'Healthy', defectType: null, diameterMm: 63.1, confidence: 0.99 },
      { x: 31, y: 41, w: 15, h: 19, condition: 'Healthy', defectType: null, diameterMm: 60.7, confidence: 0.98 },
      { x: 50, y: 39, w: 16, h: 20, condition: 'Healthy', defectType: null, diameterMm: 66.2, confidence: 0.99 },
      { x: 69, y: 41, w: 14, h: 18, condition: 'Healthy', defectType: null, diameterMm: 58.5, confidence: 0.96 },
      { x: 85, y: 43, w: 12, h: 16, condition: 'Healthy', defectType: null, diameterMm: 44.0, confidence: 0.91 }, // URS
      { x: 14, y: 66, w: 15, h: 19, condition: 'Healthy', defectType: null, diameterMm: 57.9, confidence: 0.96 },
      { x: 33, y: 68, w: 15, h: 19, condition: 'Healthy', defectType: null, diameterMm: 61.4, confidence: 0.98 },
      { x: 52, y: 67, w: 16, h: 20, condition: 'Healthy', defectType: null, diameterMm: 65.0, confidence: 0.99 },
      { x: 71, y: 69, w: 13, h: 17, condition: 'Healthy', defectType: null, diameterMm: 52.5, confidence: 0.95 }
    ]
  },

  // 8. High-defect batch (Monsoon Damaged)
  {
    id: 'ONIO-2026-DEMO-08',
    name: 'Monsoon Flooded Spoilage Lot',
    scenario: 'High-Defect Spoilage (Severe Moisture Exposure)',
    description: 'Post-flood crop with moisture trapped in neck scales. Widespread soft rot, mechanical rupture, and mold colonies.',
    procurementCenter: 'APMC Mahuva (Gujarat)',
    rawBulbs: [
      { x: 12, y: 15, w: 14, h: 18, condition: 'Rotten', defectType: 'rot', diameterMm: 52.0, confidence: 0.97 },
      { x: 30, y: 16, w: 14, h: 18, condition: 'Damaged', defectType: 'cut_damage', diameterMm: 54.3, confidence: 0.93 },
      { x: 49, y: 14, w: 14, h: 18, condition: 'Rotten', defectType: 'rot', diameterMm: 50.8, confidence: 0.96 },
      { x: 68, y: 16, w: 14, h: 18, condition: 'Sprouted', defectType: 'sprout', diameterMm: 53.5, confidence: 0.98 },
      { x: 84, y: 18, w: 12, h: 16, condition: 'Rotten', defectType: 'rot', diameterMm: 48.0, confidence: 0.95 },
      { x: 14, y: 41, w: 14, h: 18, condition: 'Damaged', defectType: 'cut_damage', diameterMm: 51.5, confidence: 0.94 },
      { x: 32, y: 42, w: 14, h: 18, condition: 'Rotten', defectType: 'rot', diameterMm: 49.7, confidence: 0.97 },
      { x: 51, y: 40, w: 14, h: 18, condition: 'Sprouted', defectType: 'sprout', diameterMm: 52.9, confidence: 0.99 },
      { x: 70, y: 43, w: 15, h: 19, condition: 'Healthy', defectType: null, diameterMm: 58.0, confidence: 0.96 },
      { x: 86, y: 44, w: 11, h: 15, condition: 'Healthy', defectType: null, diameterMm: 42.5, confidence: 0.90 }, // URS
      { x: 16, y: 67, w: 14, h: 18, condition: 'Rotten', defectType: 'rot', diameterMm: 50.2, confidence: 0.96 },
      { x: 35, y: 69, w: 14, h: 18, condition: 'Damaged', defectType: 'cut_damage', diameterMm: 48.9, confidence: 0.92 },
      { x: 54, y: 68, w: 15, h: 19, condition: 'Healthy', defectType: null, diameterMm: 56.4, confidence: 0.95 },
      { x: 73, y: 70, w: 12, h: 16, condition: 'Healthy', defectType: null, diameterMm: 43.0, confidence: 0.91 }  // URS
    ]
  },

  // 9. Mixed-size batch
  {
    id: 'ONIO-2026-DEMO-09',
    name: 'Heterogeneous Multi-Caliber Lot',
    scenario: 'Wide Sizing Variance (28mm to 72mm)',
    description: 'Unsorted field-run harvest testing diameter calibration. Spans from tiny button onions to jumbo bulbs.',
    procurementCenter: 'APMC Solapur (Maharashtra)',
    rawBulbs: [
      { x: 10, y: 15, w: 9, h: 13, condition: 'Undersized', defectType: 'undersized', diameterMm: 29.8, confidence: 0.94 },
      { x: 23, y: 14, w: 11, h: 15, condition: 'Healthy', defectType: null, diameterMm: 37.5, confidence: 0.92 }, // URS
      { x: 38, y: 16, w: 13, h: 17, condition: 'Healthy', defectType: null, diameterMm: 46.2, confidence: 0.95 }, // Grade A
      { x: 55, y: 13, w: 16, h: 21, condition: 'Healthy', defectType: null, diameterMm: 68.4, confidence: 0.99 }, // Grade A
      { x: 75, y: 15, w: 17, h: 22, condition: 'Healthy', defectType: null, diameterMm: 72.1, confidence: 0.99 }, // Grade A
      { x: 12, y: 41, w: 10, h: 14, condition: 'Undersized', defectType: 'undersized', diameterMm: 32.4, confidence: 0.95 },
      { x: 26, y: 40, w: 12, h: 16, condition: 'Healthy', defectType: null, diameterMm: 41.0, confidence: 0.93 }, // URS
      { x: 42, y: 39, w: 14, h: 18, condition: 'Healthy', defectType: null, diameterMm: 53.6, confidence: 0.96 }, // Grade A
      { x: 60, y: 42, w: 12, h: 16, condition: 'Healthy', defectType: null, diameterMm: 43.5, confidence: 0.92 }, // URS
      { x: 77, y: 41, w: 15, h: 19, condition: 'Healthy', defectType: null, diameterMm: 59.8, confidence: 0.97 }, // Grade A
      { x: 15, y: 68, w: 10, h: 14, condition: 'Undersized', defectType: 'undersized', diameterMm: 33.9, confidence: 0.94 },
      { x: 29, y: 67, w: 12, h: 16, condition: 'Healthy', defectType: null, diameterMm: 39.8, confidence: 0.93 }, // URS
      { x: 45, y: 69, w: 14, h: 18, condition: 'Healthy', defectType: null, diameterMm: 55.0, confidence: 0.96 }, // Grade A
      { x: 64, y: 68, w: 15, h: 19, condition: 'Healthy', defectType: null, diameterMm: 61.2, confidence: 0.98 }  // Grade A
    ]
  },

  // 10. Challenging/complex batch
  {
    id: 'ONIO-2026-DEMO-10',
    name: 'Clustered Tray with Overlaps & Shadows',
    scenario: 'Challenging Computer Vision Clustered Lot',
    description: 'Stress-test scenario with adjacent overlapping bulbs, cast directional shadows, and partial occlusion.',
    procurementCenter: 'APMC Dindori, Nashik (Maharashtra)',
    rawBulbs: [
      { x: 10, y: 16, w: 14, h: 18, condition: 'Healthy', defectType: null, diameterMm: 54.8, confidence: 0.91 },
      { x: 22, y: 15, w: 14, h: 18, condition: 'Healthy', defectType: null, diameterMm: 52.3, confidence: 0.88 },
      { x: 35, y: 17, w: 15, h: 19, condition: 'Damaged', defectType: 'cut_damage', diameterMm: 56.0, confidence: 0.89 },
      { x: 52, y: 15, w: 14, h: 18, condition: 'Healthy', defectType: null, diameterMm: 53.7, confidence: 0.92 },
      { x: 69, y: 16, w: 14, h: 18, condition: 'Rotten', defectType: 'rot', diameterMm: 51.4, confidence: 0.90 },
      { x: 83, y: 18, w: 12, h: 16, condition: 'Healthy', defectType: null, diameterMm: 43.2, confidence: 0.87 }, // URS
      { x: 12, y: 40, w: 14, h: 18, condition: 'Sprouted', defectType: 'sprout', diameterMm: 50.9, confidence: 0.93 },
      { x: 25, y: 42, w: 15, h: 19, condition: 'Healthy', defectType: null, diameterMm: 58.7, confidence: 0.94 },
      { x: 42, y: 39, w: 14, h: 18, condition: 'Healthy', defectType: null, diameterMm: 55.3, confidence: 0.93 },
      { x: 58, y: 41, w: 14, h: 18, condition: 'Damaged', defectType: 'cut_damage', diameterMm: 48.6, confidence: 0.89 },
      { x: 74, y: 40, w: 15, h: 19, condition: 'Healthy', defectType: null, diameterMm: 57.1, confidence: 0.95 },
      { x: 14, y: 66, w: 14, h: 18, condition: 'Healthy', defectType: null, diameterMm: 52.8, confidence: 0.92 },
      { x: 30, y: 68, w: 14, h: 18, condition: 'Rotten', defectType: 'rot', diameterMm: 49.3, confidence: 0.91 },
      { x: 47, y: 67, w: 15, h: 19, condition: 'Healthy', defectType: null, diameterMm: 59.4, confidence: 0.95 },
      { x: 65, y: 69, w: 12, h: 16, condition: 'Healthy', defectType: null, diameterMm: 41.9, confidence: 0.88 }, // URS
      { x: 80, y: 68, w: 14, h: 18, condition: 'Healthy', defectType: null, diameterMm: 53.0, confidence: 0.91 }
    ]
  }
];

/**
 * Builds the fully evaluated BatchRecord for each demo definition,
 * with deterministic grading and verification hashes calculated dynamically.
 */
export function getDemoBatches(): BatchRecord[] {
  return DEMO_DEFINITIONS.map((def, batchIdx) => {
    const onions: OnionRecord[] = def.rawBulbs.map((bulb, idx) => {
      const evaluation = evaluateOnionGrade(bulb.condition, bulb.diameterMm, DEFAULT_PROTOTYPE_RULES);
      return {
        id: idx + 1,
        box: {
          id: idx + 1,
          x: bulb.x,
          y: bulb.y,
          w: bulb.w,
          h: bulb.h
        },
        condition: bulb.condition,
        defectType: bulb.defectType,
        diameterMm: bulb.diameterMm,
        confidence: bulb.confidence,
        grade: evaluation.grade,
        isManuallyCorrected: false,
        gradingExplanation: evaluation.explanation,
        summaryReason: evaluation.summaryReason
      };
    });

    const summary = calculateBatchSummary(onions);
    const createdAt = new Date(Date.now() - (10 - batchIdx) * 3600000 * 4).toISOString();
    const verificationHash = generateVerificationHash(def.id, createdAt, onions);

    const imageUrl = createTraySvg(
      def.rawBulbs.map((b, i) => ({
        id: i + 1,
        x: b.x,
        y: b.y,
        w: b.w,
        h: b.h,
        condition: b.condition,
        diameterMm: b.diameterMm
      })),
      def.id
    );

    return {
      id: def.id,
      name: def.name,
      scenario: def.scenario,
      description: def.description,
      createdAt,
      operator: 'Inspector R. Sharma (DoCA ID: QC-702)',
      procurementCenter: def.procurementCenter,
      sourceType: 'demo',
      imageUrl,
      imageDimensions: { width: 800, height: 600 },
      onions,
      summary,
      gradingRules: DEFAULT_PROTOTYPE_RULES,
      auditTrail: [
        {
          id: `INIT-${def.id}`,
          timestamp: createdAt,
          operator: 'System (Demo Inference Engine)',
          action: 'BATCH_INITIALIZED',
          details: `Batch calibrated and ingested with ${onions.length} detected bulbs.`
        }
      ],
      verificationHash
    };
  });
}
