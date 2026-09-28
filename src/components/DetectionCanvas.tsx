import React, { useState } from 'react';
import { OnionRecord } from '../types';
import { Eye, EyeOff, ZoomIn, ZoomOut, RotateCcw, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface DetectionCanvasProps {
  imageUrl: string;
  onions: OnionRecord[];
  selectedOnionId: number | null;
  onSelectOnion: (id: number) => void;
}

export const DetectionCanvas: React.FC<DetectionCanvasProps> = ({
  imageUrl,
  onions,
  selectedOnionId,
  onSelectOnion
}) => {
  // Layer visibility toggles
  const [showBoxes, setShowBoxes] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showDefects, setShowDefects] = useState(true);
  const [showDiameters, setShowDiameters] = useState(true);

  // Zoom control
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(2.5, prev + 0.25));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(0.75, prev - 0.25));
  const handleResetZoom = () => setZoomLevel(1);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'Grade A': return '#10b981';
      case 'URS': return '#f59e0b';
      case 'Defective': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  const getDefectBadgeColor = (condition: string) => {
    switch (condition) {
      case 'Healthy': return '#10b981';
      case 'Sprouted': return '#84cc16';
      case 'Rotten': return '#ef4444';
      case 'Damaged': return '#f97316';
      case 'Undersized': return '#eab308';
      default: return '#94a3b8';
    }
  };

  return (
    <div className="card" style={{ padding: '0.85rem' }}>
      {/* Canvas Toolbars */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '0.75rem',
        paddingBottom: '0.65rem',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        {/* Layer Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: '0.25rem', fontWeight: 600 }}>
            LAYERS:
          </span>
          <button
            className={`btn btn-sm ${showBoxes ? 'btn-secondary' : 'btn-outline'}`}
            onClick={() => setShowBoxes(!showBoxes)}
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
          >
            {showBoxes ? <Eye size={12} /> : <EyeOff size={12} />}
            Boxes
          </button>
          <button
            className={`btn btn-sm ${showLabels ? 'btn-secondary' : 'btn-outline'}`}
            onClick={() => setShowLabels(!showLabels)}
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
          >
            {showLabels ? <Eye size={12} /> : <EyeOff size={12} />}
            IDs
          </button>
          <button
            className={`btn btn-sm ${showDefects ? 'btn-secondary' : 'btn-outline'}`}
            onClick={() => setShowDefects(!showDefects)}
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
          >
            {showDefects ? <Eye size={12} /> : <EyeOff size={12} />}
            Condition
          </button>
          <button
            className={`btn btn-sm ${showDiameters ? 'btn-secondary' : 'btn-outline'}`}
            onClick={() => setShowDiameters(!showDiameters)}
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
          >
            {showDiameters ? <Eye size={12} /> : <EyeOff size={12} />}
            Diameter (mm)
          </button>
        </div>

        {/* Zoom & View Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            className="btn btn-outline btn-sm"
            onClick={handleZoomOut}
            title="Zoom Out"
            style={{ padding: '0.25rem 0.45rem' }}
          >
            <ZoomOut size={13} />
          </button>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', minWidth: '42px', textAlign: 'center', color: 'var(--text-muted)' }}>
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            className="btn btn-outline btn-sm"
            onClick={handleZoomIn}
            title="Zoom In"
            style={{ padding: '0.25rem 0.45rem' }}
          >
            <ZoomIn size={13} />
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={handleResetZoom}
            title="Reset Zoom"
            style={{ padding: '0.25rem 0.45rem' }}
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxHeight: '560px',
        overflow: 'auto',
        borderRadius: 'var(--radius-md)',
        backgroundColor: '#0a0f14',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '800px',
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'top center',
          transition: 'transform 0.15s ease-out'
        }}>
          {/* Base Onion Image */}
          <img
            src={imageUrl}
            alt="Onion Quality Assessment Tray"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              userSelect: 'none',
              borderRadius: 'var(--radius-sm)'
            }}
          />

          {/* Interactive Bounding Box & Annotation Overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
          }}>
            {onions.map(onion => {
              const isSelected = selectedOnionId === onion.id;
              const gradeColor = getGradeColor(onion.grade);
              const defectColor = getDefectBadgeColor(onion.condition);

              return (
                <div
                  key={onion.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectOnion(onion.id);
                  }}
                  style={{
                    position: 'absolute',
                    left: `${onion.box.x}%`,
                    top: `${onion.box.y}%`,
                    width: `${onion.box.w}%`,
                    height: `${onion.box.h}%`,
                    border: showBoxes 
                      ? `${isSelected ? '3px' : '2px'} solid ${gradeColor}` 
                      : 'none',
                    borderRadius: '6px',
                    boxShadow: isSelected 
                      ? `0 0 0 3px rgba(56, 189, 248, 0.4), 0 0 14px ${gradeColor}` 
                      : 'none',
                    backgroundColor: isSelected 
                      ? 'rgba(56, 189, 248, 0.15)' 
                      : 'rgba(0, 0, 0, 0.05)',
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {/* Top Header Tag: ID and Grade Badge */}
                  {showLabels && (
                    <div style={{
                      position: 'absolute',
                      top: '-22px',
                      left: '0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: 'rgba(15, 23, 42, 0.92)',
                      padding: '2px 5px',
                      borderRadius: '3px',
                      border: `1px solid ${gradeColor}`,
                      whiteSpace: 'nowrap',
                      zIndex: isSelected ? 15 : 5
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: '#f8fafc'
                      }}>
                        #{onion.id.toString().padStart(2, '0')}
                      </span>
                      <span style={{
                        fontSize: '0.62rem',
                        fontWeight: 600,
                        color: gradeColor,
                        fontFamily: 'var(--font-mono)'
                      }}>
                        {onion.grade === 'Grade A' ? 'GRADE-A' : onion.grade}
                      </span>
                      {onion.isManuallyCorrected && (
                        <span style={{
                          backgroundColor: '#9333ea',
                          color: '#fff',
                          fontSize: '0.55rem',
                          padding: '1px 3px',
                          borderRadius: '2px',
                          fontWeight: 700
                        }}>
                          MOD
                        </span>
                      )}
                    </div>
                  )}

                  {/* Bottom Sub-tag: Defect condition & Diameter */}
                  {(showDefects || showDiameters) && (
                    <div style={{
                      position: 'absolute',
                      bottom: '-20px',
                      left: '0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: 'rgba(15, 23, 42, 0.92)',
                      padding: '1px 5px',
                      borderRadius: '3px',
                      border: '1px solid var(--border-strong)',
                      whiteSpace: 'nowrap',
                      zIndex: isSelected ? 15 : 4
                    }}>
                      {showDefects && (
                        <span style={{
                          fontSize: '0.62rem',
                          fontWeight: 600,
                          color: defectColor
                        }}>
                          {onion.condition}
                        </span>
                      )}
                      {showDefects && showDiameters && (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}>•</span>
                      )}
                      {showDiameters && (
                        <span style={{
                          fontSize: '0.62rem',
                          fontFamily: 'var(--font-mono)',
                          color: '#94a3b8'
                        }}>
                          {onion.diameterMm.toFixed(0)}mm
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend & Hint */}
      <div style={{
        marginTop: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
        fontSize: '0.78rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#10b981' }} />
            Grade A (≥45mm, Healthy)
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#f59e0b' }} />
            URS (35–44mm, Sound)
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#ef4444' }} />
            Defective (&lt;35mm / Rot / Sprout / Cut)
          </span>
        </div>
        <span style={{ fontStyle: 'italic', color: '#38bdf8' }}>
          Tip: Click any bounding box to inspect reasoning or make human corrections.
        </span>
      </div>
    </div>
  );
};
