import React from 'react';
import { Button } from '../components/Button';
import { AppRoute, GameStats, Language } from '../types';
import { UI_TEXT } from '../constants';

interface DashboardProps {
  stats: GameStats;
  setRoute: (route: AppRoute) => void;
  lang: Language;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, setRoute, lang }) => {
  const t = UI_TEXT[lang];

  const StatCard = ({ label, value, icon }: { label: string, value: string | number, icon: string }) => (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
      <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-2xl">
        {icon}
      </div>
      <div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{label}</p>
        <p className="text-slate-800 text-xl font-bold">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-md flex flex-col gap-6 fade-in">
      <div className="flex items-center gap-4 mb-2">
         <Button variant="ghost" size="sm" onClick={() => setRoute(AppRoute.HOME)}>←</Button>
         <h2 className="text-2xl font-bold text-slate-800">{t.statsTitle}</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <StatCard label={t.totalGames} value={stats.totalGames} icon="🎮" />
        <StatCard label={t.winRate} value={stats.totalGames > 0 ? `${Math.round((stats.totalWins / stats.totalGames) * 100)}%` : '0%'} icon="🏆" />
        <StatCard label={t.bestStreak} value={stats.bestStreak} icon="🔥" />
        <StatCard label={t.score} value={stats.totalScore} icon="⭐" />
      </div>

      <div className="mt-8 bg-indigo-900 rounded-3xl p-6 text-white text-center relative overflow-hidden">
        <div className="relative z-10">
          <p className="opacity-80 text-sm mb-2">{t.subtitle}</p>
          <Button variant="secondary" onClick={() => setRoute(AppRoute.HOME)}>
             {t.playAgain}
          </Button>
        </div>
        {/* Decorative background circle */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-700 rounded-full opacity-50 blur-2xl"></div>
      </div>
    </div>
  );
};