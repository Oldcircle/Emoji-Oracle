import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Home } from './views/Home';
import { Game } from './views/Game';
import { Dashboard } from './views/Dashboard';
import { Settings } from './views/Settings';
import { AppRoute, GameTopic, GameStats, SettingsState, Language, ModelConfig } from './types';
import { PROVIDER_DEFAULTS } from './constants';

const INITIAL_STATS: GameStats = {
  totalGames: 0,
  totalWins: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalScore: 0,
};

const DEFAULT_CONFIG: ModelConfig = {
  id: 'default-gemini',
  name: 'Default (Gemini)',
  provider: 'google',
  apiKey: '', // Uses env
  baseUrl: '', 
  modelName: PROVIDER_DEFAULTS.google.defaultModel
};

const INITIAL_SETTINGS: SettingsState = {
  language: Language.EN,
  creativity: 0.7,
  modelConfigs: [DEFAULT_CONFIG],
  activeConfigId: 'default-gemini',
};

const App: React.FC = () => {
  const [route, setRoute] = useState<AppRoute>(AppRoute.HOME);
  const [topic, setTopic] = useState<GameTopic>(GameTopic.MOVIES);
  
  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const saved = localStorage.getItem('emoji_oracle_stats');
      return saved ? JSON.parse(saved) : INITIAL_STATS;
    } catch { return INITIAL_STATS; }
  });
  
  const [settings, setSettings] = useState<SettingsState>(() => {
    try {
      const saved = localStorage.getItem('emoji_oracle_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Migration: Ensure new fields exist if loading old settings
        if (!parsed.modelConfigs) return { ...parsed, modelConfigs: [DEFAULT_CONFIG], activeConfigId: DEFAULT_CONFIG.id };
        return parsed;
      }
      return INITIAL_SETTINGS;
    } catch { return INITIAL_SETTINGS; }
  });

  useEffect(() => {
    localStorage.setItem('emoji_oracle_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('emoji_oracle_settings', JSON.stringify(settings));
  }, [settings]);

  const handleWin = () => {
    setStats(prev => ({
      ...prev,
      totalGames: prev.totalGames + 1,
      totalWins: prev.totalWins + 1,
      currentStreak: prev.currentStreak + 1,
      bestStreak: Math.max(prev.bestStreak, prev.currentStreak + 1),
      totalScore: prev.totalScore + 100, // Basic score increment
    }));
  };

  const updateSettings = (newSettings: Partial<SettingsState>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <Layout>
      {route === AppRoute.HOME && (
        <Home setRoute={setRoute} setTopic={setTopic} lang={settings.language} />
      )}
      {route === AppRoute.GAME && (
        <Game 
          topic={topic} 
          settings={settings} 
          setRoute={setRoute} 
          onWin={handleWin}
        />
      )}
      {route === AppRoute.DASHBOARD && (
        <Dashboard stats={stats} setRoute={setRoute} lang={settings.language} />
      )}
      {route === AppRoute.SETTINGS && (
        <Settings 
          settings={settings} 
          updateSettings={updateSettings} 
          setRoute={setRoute} 
        />
      )}
    </Layout>
  );
};

export default App;