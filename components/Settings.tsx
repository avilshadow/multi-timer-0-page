
import React from 'react';
import { AppSettings } from '../types';
import { Moon, Sun, Wind, Bell, Volume2, ScreenShare, Smartphone } from 'lucide-react';

interface Props {
  settings: AppSettings;
  onUpdate: (s: AppSettings) => void;
  onBack: () => void;
  theme: any;
}

const Settings: React.FC<Props> = ({ settings, onUpdate, theme }) => {
  const toggle = (key: keyof AppSettings) => {
    onUpdate({ ...settings, [key]: !settings[key] });
  };

  const setTheme = (t: 'dark' | 'light' | 'zen') => {
    onUpdate({ ...settings, theme: t });
  };

  return (
    <div className="p-4 space-y-8">
      <section>
        <h3 className={`text-xs font-bold uppercase tracking-widest ${theme.muted} mb-4`}>Appearance</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'dark', icon: Moon, label: 'Dark' },
            { id: 'light', icon: Sun, label: 'Light' },
            { id: 'zen', icon: Wind, label: 'Zen' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id as any)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${settings.theme === t.id ? 'bg-purple-600 border-purple-600 text-white shadow-lg' : `${theme.surface} ${theme.border} hover:border-purple-400`}`}
            >
              <t.icon size={24} />
              <span className="text-xs font-bold">{t.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className={`text-xs font-bold uppercase tracking-widest ${theme.muted} mb-4`}>Preferences</h3>
        
        <div className={`p-4 rounded-2xl ${theme.surface} border ${theme.border} space-y-6 shadow-sm`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><Volume2 size={20} /></div>
              <div>
                <p className="font-semibold">Text-to-Speech</p>
                <p className={`text-xs ${theme.muted}`}>Announce step names</p>
              </div>
            </div>
            <input type="checkbox" checked={settings.enableTTS} onChange={() => toggle('enableTTS')} className="w-5 h-5 accent-purple-600" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500"><Bell size={20} /></div>
              <div>
                <p className="font-semibold">Sound Notifications</p>
                <p className={`text-xs ${theme.muted}`}>Chimes at transitions</p>
              </div>
            </div>
            <input type="checkbox" checked={settings.soundEnabled} onChange={() => toggle('soundEnabled')} className="w-5 h-5 accent-purple-600" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500"><Smartphone size={20} /></div>
              <div>
                <p className="font-semibold">Vibration</p>
                <p className={`text-xs ${theme.muted}`}>Haptic feedback on finish</p>
              </div>
            </div>
            <input type="checkbox" checked={settings.vibrateOnFinish} onChange={() => toggle('vibrateOnFinish')} className="w-5 h-5 accent-purple-600" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500"><ScreenShare size={20} /></div>
              <div>
                <p className="font-semibold">Keep Screen On</p>
                <p className={`text-xs ${theme.muted}`}>Prevent sleep during flow</p>
              </div>
            </div>
            <input type="checkbox" checked={settings.keepScreenOn} onChange={() => toggle('keepScreenOn')} className="w-5 h-5 accent-purple-600" />
          </div>
        </div>
      </section>

      <div className={`text-center py-6 border-t ${theme.border}`}>
        <p className={`text-xs ${theme.muted}`}>ZenFlow v1.0.0</p>
      </div>
    </div>
  );
};

export default Settings;
