import React, { useState, useRef } from 'react';
import { QuizQuestion, QuizResult } from '../types';
import { CheckCircle2, AlertCircle, ArrowLeft, Send, Sparkles } from 'lucide-react';

interface QuizScreenProps {
  topic: string;
  questions: QuizQuestion[];
  onSubmit: (result: QuizResult) => void;
  onRestart: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  topic,
  questions,
  onSubmit,
  onRestart,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleSelectOption = (questionIndex: number, letter: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: letter,
    }));
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const handleSubmit = () => {
    const unansweredIndex = questions.findIndex((_, idx) => !selectedAnswers[idx]);

    if (unansweredIndex !== -1) {
      setErrorMessage(`Please answer Question ${unansweredIndex + 1} before submitting.`);
      const targetEl = questionRefs.current[unansweredIndex];
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setErrorMessage(null);

    let score = 0;
    const breakdown = questions.map((q, idx) => {
      const selected = selectedAnswers[idx] || null;
      const isCorrect = selected === q.answer;
      if (isCorrect) score++;

      return {
        question: q.question,
        isCorrect,
        selectedLetter: selected,
        correctLetter: q.answer,
        correctText: q.options[q.answer],
        explanation: q.explanation,
      };
    });

    onSubmit({
      score,
      total: questions.length,
      breakdown,
    });
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPct = (answeredCount / questions.length) * 100;

  return (
    <div id="screen-quiz" className="w-full py-10 sm:py-14 px-4 sm:px-8 relative z-10">
      <div className="max-w-3xl mx-auto">
        {/* Quiz Header Banner */}
        <header className="pt-2 pb-8 border-b border-[#2E2E38] mb-8">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16161D] border border-[#2E2E38] text-xs font-semibold text-[#7C6AF7] uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>Assessment In Progress</span>
            </div>
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#16161D] border border-[#2E2E38] text-[#9090A8]">
              {answeredCount} of {questions.length} completed
            </span>
          </div>

          <h2 id="quiz-topic-title" className="font-display text-3xl sm:text-4xl md:text-5xl text-[#F0F0F5] tracking-tight leading-tight mb-2">
            {topic}
          </h2>

          <p className="text-xs sm:text-sm text-[#9090A8]">
            5 questions · Choose one answer per question
          </p>

          {/* Progress bar with glow */}
          <div className="w-full h-2 bg-[#16161D] rounded-full mt-5 overflow-hidden border border-[#2E2E38]">
            <div
              className="h-full bg-gradient-to-r from-[#7C6AF7] to-[#4F39F3] transition-all duration-300 rounded-full shadow-[0_0_10px_rgba(124,106,247,0.5)]"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </header>

        {/* Questions List */}
        <div id="questions-container" className="flex flex-col gap-6">
          {questions.map((q, qIndex) => {
            const currentSelected = selectedAnswers[qIndex];
            const isAnswered = Boolean(currentSelected);

            return (
              <div
                key={qIndex}
                ref={(el) => (questionRefs.current[qIndex] = el)}
                data-index={qIndex}
                className={`p-6 sm:p-7 rounded-2xl bg-[#16161D] border transition-all duration-200 shadow-lg ${
                  isAnswered
                    ? 'border-[#7C6AF7]/60 shadow-[0_4px_25px_rgba(124,106,247,0.08)]'
                    : 'border-[#2E2E38]'
                }`}
              >
                {/* Question Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-[#7C6AF7]">
                    Question {qIndex + 1} of {questions.length}
                  </span>
                  {isAnswered && (
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-[#3ECF8E] font-medium px-2 py-0.5 rounded-full bg-[#3ECF8E]/10">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Answer Selected</span>
                    </span>
                  )}
                </div>

                {/* Question Prompt */}
                <p className="text-[#F0F0F5] text-base sm:text-lg font-medium leading-snug mb-5">
                  {q.question}
                </p>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(['A', 'B', 'C', 'D'] as const).map((letter) => {
                    const optionText = q.options[letter];
                    const isChecked = currentSelected === letter;

                    return (
                      <label
                        key={letter}
                        onClick={() => handleSelectOption(qIndex, letter)}
                        className={`flex items-start gap-3 p-4 rounded-xl border text-sm leading-relaxed cursor-pointer transition-all duration-150 select-none ${
                          isChecked
                            ? 'bg-[#7C6AF7]/15 border-[#7C6AF7] text-[#F0F0F5] shadow-[0_0_15px_rgba(124,106,247,0.15)] ring-1 ring-[#7C6AF7]'
                            : 'bg-[#0F0F11] border-[#2E2E38] text-[#F0F0F5] hover:border-[#7C6AF7]/60 hover:bg-[#1E1E28]'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q${qIndex}`}
                          value={letter}
                          checked={isChecked}
                          onChange={() => handleSelectOption(qIndex, letter)}
                          className="sr-only"
                        />

                        {/* Custom radio button */}
                        <div
                          className={`w-4 h-4 rounded-full mt-0.5 shrink-0 border flex items-center justify-center transition-all ${
                            isChecked
                              ? 'border-[#7C6AF7] bg-[#7C6AF7] shadow-[0_0_8px_#7C6AF7]'
                              : 'border-[#5A5A70] bg-transparent'
                          }`}
                        >
                          {isChecked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>

                        {/* Letter indicator */}
                        <span
                          className={`text-xs font-bold shrink-0 mt-0.5 ${
                            isChecked ? 'text-[#7C6AF7]' : 'text-[#9090A8]'
                          }`}
                        >
                          {letter}.
                        </span>

                        {/* Text */}
                        <span className="text-sm font-normal text-[#F0F0F5]">
                          {optionText}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Error message */}
        {errorMessage && (
          <div
            id="quiz-error"
            className="flex items-center gap-2 p-4 mt-6 rounded-xl bg-[#F56565]/10 border border-[#F56565]/30 text-[#F56565] text-sm font-medium animate-shake"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Buttons Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-8 pt-4">
          <button
            type="button"
            id="btn-submit"
            onClick={handleSubmit}
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-[#7C6AF7] hover:bg-[#6B59E8] text-white font-semibold text-base shadow-[0_4px_20px_rgba(124,106,247,0.3)] hover:shadow-[0_6px_25px_rgba(124,106,247,0.45)] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Submit Answers</span>
          </button>

          <button
            type="button"
            id="btn-restart-quiz"
            onClick={onRestart}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-[#16161D] hover:bg-[#1E1E28] border border-[#2E2E38] hover:border-[#9090A8] text-[#9090A8] hover:text-[#F0F0F5] font-semibold text-base transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Change Topic</span>
          </button>
        </div>
      </div>
    </div>
  );
};

