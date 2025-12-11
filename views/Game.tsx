import React, { useState, useEffect, useRef } from 'react';
import { generatePuzzle } from '../services/geminiService';
import { Button } from '../components/Button';
import { GameTopic, AppRoute, Language, PuzzleData, SettingsState, ModelConfig } from '../types';
import { UI_TEXT } from '../constants';

interface GameProps {
  topic: GameTopic;
  settings: SettingsState;
  setRoute: (route: AppRoute) => void;
  onWin: () => void;
}

export const Game: React.FC<GameProps> = ({ topic, settings, setRoute, onWin }) => {
  const [loading, setLoading] = useState(true);
  const [puzzle, setPuzzle] = useState<PuzzleData | null>(null);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const t = UI_TEXT[settings.language];

  // Helper to get active config
  const activeConfig = settings.modelConfigs.find(c => c.id === settings.activeConfigId) || settings.modelConfigs[0];

  const loadNewPuzzle = async () => {
    setLoading(true);
    setFeedback('none');
    setGuess('');
    setShowHint(false);
    
    try {
      const data = await generatePuzzle(topic, settings.language, settings.creativity, activeConfig);
      setPuzzle(data);
    } catch (e) {
      console.error(e);
      // Fallback for UI if error wasn't caught in service
      setPuzzle({
        emojis: '🚫',
        answer: 'Error',
        acceptable_answers: [],
        hint: 'Please check your model configuration settings.'
      });
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  useEffect(() => {
    loadNewPuzzle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGuess = () => {
    if (!puzzle) return;

    const normalizedGuess = guess.toLowerCase().trim();
    const normalizedAnswer = puzzle.answer.toLowerCase().trim();
    const acceptable = puzzle.acceptable_answers.map(a => a.toLowerCase().trim());

    if (normalizedGuess === normalizedAnswer || acceptable.includes(normalizedGuess)) {
      setFeedback('correct');
      setScore(s => s + (showHint ? 50 : 100));
      onWin(); 
    } else {
      setFeedback('wrong');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleGuess();
  };

  if (loading) {
    return (
      <div className="w-full max-w-md flex flex-col items-center justify-center min-h-[400px] gap-6 fade-in">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse">{t.loading}</p>
        <p className="text-xs text-slate-400">Using: {activeConfig.name}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md flex flex-col gap-6 fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <button onClick={() => setRoute(AppRoute.HOME)} className="text-slate-400 hover:text-slate-600">
          ← {t.back}
        </button>
        <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold text-sm">
          {t.score}: {score}
        </div>
      </div>

      {/* Puzzle Card */}
      <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 text-center border border-slate-100 min-h-[200px] flex flex-col items-center justify-center relative overflow-hidden">
        {feedback === 'correct' && (
           <div className="absolute inset-0 bg-green-50/90 flex items-center justify-center z-10 backdrop-blur-sm">
             <div className="text-center">
               <div className="text-5xl mb-2">🎉</div>
               <h3 className="text-xl font-bold text-green-600">{t.correct}</h3>
               <p className="text-green-800 font-bold text-lg mt-1">{puzzle?.answer}</p>
               <Button className="mt-4" onClick={loadNewPuzzle}>{t.next} →</Button>
             </div>
           </div>
        )}
        
        <div className="text-6xl sm:text-7xl mb-6 leading-relaxed tracking-widest filter drop-shadow-sm select-none break-words">
          {puzzle?.emojis}
        </div>
        
        {showHint && (
          <p className="text-slate-500 text-sm bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 animate-fadeIn">
             💡 {puzzle?.hint}
          </p>
        )}
      </div>

      {/* Input Area */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={guess}
          onChange={(e) => {
            setGuess(e.target.value);
            if (feedback === 'wrong') setFeedback('none');
          }}
          onKeyDown={handleKeyDown}
          placeholder={t.submit + '...'}
          className={`w-full p-4 rounded-xl border-2 text-lg outline-none transition-colors ${
            feedback === 'wrong' 
              ? 'border-rose-300 bg-rose-50 text-rose-900 focus:border-rose-400' 
              : 'border-slate-200 focus:border-indigo-400 focus:bg-white'
          }`}
          disabled={feedback === 'correct'}
        />
        <div className="absolute right-2 top-2 bottom-2">
            <Button size="sm" onClick={handleGuess} disabled={!guess || feedback === 'correct'}>
                {t.submit}
            </Button>
        </div>
      </div>

      {feedback === 'wrong' && (
         <p className="text-center text-rose-500 font-bold text-sm animate-bounce">
           {t.wrong}
         </p>
      )}

      {/* Hint Toggle */}
      <div className="text-center">
        <button 
          onClick={() => setShowHint(true)} 
          className="text-slate-400 text-sm hover:text-indigo-500 underline decoration-dotted underline-offset-4 disabled:opacity-50"
          disabled={showHint || feedback === 'correct'}
        >
          {t.hint}
        </button>
      </div>
    </div>
  );
};