import React from 'react';
import { Button } from '../components/Button';
import { GameTopic, AppRoute, Language } from '../types';
import { UI_TEXT } from '../constants';

interface HomeProps {
  setRoute: (route: AppRoute) => void;
  setTopic: (topic: GameTopic) => void;
  lang: Language;
}

export const Home: React.FC<HomeProps> = ({ setRoute, setTopic, lang }) => {
  const t = UI_TEXT[lang];

  return (
    <div className="w-full max-w-md flex flex-col gap-8 text-center fade-in">
      <div className="space-y-2 py-8">
        <div className="text-6xl mb-4 animate-float">🔮</div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          {t.title}
        </h1>
        <p className="text-slate-500 text-lg font-medium">
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {Object.values(GameTopic).map((topic) => (
          <button
            key={topic}
            onClick={() => {
              setTopic(topic);
              setRoute(AppRoute.GAME);
            }}
            className="p-4 rounded-2xl bg-white border-2 border-slate-100 hover:border-indigo-400 hover:shadow-md transition-all group flex flex-col items-center gap-2"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
              {topic === GameTopic.MOVIES ? '🎬' : 
               topic === GameTopic.FOOD ? '🍔' : 
               topic === GameTopic.ANIMALS ? '🦁' : 
               topic === GameTopic.ACTIONS ? '🏃' : '🕶️'}
            </span>
            <span className="font-bold text-slate-700 text-sm">
              {t.topics[topic]}
            </span>
          </button>
        ))}
      </div>

      <div className="flex gap-4 mt-4">
        <Button variant="secondary" className="flex-1" onClick={() => setRoute(AppRoute.DASHBOARD)}>
          📊 {t.dashboard}
        </Button>
        <Button variant="secondary" className="flex-1" onClick={() => setRoute(AppRoute.SETTINGS)}>
          ⚙️ {t.settings}
        </Button>
      </div>
    </div>
  );
};