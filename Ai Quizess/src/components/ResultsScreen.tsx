import React from 'react';
import { QuizResult } from '../types';
import { RotateCcw, ArrowLeft, CheckCircle2, XCircle, Award, Sparkles } from 'lucide-react';

interface ResultsScreenProps {
  topic: string;
  result: QuizResult;
  onTryAgain: () => void;
  onNewTopic: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  topic,
  result,
  onTryAgain,
  onNewTopic,
}) => {
  const { score, total, breakdown } = result;
  const pct = total > 0 ? score / total : 0;

  let message = '';
  if (pct === 1) {
    message = '🎉 Perfect score! You displayed complete mastery.';
  } else if (pct >= 0.8) {
    message = '🌟 Outstanding performance — deep comprehension of the topic.';
  } else if (pct >= 0.6) {
    message = "👍 Good foundation! A quick review will get you to 100%.";
  } else if (pct >= 0.4) {
    message = '📚 Worth revisiting the core mechanics of this subject.';
  } else {
    message = '💪 Keep exploring! Mastery comes through iterative practice.';
  }

  return (
    <div id="screen-results" className="w-full py-10 sm:py-14 px-4 sm:px-8 relative z-10">
      <div className="max-w-2xl mx-auto">
        {/* Results Card */}
        <div className="bg-[#16161D] border border-[#2E2E38] rounded-3xl p-6 sm:p-10 text-center shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0F0F11] border border-[#2E2E38] text-xs font-semibold text-[#7C6AF7] uppercase tracking-wider mb-4 shadow-sm">
            <Award className="w-3.5 h-3.5" />
            <span>Assessment Complete · {topic}</span>
          </div>

          {/* Big Score Display */}
          <div className="font-display text-6xl sm:text-7xl md:text-8xl tracking-tight my-4 leading-none flex items-center justify-center gap-2">
            <span
              id="score-numerator"
              className={score === total ? 'text-[#3ECF8E]' : 'text-[#F0F0F5]'}
            >
              {score}
            </span>
            <span className="text-3xl sm:text-4xl text-[#5A5A70] font-light">/</span>
            <span id="score-denominator" className="text-4xl sm:text-5xl text-[#9090A8] font-light">
              {total}
            </span>
          </div>

          {/* Score percentage badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-[#0F0F11] border border-[#2E2E38] text-[#9090A8] mb-3">
            <Sparkles className="w-3 h-3 text-[#7C6AF7]" />
            <span>{Math.round(pct * 100)}% Accuracy Rate</span>
          </div>

          {/* Score Message */}
          <p id="score-message" className="text-[#F0F0F5] text-base sm:text-lg font-medium max-w-[440px] mx-auto mb-8 leading-relaxed">
            {message}
          </p>

          {/* Results Breakdown */}
          <div id="results-breakdown" className="text-left flex flex-col divide-y divide-[#2E2E38] border-t border-b border-[#2E2E38] my-6">
            {breakdown.map((item, idx) => (
              <div key={idx} className="py-4.5 flex items-start gap-3.5">
                {item.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-[#3ECF8E] shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-[#F56565] shrink-0 mt-0.5" />
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#F0F0F5] leading-snug mb-1">
                    Q{idx + 1}. {item.question}
                  </p>

                  <div className="text-xs space-y-1">
                    {item.isCorrect ? (
                      <p className="text-[#3ECF8E] font-medium">
                        ✓ Correct! You selected {item.correctLetter}: {item.correctText}
                      </p>
                    ) : (
                      <p className="text-[#F56565] font-medium">
                        ✗ Selected: {item.selectedLetter || 'None'} · Correct: {item.correctLetter} ({item.correctText})
                      </p>
                    )}

                    {item.explanation && (
                      <div className="p-2.5 rounded-lg bg-[#0F0F11] border border-[#2E2E38] text-[#9090A8] text-[11px] leading-relaxed mt-1.5">
                        <span className="text-[#7C6AF7] uppercase font-semibold text-[10px] tracking-wider mr-1">
                          Rationale:
                        </span>
                        {item.explanation}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              type="button"
              id="btn-try-again"
              onClick={onTryAgain}
              className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-[#7C6AF7] hover:bg-[#6B59E8] text-white font-semibold text-base shadow-[0_4px_20px_rgba(124,106,247,0.3)] hover:shadow-[0_6px_25px_rgba(124,106,247,0.45)] active:scale-[0.98] transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Regenerate with Same Topic</span>
            </button>

            <button
              type="button"
              id="btn-new-topic"
              onClick={onNewTopic}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-transparent hover:bg-[#0F0F11] border border-[#2E2E38] text-[#9090A8] hover:text-[#F0F0F5] font-semibold text-base transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Choose a New Topic</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

