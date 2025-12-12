import React, { useState } from 'react';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { HistorySidebar } from './components/HistorySidebar';
import { analyzeResearch, generateRevisionChecklist } from './services/geminiService';
import { AnalysisRequest, AnalysisResponse, HistoryItem } from './types';

export default function App() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [revisionNotes, setRevisionNotes] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  
  // History State
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<AnalysisRequest | null>(null);

  const handleRequestAnalysis = async (request: AnalysisRequest) => {
    setIsLoading(true);
    setAnalysisResult(null);
    setRevisionNotes(null);
    setCurrentHistoryId(null);
    
    try {
      const result = await analyzeResearch(request);
      setAnalysisResult(result);
      
      // Add to history
      const newHistoryItem: HistoryItem = {
        id: crypto.randomUUID(),
        request: request,
        response: result,
        revisionNotes: null,
        timestamp: Date.now()
      };
      
      setHistory(prev => [newHistoryItem, ...prev]);
      setCurrentHistoryId(newHistoryItem.id);
      
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
      
      // Update current history item if it exists
      if (currentHistoryId) {
        setHistory(prev => prev.map(item => 
          item.id === currentHistoryId 
            ? { ...item, revisionNotes: notes }
            : item
        ));
      }
    } catch (error) {
      console.error(error);
      alert("Failed to generate notes.");
    } finally {
      setIsGeneratingNotes(false);
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setAnalysisResult(item.response);
    setRevisionNotes(item.revisionNotes);
    setSelectedRequest(item.request); // Restores inputs
    setCurrentHistoryId(item.id);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden relative">
      {/* Header */}
      <header className="flex-shrink-0 h-14 bg-slate-900 text-white flex items-center px-6 shadow-md z-10 relative">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📘</span>
          <h1 className="text-lg font-serif font-bold tracking-wide">Proof-First Research Professor</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="text-xs text-slate-400 font-mono hidden md:block">
            v1.1.0 | Supervisor Mode
          </div>
          <button 
            onClick={() => setIsHistoryOpen(true)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border border-slate-700"
          >
            <span>📜</span> History <span className="bg-slate-900 px-1.5 rounded-full text-[10px]">{history.length}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area - Split View */}
      <main className="flex-grow flex flex-col md:flex-row overflow-hidden relative">
        {/* Left Panel - 40% width on Desktop */}
        <div className="w-full md:w-2/5 h-1/2 md:h-full border-b md:border-b-0 md:border-r border-gray-200 z-0">
          <InputPanel 
            isLoading={isLoading} 
            onRequestAnalysis={handleRequestAnalysis} 
            initialValues={selectedRequest}
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

      {/* History Sidebar */}
      <HistorySidebar 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        history={history}
        onSelect={handleHistorySelect}
      />
      
      {/* Overlay for sidebar */}
      {isHistoryOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={() => setIsHistoryOpen(false)}
        />
      )}
    </div>
  );
}
