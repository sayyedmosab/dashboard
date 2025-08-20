import React from 'react';
import Panel from './Panel';

interface GeminiAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  analysis: string;
  isLoading: boolean;
}

const GeminiAnalysisModal: React.FC<GeminiAnalysisModalProps> = ({ isOpen, onClose, title, analysis, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <Panel className="overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[var(--component-text-accent)]">{title}</h2>
            <button 
                onClick={onClose}
                className="text-[var(--component-text-muted)] hover:text-[var(--component-text-primary)] text-3xl font-light"
                aria-label="Close modal"
            >
                &times;
            </button>
            </div>
            {isLoading ? (
            <div className="flex items-center justify-center h-48">
                <p className="text-[var(--component-text-muted)] text-lg">🧠 Analyzing data...</p>
            </div>
            ) : (
            <div 
                className="prose prose-invert max-w-none text-[var(--component-text-primary)] opacity-90"
                dangerouslySetInnerHTML={{ __html: analysis }}
            />
            )}
        </Panel>
      </div>
      <style>{`
        .prose ul { list-style: disc; padding-left: 1.5em; }
        .prose li { margin-bottom: 0.5em; }
        .prose h4 { margin-top: 1.5em; margin-bottom: 0.75em; font-weight: 600; }
      `}</style>
    </div>
  );
};

export default GeminiAnalysisModal;
