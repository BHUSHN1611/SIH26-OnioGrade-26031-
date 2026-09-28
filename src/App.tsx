import React, { useState } from 'react';
import { ViewTab, BatchRecord, GradingRulesConfig } from './types';
import { getDemoBatches } from './data/demoBatches';
import { DEFAULT_PROTOTYPE_RULES, calculateBatchSummary, evaluateOnionGrade } from './engine/gradingEngine';
import { inferenceEngine, AnalysisProgress } from './engine/inferenceEngine';

import { Navbar } from './components/Navbar';
import { DashboardView } from './views/DashboardView';
import { AssessmentView } from './views/AssessmentView';
import { DemoGalleryView } from './views/DemoGalleryView';
import { AnalysisView } from './views/AnalysisView';
import { BatchSummaryView } from './views/BatchSummaryView';
import { EvidencePackView } from './views/EvidencePackView';
import { ReportView } from './views/ReportView';
import { ComparisonView } from './views/ComparisonView';
import { MethodologyView } from './views/MethodologyView';

export const App: React.FC = () => {
  // Initialize with 10 pre-calibrated demo batches
  const [batches, setBatches] = useState<BatchRecord[]>(() => getDemoBatches());
  const [activeBatchId, setActiveBatchId] = useState<string>('ONIO-2026-DEMO-06'); // Mixed Mandi lot default
  const [currentTab, setCurrentTab] = useState<ViewTab>('dashboard');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<AnalysisProgress | null>(null);
  const [gradingRules, setGradingRules] = useState<GradingRulesConfig>(DEFAULT_PROTOTYPE_RULES);

  const activeBatch = batches.find(b => b.id === activeBatchId) || batches[0];

  // Navigate to batch analysis
  const handleSelectBatch = (batch: BatchRecord) => {
    setActiveBatchId(batch.id);
    setCurrentTab('analysis');
  };

  // Run Demo Batch Inference
  const handleAnalyzeDemo = async (batchId: string) => {
    setIsAnalyzing(true);
    setCurrentTab('assessment');
    try {
      const result = await inferenceEngine.analyzeDemoBatch(batchId, p => setAnalysisProgress(p));
      // Update batch in store
      setBatches(prev => prev.map(b => b.id === result.id ? result : b));
      setActiveBatchId(result.id);
      setIsAnalyzing(false);
      setAnalysisProgress(null);
      setCurrentTab('analysis');
    } catch (err) {
      console.error('Demo analysis error:', err);
      setIsAnalyzing(false);
      setAnalysisProgress(null);
    }
  };

  // Run Custom Image Inference
  const handleAnalyzeCustom = async (
    dataUrl: string, 
    fileName: string, 
    operator: string, 
    centerLocation: string
  ) => {
    setIsAnalyzing(true);
    try {
      const result = await inferenceEngine.analyzeCustomImage(
        dataUrl, 
        fileName, 
        operator, 
        centerLocation, 
        p => setAnalysisProgress(p)
      );
      setBatches(prev => [result, ...prev]);
      setActiveBatchId(result.id);
      setIsAnalyzing(false);
      setAnalysisProgress(null);
      setCurrentTab('analysis');
    } catch (err) {
      console.error('Custom image analysis error:', err);
      setIsAnalyzing(false);
      setAnalysisProgress(null);
    }
  };

  // Update batch (e.g. after manual correction)
  const handleUpdateBatch = (updatedBatch: BatchRecord) => {
    setBatches(prev => prev.map(b => b.id === updatedBatch.id ? updatedBatch : b));
  };

  // Update global grading rules and recalculate batches
  const handleUpdateRules = (newRules: GradingRulesConfig) => {
    setGradingRules(newRules);
    setBatches(prev => prev.map(batch => {
      const updatedOnions = batch.onions.map(onion => {
        const evalResult = evaluateOnionGrade(onion.condition, onion.diameterMm, newRules);
        return {
          ...onion,
          grade: evalResult.grade,
          gradingExplanation: evalResult.explanation,
          summaryReason: evalResult.summaryReason
        };
      });
      return {
        ...batch,
        gradingRules: newRules,
        onions: updatedOnions,
        summary: calculateBatchSummary(updatedOnions)
      };
    }));
  };

  return (
    <div className="app-container">
      {/* Top Sticky Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        activeBatchId={activeBatch?.id}
      />

      {/* Main View Container */}
      <main className="main-content">
        {currentTab === 'dashboard' && (
          <DashboardView
            onSelectTab={setCurrentTab}
            recentBatches={batches}
            onSelectBatch={handleSelectBatch}
          />
        )}

        {currentTab === 'assessment' && (
          <AssessmentView
            onAnalyzeCustom={handleAnalyzeCustom}
            onSelectDemoGallery={() => setCurrentTab('demo-gallery')}
            isAnalyzing={isAnalyzing}
            progress={analysisProgress}
          />
        )}

        {currentTab === 'demo-gallery' && (
          <DemoGalleryView
            demoBatches={batches.filter(b => b.sourceType === 'demo')}
            onAnalyzeDemo={handleAnalyzeDemo}
            isLoading={isAnalyzing}
          />
        )}

        {currentTab === 'analysis' && activeBatch && (
          <AnalysisView
            batch={activeBatch}
            onUpdateBatch={handleUpdateBatch}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'summary' && activeBatch && (
          <BatchSummaryView
            batch={activeBatch}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'evidence' && activeBatch && (
          <EvidencePackView
            batch={activeBatch}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'report' && activeBatch && (
          <ReportView
            batch={activeBatch}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'compare' && (
          <ComparisonView
            batches={batches}
            activeBatchId={activeBatchId}
          />
        )}

        {currentTab === 'methodology' && (
          <MethodologyView
            currentRules={gradingRules}
            onUpdateRules={handleUpdateRules}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print" style={{
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '1.5rem 1.25rem',
        marginTop: 'auto'
      }}>
        <div style={{
          maxWidth: '1360px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            <strong style={{ color: '#f1f5f9' }}>ONIOGRADE</strong> — AI-Powered Onion Quality Assessment &amp; Sizing Platform
            <div style={{ marginTop: '2px' }}>
              Ministry of Consumer Affairs, Food &amp; Public Distribution • Department of Consumer Affairs (DoCA)
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div>Smart India Hackathon 2026 • Problem ID 26031</div>
            <div style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
              Prototype Verification Engine • Modular Computer Vision Architecture
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
