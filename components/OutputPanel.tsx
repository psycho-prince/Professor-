import React from 'react';
import { AnalysisResponse } from '../types';

interface OutputPanelProps {
  response: AnalysisResponse | null;
  isLoading: boolean;
  revisionNotes: string | null;
  isGeneratingNotes: boolean;
  onGenerateNotes: () => void;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({ 
  response, 
  isLoading, 
  revisionNotes, 
  isGeneratingNotes, 
  onGenerateNotes 
}) => {
  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mb-4"></div>
        <h3 className="text-lg font-serif font-semibold text-gray-700">Professor is reviewing your work...</h3>
        <p className="text-sm text-gray-500 mt-2">Checking dimensional analysis and assumptions.</p>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">🎓</span>
        </div>
        <h3 className="text-xl font-serif font-semibold text-gray-800">Ready for Review</h3>
        <p className="text-gray-500 mt-2 max-w-sm">
          Submit your hypothesis or paper on the left. I will rigorously verify your logic, math, and evidence.
        </p>
      </div>
    );
  }

  // Simple formatter for the markdown response to handle bolding and headers
  // In a real app, use react-markdown. Here we use a safe simple render for the hackathon constraint.
  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-serif font-bold text-slate-800 mt-6 mb-2 pb-1 border-b border-gray-200">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('- ')) {
        return <li key={index} className="ml-4 list-disc text-gray-700 mb-1 pl-1">{line.replace('- ', '')}</li>;
      }
      // Very basic bold parsing: **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={index} className="mb-2 text-gray-700 leading-relaxed">
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i} className="text-slate-900 font-semibold">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-y-auto">
      <div className="p-8 pb-32"> {/* Added padding bottom for scrolling room */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-serif text-slate-900">Professor's Critique</h2>
          <span className="text-xs font-mono text-gray-400">Gen {response.timestamp}</span>
        </div>

        <div className="prose max-w-none text-sm font-sans">
          {renderMarkdown(response.markdown)}
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          {!revisionNotes ? (
            <button
              onClick={onGenerateNotes}
              disabled={isGeneratingNotes}
              className="flex items-center gap-2 text-blue-700 hover:text-blue-900 font-semibold transition-colors disabled:opacity-50"
            >
              <span className="text-xl">✍️</span>
              {isGeneratingNotes ? 'Drafting Checklist...' : 'Generate Revision Notes'}
            </button>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 mt-4 shadow-sm">
              <h4 className="font-bold text-yellow-900 mb-3 flex items-center gap-2">
                <span>📌</span> Revision Notes
              </h4>
              <div className="space-y-2">
                {revisionNotes.split('\n').map((line, idx) => {
                  if (line.includes('☐')) {
                    const text = line.replace('☐', '').trim();
                    return (
                      <div key={idx} className="flex items-start gap-3">
                         <input type="checkbox" className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                         <span className="text-sm text-gray-800">{text}</span>
                      </div>
                    )
                  }
                  return null;
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
