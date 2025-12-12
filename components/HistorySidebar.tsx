import React from 'react';
import { HistoryItem } from '../types';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ isOpen, onClose, history, onSelect }) => {
  return (
    <div 
      className={`fixed inset-y-0 right-0 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-slate-50">
        <h2 className="font-serif font-bold text-lg text-slate-800 flex items-center gap-2">
          <span>📜</span> Research Log
        </h2>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-gray-50">
        {history.length === 0 ? (
          <div className="text-center text-gray-400 mt-10 text-sm italic">
            No research history yet.
          </div>
        ) : (
          history.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSelect(item);
                onClose();
              }}
              className="w-full text-left bg-white p-3 rounded-md border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
                <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                  {item.response.timestamp}
                </span>
              </div>
              <h4 className="font-serif font-semibold text-gray-800 text-sm mb-1 group-hover:text-blue-700 line-clamp-1">
                {item.request.goal}
              </h4>
              <p className="text-xs text-gray-500 line-clamp-2 font-sans">
                {item.request.hypothesis || "(No hypothesis text provided)"}
              </p>
              {item.request.files.length > 0 && (
                <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-400">
                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                   {item.request.files.length} file(s)
                </div>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
};
