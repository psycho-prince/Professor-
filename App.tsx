import React, { useState } from 'react';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { analyzeResearch, generateRevisionChecklist } from './services/geminiService';
import { AnalysisRequest, AnalysisResponse } from './types';

export default function App() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [revisionNotes, setRevisionNotes] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);

  const handleRequestAnalysis = async (request: AnalysisRequest) => {
    setIsLoading(true);
    setAnalysisResult(null);
    setRevisionNotes(null); // Reset notes on new analysis
    
    try {
      const result = await analyzeResearch(request);
      setAnalysisResult(result);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please ensure your API Key is valid.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateNotes = async () => {
    if (!analysisResult) return;
    setIsGeneratingNotes(true);
    try {
      const notes = await generateRevisionChecklist(analysisResult.markdown);
      setRevisionNotes(notes);
    } catch (error) {
      console.error(error);
      alert("Failed to generate notes.");
    } finally {
      setIsGeneratingNotes(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 h-14 bg-slate-900 text-white flex items-center px-6 shadow-md z-10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📘</span>
          <h1 className="text-lg font-serif font-bold tracking-wide">Proof-First Research Professor</h1>
        </div>
        <div className="ml-auto text-xs text-slate-400 font-mono hidden md:block">
          v1.0.0 | System Mode: Strict Supervisor
        </div>
      </header>

      {/* Main Content Area - Split View */}
      <main className="flex-grow flex flex-col md:flex-row overflow-hidden">
        {/* Left Panel - 40% width on Desktop */}
        <div className="w-full md:w-2/5 h-1/2 md:h-full border-b md:border-b-0 md:border-r border-gray-200 z-0">
          <InputPanel 
            isLoading={isLoading} 
            onRequestAnalysis={handleRequestAnalysis} 
          />
        </div>

        {/* Right Panel - 60% width on Desktop */}
        <div className="w-full md:w-3/5 h-1/2 md:h-full bg-gray-50 relative">
          <OutputPanel 
            response={analysisResult} 
            isLoading={isLoading}
            revisionNotes={revisionNotes}
            isGeneratingNotes={isGeneratingNotes}
            onGenerateNotes={handleGenerateNotes}
          />
        </div>
      </main>
    </div>
  );
}
