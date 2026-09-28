import React from 'react';
import { ViewTab } from '../types';
import { 
  Scan, 
  Layers, 
  BarChart3, 
  FileText, 
  GitCompare, 
  HelpCircle, 
  Sparkles,
  LayoutDashboard,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  activeBatchId?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, activeBatchId }) => {
  return (
    <header className="top-navbar">
      <div className="navbar-inner">
        {/* Brand identity */}
        <div className="brand-section" onClick={() => onSelectTab('dashboard')}>
          <div className="brand-logo-badge">
            <Scan size={20} strokeWidth={2.2} />
          </div>
          <div className="brand-text">
            <h1>
              ONIOGRADE
              <span className="doca-pill">DoCA PS-26031</span>
              <span className="prototype-tag">Prototype</span>
            </h1>
            <p className="brand-tagline">AI-Powered Onion Quality Assessment & Sizing</p>
          </div>
        </div>

        {/* Navigation View Switcher */}
        <nav className="nav-tabs" aria-label="Main Navigation">
          <button
            className={`nav-tab-btn ${currentTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => onSelectTab('dashboard')}
            title="Dashboard Overview"
          >
            <LayoutDashboard size={15} />
            <span>Dashboard</span>
          </button>

          <button
            className={`nav-tab-btn ${currentTab === 'assessment' ? 'active' : ''}`}
            onClick={() => onSelectTab('assessment')}
            title="Upload or Capture Onion Image"
          >
            <Scan size={15} />
            <span>New Assessment</span>
          </button>

          <button
            className={`nav-tab-btn ${currentTab === 'demo-gallery' ? 'active' : ''}`}
            onClick={() => onSelectTab('demo-gallery')}
            title="Pre-calibrated Agricultural Demo Batches"
          >
            <Sparkles size={15} style={{ color: '#38bdf8' }} />
            <span>Demo Gallery</span>
          </button>

          {activeBatchId && (
            <>
              <button
                className={`nav-tab-btn ${currentTab === 'analysis' ? 'active' : ''}`}
                onClick={() => onSelectTab('analysis')}
                title="Detection Overlays & Inspection"
              >
                <Layers size={15} />
                <span>Detection & Grading</span>
              </button>

              <button
                className={`nav-tab-btn ${currentTab === 'summary' ? 'active' : ''}`}
                onClick={() => onSelectTab('summary')}
                title="Batch Quality Summary"
              >
                <BarChart3 size={15} />
                <span>Batch Summary</span>
              </button>

              <button
                className={`nav-tab-btn ${currentTab === 'evidence' ? 'active' : ''}`}
                onClick={() => onSelectTab('evidence')}
                title="Procurement Quality Evidence Pack"
              >
                <ShieldCheck size={15} />
                <span>Evidence Pack</span>
              </button>

              <button
                className={`nav-tab-btn ${currentTab === 'report' ? 'active' : ''}`}
                onClick={() => onSelectTab('report')}
                title="Official Digital Quality Report"
              >
                <FileText size={15} />
                <span>Quality Report</span>
              </button>
            </>
          )}

          <button
            className={`nav-tab-btn ${currentTab === 'compare' ? 'active' : ''}`}
            onClick={() => onSelectTab('compare')}
            title="Compare Two Batches Side-by-Side"
          >
            <GitCompare size={15} />
            <span>Compare</span>
          </button>

          <button
            className={`nav-tab-btn ${currentTab === 'methodology' ? 'active' : ''}`}
            onClick={() => onSelectTab('methodology')}
            title="Methodology, Standards & YOLO Roadmap"
          >
            <HelpCircle size={15} />
            <span>Methodology</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
