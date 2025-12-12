import React, { useEffect, useRef } from 'react';
import { ResearchGoal, FieldOfStudy, AnalysisRequest } from '../types';
import { EXAMPLE_SCENARIO } from '../constants';

interface InputPanelProps {
  isLoading: boolean;
  onRequestAnalysis: (data: AnalysisRequest) => void;
  initialValues?: AnalysisRequest | null;
}

export const InputPanel: React.FC<InputPanelProps> = ({ isLoading, onRequestAnalysis, initialValues }) => {
  const [goal, setGoal] = React.useState<ResearchGoal>(ResearchGoal.STRENGTHEN_PAPER);
  const [field, setField] = React.useState<FieldOfStudy>(FieldOfStudy.PHYSICS_ENG);
  const [hypothesis, setHypothesis] = React.useState<string>("");
  const [files, setFiles] = React.useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Restore values when history item is selected
  useEffect(() => {
    if (initialValues) {
      setGoal(initialValues.goal);
      setField(initialValues.field);
      setHypothesis(initialValues.hypothesis);
      setFiles(initialValues.files); // Note: File objects persist in memory for the session
    }
  }, [initialValues]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      // Append new files, avoiding duplicates by name/size for basic hygiene, limit to 10
      setFiles(prev => {
        const combined = [...prev, ...newFiles];
        // Basic dedup
        const unique = combined.filter((file, index, self) =>
          index === self.findIndex((f) => (
            f.name === file.name && f.size === file.size
          ))
        );
        return unique.slice(0, 10);
      });
    }
    // Reset input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleLoadExample = () => {
    setGoal(EXAMPLE_SCENARIO.goal);
    setField(EXAMPLE_SCENARIO.field);
    setHypothesis(EXAMPLE_SCENARIO.hypothesis);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hypothesis.trim() && files.length === 0) {
      alert("Please provide a hypothesis or upload a file.");
      return;
    }
    onRequestAnalysis({ goal, field, hypothesis, files });
  };

  return (
    <div className="h-full flex flex-col p-6 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 font-serif mb-1">Research Input</h2>
        <p className="text-sm text-gray-500">Define your parameters for the Professor.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-grow">
        
        {/* Goal Selection */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Your Goal
          </label>
          <select 
            value={goal}
            onChange={(e) => setGoal(e.target.value as ResearchGoal)}
            className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
          >
            {Object.values(ResearchGoal).map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Field Selection */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Field of Study
          </label>
          <select 
            value={field}
            onChange={(e) => setField(e.target.value as FieldOfStudy)}
            className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
          >
            {Object.values(FieldOfStudy).map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          {field === FieldOfStudy.BIO_MED && (
            <p className="text-xs text-orange-600 mt-1">⚠️ Safety filters strictly applied.</p>
          )}
        </div>

        {/* Hypothesis Input */}
        <div className="flex-grow flex flex-col">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Hypothesis / Research Question
          </label>
          <textarea 
            value={hypothesis}
            onChange={(e) => setHypothesis(e.target.value)}
            placeholder="E.g., I derived E=mc^3 based on..."
            className="w-full flex-grow p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-mono resize-none min-h-[150px]"
          />
        </div>

        {/* File Upload Area */}
        <div>
          <div className="flex justify-between items-end mb-1">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Attach Evidence
            </label>
            <span className="text-[10px] text-gray-400">
              {files.length}/10 files
            </span>
          </div>
          
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors relative">
            <div className="space-y-1 text-center">
              <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="text-sm text-gray-600">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                  <span>Upload files</span>
                  <input 
                    id="file-upload" 
                    ref={fileInputRef}
                    name="file-upload" 
                    type="file" 
                    className="sr-only" 
                    multiple 
                    onChange={handleFileChange} 
                    accept="image/*,application/pdf" 
                  />
                </label>
                <p className="pl-1 inline">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PDFs, Images, Graphs (Max 10)</p>
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-3 space-y-2">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-md border border-blue-100 group">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="text-lg">📄</span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-medium text-blue-900 truncate block max-w-[180px]" title={file.name}>
                        {file.name}
                      </span>
                      <span className="text-[10px] text-blue-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2 mt-auto">
          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
          >
            {isLoading ? 'Analyzing...' : 'Ask Professor'}
          </button>
          
          <button 
            type="button"
            onClick={handleLoadExample}
            disabled={isLoading}
            className="w-full py-2 px-4 rounded-md border border-gray-300 shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Load Example Thesis
          </button>
        </div>
      </form>
    </div>
  );
};
