import React from 'react';
import { Sparkles, Brain } from 'lucide-react';

interface LoadingScreenProps {
  topic: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ topic }) => {
  return (
    <div id="screen-loading" className="w-full min-h-[70vh] flex flex-col items-center justify-center py-16 px-4 text-center relative z-10">
      <div className="max-w-md mx-auto flex flex-col items-center justify-center">
        {/* Glow icon backdrop */}
        <div className="relative mb-8 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#7C6AF7] opacity-20 blur-xl rounded-full" />
          <div className="loader-ring relative z-10 flex items-center justify-center">
            <Brain className="w-6 h-6 text-[#7C6AF7] opacity-90 animate-pulse" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16161D] border border-[#2E2E38] text-xs font-semibold text-[#7C6AF7] uppercase tracking-wider mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Synthesizing Questions</span>
        </div>

        <h3 className="font-display text-3xl sm:text-4xl text-[#F0F0F5] mb-3 font-bold tracking-tight">
          Generating Assessment
        </h3>

        <p id="loading-text" className="text-[#9090A8] text-base leading-relaxed mb-6 max-w-sm">
          Formulating 5 calibrated questions about <span className="text-[#F0F0F5] font-semibold">"{topic}"</span> with answer keys and rationale.
        </p>

        {/* Status indicator bar */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16161D] border border-[#2E2E38] text-xs text-[#5A5A70]">
          <span className="w-2 h-2 rounded-full bg-[#3ECF8E] animate-ping" />
          <span className="text-[#9090A8]">Gemini 3.7 Flash Active</span>
        </div>
      </div>
    </div>
  );
};

