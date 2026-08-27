import React, { useState } from 'react';
import { Sparkles, ArrowRight, BookOpen, HelpCircle, Layers, Flame, Cpu, Compass } from 'lucide-react';

interface HomeScreenProps {
  onGenerate: (topic: string, difficulty: 'easy' | 'medium' | 'hard') => void;
  initialTopic?: string;
  errorMessage?: string;
}

interface SuggestedTopic {
  title: string;
  category: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const FEATURED_TOPICS: SuggestedTopic[] = [
  {
    category: 'Science',
    title: 'Photosynthesis & Cellular Energy',
    description: 'Light reactions, Calvin cycle, ATP synthesis, and chloroplast mechanics.',
    difficulty: 'medium',
  },
  {
    category: 'History',
    title: 'Roman Architectural Marvels',
    description: 'Engineering feats of the Colosseum, Pantheon, aqueducts, and concrete.',
    difficulty: 'medium',
  },
  {
    category: 'Tech',
    title: 'Quantum Computing & Entanglement',
    description: 'Qubits, superposition, quantum gates, and cryptographic impact.',
    difficulty: 'hard',
  },
  {
    category: 'Biology',
    title: 'Human Neuroanatomy & Synapses',
    description: 'Neurotransmitters, action potentials, cerebral lobes, and motor pathways.',
    difficulty: 'hard',
  },
  {
    category: 'Astronomy',
    title: 'Black Holes & Event Horizons',
    description: 'Singularities, Hawking radiation, gravitational lensing, and spacetime.',
    difficulty: 'medium',
  },
  {
    category: 'Coding',
    title: 'Python Data Structures & Algorithms',
    description: 'Lists, hash maps, binary trees, recursion, and time complexity.',
    difficulty: 'easy',
  },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onGenerate,
  initialTopic = '',
  errorMessage,
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = topic.trim();
    if (!trimmed) {
      setLocalError('Please enter a topic before generating a quiz.');
      return;
    }
    setLocalError(null);
    onGenerate(trimmed, difficulty);
  };

  const handleSelectCard = (item: SuggestedTopic) => {
    setTopic(item.title);
    setDifficulty(item.difficulty);
    setLocalError(null);
    onGenerate(item.title, item.difficulty);
  };

  return (
    <div id="screen-home" className="w-full py-10 sm:py-16 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16161D] border border-[#2E2E38] text-[#7C6AF7] text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini 3.7 Flash Engine</span>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-2xl mb-10">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#F0F0F5] mb-4 leading-[1.08]">
            Generate Knowledge <span className="text-[#7C6AF7]">Instantly</span>.
          </h1>
          <p className="text-[#9090A8] text-base sm:text-lg leading-relaxed max-w-lg mx-auto">
            Transform any topic into a professional-grade 5-question assessment with instant grading and rich explanations.
          </p>
        </div>

        {/* Input Card Container */}
        <div className="w-full max-w-2xl bg-[#16161D] border border-[#2E2E38] rounded-2xl p-2 sm:p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative z-10 transition-all duration-200 focus-within:border-[#7C6AF7] focus-within:ring-4 focus-within:ring-[#7C6AF7]/15 mb-6">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              id="topic-input"
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                if (localError) setLocalError(null);
              }}
              placeholder="What would you like to learn today? (e.g., Quantum Physics, Photosynthesis…)"
              maxLength={80}
              className="flex-1 bg-transparent px-4 sm:px-5 py-3.5 text-base sm:text-lg outline-none text-[#F0F0F5] placeholder-[#5A5A70] font-normal"
              autoFocus
            />

            <button
              type="submit"
              id="btn-generate"
              className="bg-[#7C6AF7] hover:bg-[#6B59E8] text-white px-6 sm:px-7 py-3.5 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-[0_4px_20px_rgba(124,106,247,0.3)] hover:shadow-[0_6px_25px_rgba(124,106,247,0.45)] active:scale-[0.98] shrink-0 cursor-pointer"
            >
              <span>Generate</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Error message */}
        {(localError || errorMessage) && (
          <p id="input-error" className="text-[#F56565] text-sm font-medium mb-6 animate-fade-in">
            {localError || errorMessage}
          </p>
        )}

        {/* Difficulty Selector Bar */}
        <div className="w-full max-w-2xl flex flex-wrap items-center justify-between gap-3 px-2 mb-14 text-xs text-[#9090A8]">
          <div className="flex items-center gap-2">
            <span className="font-semibold uppercase tracking-wider text-[#5A5A70]">Difficulty:</span>
            <div className="inline-flex p-1 bg-[#16161D] border border-[#2E2E38] rounded-xl gap-1">
              {(['easy', 'medium', 'hard'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setDifficulty(lvl)}
                  className={`px-3 py-1 rounded-lg font-medium capitalize transition-all text-xs cursor-pointer ${
                    difficulty === lvl
                      ? 'bg-[#7C6AF7] text-white shadow-sm'
                      : 'text-[#9090A8] hover:text-[#F0F0F5]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 text-[#5A5A70]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3ECF8E]" />
              5 Questions
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7C6AF7]" />
              Explanations Included
            </span>
          </div>
        </div>

        {/* Recent / Suggested Generations Grid */}
        <div className="w-full max-w-4xl relative z-10">
          <div className="flex items-center justify-between mb-5 px-2">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#7C6AF7]" />
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#9090A8]">
                Curated Topics
              </h3>
            </div>
            <span className="text-xs text-[#5A5A70]">
              Click any card to start instantly
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
            {FEATURED_TOPICS.map((item) => (
              <div
                key={item.title}
                onClick={() => handleSelectCard(item)}
                className="bg-[#16161D] border border-[#2E2E38] p-5 rounded-2xl hover:border-[#7C6AF7] hover:bg-[#1E1E28] transition-all duration-200 cursor-pointer group shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="px-2 py-0.5 bg-[#2E2E38] text-[#9090A8] text-[10px] font-bold rounded uppercase tracking-wider group-hover:bg-[#7C6AF7]/20 group-hover:text-[#7C6AF7] transition-colors">
                      {item.category}
                    </span>
                    <span className="text-[#5A5A70] text-[11px] capitalize">
                      {item.difficulty}
                    </span>
                  </div>

                  <h4 className="font-semibold text-[#F0F0F5] mb-2 group-hover:text-[#7C6AF7] transition-colors text-sm sm:text-base leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[12px] text-[#9090A8] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#2E2E38]/60 flex items-center justify-between text-xs text-[#5A5A70] group-hover:text-[#7C6AF7] transition-colors">
                  <span>Take Quiz</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl mt-14 pt-8 border-t border-[#2E2E38] text-left">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#16161D]/50 border border-[#2E2E38]/50">
            <Cpu className="w-5 h-5 text-[#7C6AF7] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-[#F0F0F5]">Gemini 3.7 Flash</p>
              <p className="text-xs text-[#9090A8] mt-0.5">High-fidelity questions with plausible distractors</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#16161D]/50 border border-[#2E2E38]/50">
            <Flame className="w-5 h-5 text-[#3ECF8E] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-[#F0F0F5]">Instant Grading</p>
              <p className="text-xs text-[#9090A8] mt-0.5">Automated validation with comprehensive answer keys</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#16161D]/50 border border-[#2E2E38]/50">
            <Layers className="w-5 h-5 text-[#7C6AF7] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-[#F0F0F5]">Deep Explanations</p>
              <p className="text-xs text-[#9090A8] mt-0.5">Contextual rationale for every single option</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

