import React, { useState, useRef } from 'react';
import { Upload, Camera, Sparkles, AlertCircle, FileCheck, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';
import { AnalysisProgress } from '../engine/inferenceEngine';

interface AssessmentViewProps {
  onAnalyzeCustom: (
    dataUrl: string, 
    fileName: string, 
    operator: string, 
    centerLocation: string
  ) => void;
  onSelectDemoGallery: () => void;
  isAnalyzing: boolean;
  progress: AnalysisProgress | null;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  onAnalyzeCustom,
  onSelectDemoGallery,
  isAnalyzing,
  progress
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileMeta, setFileMeta] = useState<{ name: string; size: string; width: number; height: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Field metadata
  const [operator, setOperator] = useState('Inspector R. Sharma (QC-702)');
  const [centerLocation, setCenterLocation] = useState('APMC Lasalgaon, Nashik (Maharashtra)');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Validate and read file
  const handleFileProcess = (file: File) => {
    setErrorMessage(null);

    // Validate type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Unsupported file format. Please upload a standard image file (JPEG, PNG, WebP).');
      return;
    }

    // Validate size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      setErrorMessage('File exceeds 20MB limit. Please provide a standard resolution photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setSelectedImage(dataUrl);
        setFileMeta({
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };
      img.src = dataUrl;
    };
    reader.onerror = () => {
      setErrorMessage('Error reading the selected image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  // Camera capture workflow
  const startCamera = async () => {
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err) {
      setErrorMessage('Camera access was not granted or is not available on this device.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setSelectedImage(dataUrl);
        setFileMeta({
          name: `Camera-Capture-${Date.now()}.jpg`,
          size: '1.2 MB',
          width: canvas.width,
          height: canvas.height
        });
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const triggerAnalyze = () => {
    if (!selectedImage || !fileMeta) {
      setErrorMessage('Please select or capture an image before initiating analysis.');
      return;
    }
    onAnalyzeCustom(selectedImage, fileMeta.name, operator, centerLocation);
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 700 }}>New Onion Quality Assessment</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Ingest sample tray imagery to execute automated computer vision defect classification, diameter sizing, and DoCA grading.
        </p>
      </div>

      {/* Error state alert if any */}
      {errorMessage && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          padding: '0.85rem 1rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--grade-defective-bg)',
          border: '1px solid var(--grade-defective-border)',
          color: '#f87171',
          fontSize: '0.85rem'
        }}>
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Analysis Running Progress State */}
      {isAnalyzing && progress && (
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '50%', backgroundColor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', marginBottom: '1rem' }}>
            <RefreshCw size={28} className="spin-animation" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.35rem' }}>
            Executing Computer Vision Pipeline
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            {progress.stageName}
          </p>

          {/* Progress bar */}
          <div style={{
            height: '8px',
            width: '100%',
            maxWidth: '450px',
            margin: '0 auto 0.75rem',
            backgroundColor: '#1e293b',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${progress.percentage}%`,
              backgroundColor: '#38bdf8',
              transition: 'width 0.25s ease'
            }} />
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#94a3b8' }}>
            Step {progress.stageIndex} of 5 • {progress.percentage}% completed
          </span>
          <style>{`
            @keyframes spin { 100% { transform: rotate(360deg); } }
          `}</style>
        </div>
      )}

      {/* Pre-flight Upload & Configuration Form */}
      {!isAnalyzing && (
        <div className="card">
          {/* Metadata Controls */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Procurement Mandi / Center</label>
              <input
                type="text"
                className="form-input"
                value={centerLocation}
                onChange={e => setCenterLocation(e.target.value)}
                placeholder="e.g. APMC Lasalgaon, Nashik"
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Inspector Name &amp; ID</label>
              <input
                type="text"
                className="form-input"
                value={operator}
                onChange={e => setOperator(e.target.value)}
                placeholder="e.g. Inspector R. Sharma (QC-702)"
              />
            </div>
          </div>

          {/* Camera Active View */}
          {isCameraActive && (
            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
              <video
                ref={videoRef}
                style={{ width: '100%', maxHeight: '360px', borderRadius: 'var(--radius-md)', backgroundColor: '#000' }}
              />
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '0.75rem' }}>
                <button type="button" className="btn btn-primary" onClick={capturePhoto}>
                  <Camera size={16} /> Capture Image
                </button>
                <button type="button" className="btn btn-outline" onClick={stopCamera}>
                  Cancel Camera
                </button>
              </div>
            </div>
          )}

          {/* Upload Dropzone */}
          {!selectedImage && !isCameraActive && (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragActive ? '#38bdf8' : 'var(--border-strong)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                backgroundColor: dragActive ? 'rgba(56, 189, 248, 0.05)' : 'var(--bg-surface)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />

              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                color: '#38bdf8',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Upload size={24} />
              </div>

              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Drag &amp; Drop Onion Image Here
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Or click to browse from local computer • Supports JPG, PNG, WebP (up to 20MB)
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <Upload size={15} />
                  Browse Files
                </button>

                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    startCamera();
                  }}
                >
                  <Camera size={15} />
                  Use Device Camera
                </button>
              </div>
            </div>
          )}

          {/* Selected Image Preview & Metadata */}
          {selectedImage && fileMeta && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileCheck size={18} color="#10b981" />
                  <span style={{ fontWeight: 600, color: '#f8fafc' }}>{fileMeta.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({fileMeta.size})</span>
                </div>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    setSelectedImage(null);
                    setFileMeta(null);
                  }}
                >
                  Change Image
                </button>
              </div>

              {/* Thumbnail Display */}
              <div style={{
                maxHeight: '340px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                backgroundColor: '#0a0f14',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-subtle)'
              }}>
                <img
                  src={selectedImage}
                  alt="Preview"
                  style={{ maxHeight: '340px', width: 'auto', maxWidth: '100%', objectFit: 'contain' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Resolution: {fileMeta.width} x {fileMeta.height} px • Ready for CV Pipeline
                </span>
                <button
                  className="btn btn-primary"
                  onClick={triggerAnalyze}
                  style={{ padding: '0.65rem 1.4rem' }}
                >
                  <Sparkles size={16} />
                  Analyze Image with OnioGrade AI
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Quick Demo Batch Shortcut */}
          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px dashed var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>
                Don't have an onion image right now?
              </span>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Test our 10 pre-calibrated agricultural demo cases representing real mandi lots.
              </p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={onSelectDemoGallery}>
              <Sparkles size={14} style={{ color: '#38bdf8' }} />
              Open Demo Gallery
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
