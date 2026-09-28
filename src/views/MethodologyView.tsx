import React, { useState } from 'react';
import { 
  HelpCircle, 
  Layers, 
  Scale, 
  Cpu, 
  Code2, 
  ShieldCheck, 
  CheckCircle2, 
  Sliders, 
  RotateCcw,
  Sparkles 
} from 'lucide-react';
import { GradingRulesConfig } from '../types';
import { DEFAULT_PROTOTYPE_RULES } from '../engine/gradingEngine';

interface MethodologyViewProps {
  currentRules: GradingRulesConfig;
  onUpdateRules: (newRules: GradingRulesConfig) => void;
}

export const MethodologyView: React.FC<MethodologyViewProps> = ({
  currentRules,
  onUpdateRules
}) => {
  const [minGradeA, setMinGradeA] = useState(currentRules.minGradeADiameterMm);
  const [minUrs, setMinUrs] = useState(currentRules.minUrsDiameterMm);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveThresholds = () => {
    onUpdateRules({
      ...currentRules,
      minGradeADiameterMm: minGradeA,
      minUrsDiameterMm: minUrs
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDefaults = () => {
    setMinGradeA(DEFAULT_PROTOTYPE_RULES.minGradeADiameterMm);
    setMinUrs(DEFAULT_PROTOTYPE_RULES.minUrsDiameterMm);
    onUpdateRules(DEFAULT_PROTOTYPE_RULES);
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{
        padding: '1.5rem',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <HelpCircle size={20} color="#38bdf8" />
          <h2 style={{ fontSize: '1.45rem', fontWeight: 700 }}>Methodology, Architecture &amp; Calibration</h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Transparent disclosure of the OnioGrade computer vision processing pipeline, prototype grading engine, reference calibration, and the technical roadmap for production YOLOv8 deployment.
        </p>
      </div>

      {/* Interactive Threshold Configuration Card */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={18} color="#10b981" />
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Configurable Prototype Grading Rules</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Fine-tune dimensional grading thresholds. All active and future batches adapt instantly.
              </p>
            </div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={handleResetDefaults}>
            <RotateCcw size={12} /> Reset to Defaults
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Grade A Minimum Diameter</label>
              <strong style={{ fontFamily: 'var(--font-mono)', color: '#10b981' }}>{minGradeA} mm</strong>
            </div>
            <input
              type="range"
              min="40"
              max="60"
              step="1"
              value={minGradeA}
              onChange={e => setMinGradeA(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#10b981' }}
            />
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Bulbs ≥ {minGradeA} mm with sound tissue qualify for Grade A Fair Average Quality (FAQ).
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <label className="form-label" style={{ margin: 0 }}>URS Minimum Diameter Floor</label>
              <strong style={{ fontFamily: 'var(--font-mono)', color: '#f59e0b' }}>{minUrs} mm</strong>
            </div>
            <input
              type="range"
              min="28"
              max="42"
              step="1"
              value={minUrs}
              onChange={e => setMinUrs(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#f59e0b' }}
            />
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Bulbs between {minUrs} mm and {minGradeA - 1} mm are designated URS (Under-sized / Re-sorted). Bulbs &lt; {minUrs} mm are Defective.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          {savedSuccess && (
            <span style={{ color: '#10b981', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={14} /> Thresholds updated and applied across all batches!
            </span>
          )}
          <div style={{ marginLeft: 'auto' }}>
            <button className="btn btn-primary btn-sm" onClick={handleSaveThresholds}>
              Apply Updated Rules
            </button>
          </div>
        </div>
      </div>

      {/* Sequential Pipeline Flow Diagram */}
      <div className="card">
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          The End-to-End OnioGrade Computer Vision Pipeline
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Structured 7-stage computer vision workflow that eliminates subjective discrepancies at procurement centers.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            {
              step: 'Stage 1: Sensor Ingestion & Normalization',
              desc: 'High-resolution tray imagery capture with contrast equalization and color-space correction to account for mandi lighting variability.'
            },
            {
              step: 'Stage 2: Instance Segmentation & Contour Extraction',
              desc: 'Individual bulb localization detecting boundary coordinates and isolating single onions even in clustered or partially occluded tray layouts.'
            },
            {
              step: 'Stage 3: Multi-Defect Feature Classification',
              desc: 'Surface condition classification analyzing dark necrotic lesions (Aspergillus mold), emergent apical green shoots (sprouting), and mechanical cuts/bruises.'
            },
            {
              step: 'Stage 4: Reference Scale Diameter Calibration',
              desc: 'Converting segmented pixel radii to true physical millimeters using a 100mm reference tray calibration marker or optical focal distance ratio.'
            },
            {
              step: 'Stage 5: Pure Functional Grading Rules Engine',
              desc: 'Deterministic evaluation of individual bulbs against DoCA thresholds: Grade A (≥45mm, Healthy), URS (35–44mm, Sound), Defective (<35mm, Rot, Sprout, Damage).'
            },
            {
              step: 'Stage 6: Human-in-the-Loop Verification & Override',
              desc: 'Procurement inspectors can visually audit and correct any optical misclassification with mandatory recorded reasoning and instantaneous recalculation.'
            },
            {
              step: 'Stage 7: Tamper-Evident Quality Passport & Report',
              desc: 'Generation of a cryptographic SHA-256 verification hash, itemized LEDGER, and print-ready digital quality certificate.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#38bdf8',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                padding: '2px 8px',
                borderRadius: '4px'
              }}>
                0{idx + 1}
              </div>
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f1f5f9', marginBottom: '2px' }}>
                  {item.step}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Production YOLOv8 Model Migration Guide */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Code2 size={18} color="#a855f7" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>
            Production YOLOv8 Migration Guide (Swappable Inference Interface)
          </h3>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
          In accordance with strict hackathon honesty requirements, this web prototype currently utilizes a modular demo and canvas-heuristic inference engine. 
          The codebase defines a strict, decoupled TypeScript contract (<code>IInferenceEngine</code>) enabling seamless drop-in replacement with a production YOLOv8 / ONNX model without any UI modifications.
        </p>

        <div style={{
          backgroundColor: '#0a0f14',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem',
          color: '#cbd5e1',
          overflowX: 'auto',
          lineHeight: 1.6
        }}>
          <div><span style={{ color: '#64748b' }}>// Step 1: Implement IInferenceEngine interface</span></div>
          <div><span style={{ color: '#f43f5e' }}>export class</span> <span style={{ color: '#38bdf8' }}>YOLOv8InferenceEngine</span> <span style={{ color: '#f43f5e' }}>implements</span> <span style={{ color: '#38bdf8' }}>IInferenceEngine</span> &#123;</div>
          <div style={{ paddingLeft: '1.25rem' }}><span style={{ color: '#f43f5e' }}>private</span> session: <span style={{ color: '#38bdf8' }}>ort.InferenceSession</span>;</div>
          <div style={{ paddingLeft: '1.25rem' }}><span style={{ color: '#f43f5e' }}>async</span> <span style={{ color: '#10b981' }}>analyzeCustomImage</span>(imageDataUrl: <span style={{ color: '#38bdf8' }}>string</span>): <span style={{ color: '#38bdf8' }}>Promise&lt;BatchRecord&gt;</span> &#123;</div>
          <div style={{ paddingLeft: '2.5rem' }}><span style={{ color: '#64748b' }}>// Run YOLOv8 ONNX model with WebGL / WASM acceleration</span></div>
          <div style={{ paddingLeft: '2.5rem' }}><span style={{ color: '#f43f5e' }}>const</span> tensor = <span style={{ color: '#f43f5e' }}>await</span> <span style={{ color: '#38bdf8' }}>preprocessImage</span>(imageDataUrl);</div>
          <div style={{ paddingLeft: '2.5rem' }}><span style={{ color: '#f43f5e' }}>const</span> outputs = <span style={{ color: '#f43f5e' }}>await</span> <span style={{ color: '#f43f5e' }}>this</span>.session.run(&#123; images: tensor &#125;);</div>
          <div style={{ paddingLeft: '2.5rem' }}><span style={{ color: '#f43f5e' }}>const</span> boxes = <span style={{ color: '#38bdf8' }}>nonMaxSuppression</span>(outputs);</div>
          <div style={{ paddingLeft: '2.5rem' }}><span style={{ color: '#f43f5e' }}>return</span> <span style={{ color: '#38bdf8' }}>mapDetectionsToBatch</span>(boxes);</div>
          <div style={{ paddingLeft: '1.25rem' }}>&#125;</div>
          <div>&#125;</div>
        </div>
      </div>
    </div>
  );
};
