import { useState } from 'react';
import { ScreenType, QuizQuestion, QuizResult } from './types';
import { HomeScreen } from './components/HomeScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { ApiKeyModal } from './components/ApiKeyModal';
import { generateQuizQuestions, getStoredApiKey } from './services/gemini';
import { Sparkles, BrainCircuit, Key } from 'lucide-react';

export default function App() {
  const [screen, setScreen] = useState<ScreenType>('home');
  const [currentTopic, setCurrentTopic] = useState<string>('');
  const [currentDifficulty, setCurrentDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>(getStoredApiKey());

  const handleGenerateQuiz = async (topic: string, difficulty: 'easy' | 'medium' | 'hard' = 'medium') => {
    setCurrentTopic(topic);
    setCurrentDifficulty(difficulty);
    setErrorMessage(null);

    // Check if API key is present
    const activeKey = apiKey || getStoredApiKey();
    if (!activeKey) {
      setIsKeyModalOpen(true);
      return;
    }

    setScreen('loading');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const generated = await generateQuizQuestions(topic, difficulty, 5, activeKey);

      if (!generated || generated.length === 0) {
        throw new Error('No quiz questions were generated. Please try again.');
      }

      setQuestions(generated);
      setScreen('quiz');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Quiz generation failure:', error);

      if (error.message === 'GEMINI_API_KEY_REQUIRED') {
        setIsKeyModalOpen(true);
      } else {
        setErrorMessage(error.message || 'Failed to generate quiz. Please check your API key and network.');
      }
      setScreen('home');
    }
  };

  const handleSubmitQuiz = (quizResult: QuizResult) => {
    setResult(quizResult);
    setScreen('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTryAgain = () => {
    if (currentTopic) {
      handleGenerateQuiz(currentTopic, currentDifficulty);
    } else {
      setScreen('home');
    }
  };

  const handleNewTopic = () => {
    setQuestions([]);
    setResult(null);
    setErrorMessage(null);
    setScreen('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0C] text-[#F0F0F5] relative overflow-x-hidden selection:bg-[#7C6AF7]/30 selection:text-white">
      {/* Immersive Ambient Glow Orbs */}
      <div
        className="pointer-events-none fixed top-[-10%] left-[-5%] w-[450px] h-[450px] bg-[#7C6AF7] opacity-10 blur-[130px] rounded-full z-0"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed bottom-[-10%] right-[-5%] w-[450px] h-[450px] bg-[#4F39F3] opacity-10 blur-[130px] rounded-full z-0"
        aria-hidden="true"
      />

      {/* Top Navigation Bar */}
      <nav className="flex items-center justify-between px-6 sm:px-10 py-4 sm:py-5 border-b border-[#2E2E38] bg-[#0F0F11] relative z-20">
        <div
          onClick={handleNewTopic}
          className="flex items-center gap-3 cursor-pointer group"
          title="Return to Home"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-[#7C6AF7] to-[#4F39F3] rounded-lg shadow-[0_0_15px_rgba(124,106,247,0.4)] flex items-center justify-center text-white">
            <BrainCircuit className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-tight text-[#F0F0F5] group-hover:text-[#7C6AF7] transition-colors">
              QuizMind AI
            </span>
            <span className="text-[10px] text-[#5A5A70] -mt-1 font-medium hidden sm:inline">
              Pure Client-Side Web App
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 text-xs text-[#9090A8] font-medium">
          <button
            onClick={() => setIsKeyModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16161D] hover:bg-[#1E1E28] border border-[#2E2E38] text-xs text-[#9090A8] hover:text-[#F0F0F5] transition-all cursor-pointer"
            title="Configure Gemini API Key"
          >
            <Key className="w-3.5 h-3.5 text-[#7C6AF7]" />
            <span className="hidden sm:inline">{apiKey ? 'API Key Set' : 'Set API Key'}</span>
          </button>

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#16161D] border border-[#2E2E38] text-[11px]">
            <Sparkles className="w-3 h-3 text-[#7C6AF7]" />
            <span>Gemini 2.5 Flash</span>
          </div>

          <button
            onClick={handleNewTopic}
            className="px-3.5 py-1.5 rounded-lg bg-[#7C6AF7] hover:bg-[#6B59E8] text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
          >
            New Quiz
          </button>
        </div>
      </nav>

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col justify-center relative z-10">
        {screen === 'home' && (
          <HomeScreen
            onGenerate={handleGenerateQuiz}
            initialTopic={currentTopic}
            errorMessage={errorMessage || undefined}
          />
        )}

        {screen === 'loading' && <LoadingScreen topic={currentTopic} />}

        {screen === 'quiz' && (
          <QuizScreen
            topic={currentTopic}
            questions={questions}
            onSubmit={handleSubmitQuiz}
            onRestart={handleNewTopic}
          />
        )}

        {screen === 'results' && result && (
          <ResultsScreen
            topic={currentTopic}
            result={result}
            onTryAgain={handleTryAgain}
            onNewTopic={handleNewTopic}
          />
        )}
      </main>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        onKeySaved={(newKey) => {
          setApiKey(newKey);
          if (currentTopic && screen === 'home') {
            handleGenerateQuiz(currentTopic, currentDifficulty);
          }
        }}
      />

      {/* Immersive Footer Bar */}
      <footer className="px-6 sm:px-10 py-4 sm:py-5 border-t border-[#2E2E38] bg-[#0F0F11] flex flex-col sm:flex-row items-center justify-between text-[#5A5A70] text-xs gap-3 relative z-20">
        <div className="flex items-center gap-3 sm:gap-4">
          <span>Client-Side Static Web App</span>
          <span className="w-1 h-1 bg-[#2E2E38] rounded-full" />
          <span>No Node.js Backend Needed</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="hidden sm:inline">Browser Ready</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#3ECF8E] rounded-full shadow-[0_0_8px_#3ECF8E] animate-pulse" />
            <span className="text-[#9090A8]">Static SPA</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

