import React, { useState } from 'react';
import { Button } from '../components/Button';
import { AppRoute, Language, SettingsState, ModelConfig, ModelProvider } from '../types';
import { UI_TEXT, PROVIDER_DEFAULTS } from '../constants';

interface SettingsProps {
  settings: SettingsState;
  updateSettings: (newSettings: Partial<SettingsState>) => void;
  setRoute: (route: AppRoute) => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, updateSettings, setRoute }) => {
  const t = UI_TEXT[settings.language];
  const mt = t.modelConfig;
  
  const [editingId, setEditingId] = useState<string | null>(settings.activeConfigId);

  // Helper to safely get the editing config
  const activeConfig = settings.modelConfigs.find(c => c.id === editingId) || null;

  const handleAddConfig = () => {
    const newId = `custom-${Date.now()}`;
    const newConfig: ModelConfig = {
      id: newId,
      name: 'New Config',
      provider: 'openai',
      apiKey: '',
      baseUrl: PROVIDER_DEFAULTS.openai.baseUrl,
      modelName: PROVIDER_DEFAULTS.openai.defaultModel,
    };
    updateSettings({
      modelConfigs: [...settings.modelConfigs, newConfig],
      activeConfigId: newId
    });
    setEditingId(newId);
  };

  const handleUpdateConfig = (key: keyof ModelConfig, value: string) => {
    if (!activeConfig) return;
    
    // Auto-update base URL if provider changes
    let updates: Partial<ModelConfig> = { [key]: value };
    if (key === 'provider') {
      const provider = value as ModelProvider;
      updates.baseUrl = PROVIDER_DEFAULTS[provider].baseUrl;
      updates.modelName = PROVIDER_DEFAULTS[provider].defaultModel;
    }

    const updatedConfigs = settings.modelConfigs.map(c => 
      c.id === editingId ? { ...c, ...updates } : c
    );
    updateSettings({ modelConfigs: updatedConfigs });
  };

  const handleDeleteConfig = (id: string) => {
    if (settings.modelConfigs.length <= 1) return; // Prevent deleting last config
    const filtered = settings.modelConfigs.filter(c => c.id !== id);
    updateSettings({ 
      modelConfigs: filtered,
      activeConfigId: filtered[0].id 
    });
    setEditingId(filtered[0].id);
  };

  return (
    <div className="flex flex-col gap-6 w-full h-[80vh] min-h-[600px] fade-in">
       {/* Top Bar */}
       <div className="flex items-center justify-between shrink-0">
         <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setRoute(AppRoute.HOME)}>←</Button>
            <h2 className="text-2xl font-bold text-slate-800">{t.settingsTitle}</h2>
         </div>
       </div>

       {/* Main Split Layout */}
       <div className="flex flex-1 bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
         
         {/* LEFT SIDEBAR: Config List */}
         <div className="w-1/3 md:w-64 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
               <h3 className="font-bold text-slate-700">{mt.configList}</h3>
               <button onClick={handleAddConfig} className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-lg hover:bg-indigo-200 font-bold">+</button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
               {settings.modelConfigs.map(config => (
                 <div 
                   key={config.id}
                   onClick={() => {
                     setEditingId(config.id);
                     updateSettings({ activeConfigId: config.id });
                   }}
                   className={`p-3 rounded-xl cursor-pointer transition-all border-l-4 ${
                     editingId === config.id 
                       ? 'bg-white shadow-sm border-indigo-500' 
                       : 'border-transparent hover:bg-slate-100'
                   }`}
                 >
                   <div className="font-bold text-slate-800 truncate">{config.name}</div>
                   <div className="text-xs text-slate-400 truncate">{PROVIDER_DEFAULTS[config.provider]?.label}</div>
                 </div>
               ))}
            </div>
         </div>

         {/* RIGHT CONTENT: Form */}
         <div className="flex-1 overflow-y-auto p-6 bg-white relative">
            {activeConfig ? (
              <div className="space-y-6 max-w-lg mx-auto">
                 <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <h3 className="text-xl font-bold text-slate-800">
                       <span className="text-indigo-600 mr-2">⚙️</span>
                       {mt.title}
                    </h3>
                    <button 
                      onClick={() => setRoute(AppRoute.HOME)}
                      className="text-slate-400 hover:text-indigo-600"
                    >
                      ✕
                    </button>
                 </div>

                 {/* Basic App Settings (Language/Creativity) */}
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">{t.language}</label>
                      <select 
                        value={settings.language}
                        onChange={(e) => updateSettings({ language: e.target.value as Language })}
                        className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-sm"
                      >
                        <option value={Language.EN}>English</option>
                        <option value={Language.CN}>中文 (简体)</option>
                      </select>
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">
                         {t.creativity}: {settings.creativity}
                       </label>
                       <input
                        type="range"
                        min="0.2"
                        max="1.0"
                        step="0.1"
                        value={settings.creativity}
                        onChange={(e) => updateSettings({ creativity: parseFloat(e.target.value) })}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>
                 </div>

                 <hr className="border-slate-100" />

                 {/* Model Config Fields */}
                 <div className="space-y-4">
                    
                    {/* Config Name */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">{mt.name}</label>
                      <input 
                        type="text" 
                        value={activeConfig.name}
                        onChange={(e) => handleUpdateConfig('name', e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                      />
                    </div>

                    {/* Provider */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">{mt.provider}</label>
                      <select
                        value={activeConfig.provider}
                        onChange={(e) => handleUpdateConfig('provider', e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none bg-white"
                      >
                         {Object.keys(PROVIDER_DEFAULTS).map(key => (
                           <option key={key} value={key}>{PROVIDER_DEFAULTS[key as ModelProvider].label}</option>
                         ))}
                      </select>
                    </div>

                    {/* API Key */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">{mt.apiKey}</label>
                      <input 
                        type="password" 
                        value={activeConfig.apiKey}
                        placeholder={mt.apiKeyPlaceholder}
                        onChange={(e) => handleUpdateConfig('apiKey', e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none font-mono text-sm"
                      />
                      <p className="text-xs text-slate-400 mt-1 ml-1">{mt.apiKeyPlaceholder}</p>
                    </div>

                    {/* Base URL */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">{mt.baseUrl}</label>
                      <input 
                        type="text" 
                        value={activeConfig.baseUrl}
                        onChange={(e) => handleUpdateConfig('baseUrl', e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none font-mono text-sm text-slate-600"
                      />
                    </div>

                    {/* Model Name */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">{mt.modelName}</label>
                      <input 
                        type="text" 
                        value={activeConfig.modelName}
                        onChange={(e) => handleUpdateConfig('modelName', e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none font-mono text-sm"
                      />
                    </div>

                 </div>

                 {/* Footer Actions */}
                 <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                    {settings.modelConfigs.length > 1 && (
                      <button 
                        onClick={() => handleDeleteConfig(activeConfig.id)}
                        className="text-rose-500 text-sm font-bold hover:underline"
                      >
                        {mt.delete}
                      </button>
                    )}
                    <Button onClick={() => setRoute(AppRoute.HOME)}>
                      {mt.save}
                    </Button>
                 </div>

              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">
                {mt.selectPrompt}
              </div>
            )}
         </div>
       </div>
    </div>
  );
};