
import React, { useState, useEffect } from 'react';
import { Screen, Workout, AppSettings } from './types';
import { INITIAL_WORKOUTS, DEFAULT_SETTINGS, THEMES } from './constants';
import WorkoutList from './components/WorkoutList';
import WorkoutPlayer from './components/WorkoutPlayer';
import WorkoutEditor from './components/WorkoutEditor';
import Settings from './components/Settings';
import About from './components/About';
import { Settings as SettingsIcon, Plus, Info, ChevronLeft } from 'lucide-react';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    const saved = localStorage.getItem('zenflow_workouts');
    return saved ? JSON.parse(saved) : INITIAL_WORKOUTS;
  });
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('zenflow_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('zenflow_workouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('zenflow_settings', JSON.stringify(settings));
  }, [settings]);

  const currentTheme = THEMES[settings.theme];

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <WorkoutList 
            workouts={workouts} 
            onPlay={(w) => { setActiveWorkout(w); setCurrentScreen('play'); }}
            onEdit={(w) => { setActiveWorkout(w); setCurrentScreen('edit'); }}
            theme={currentTheme}
          />
        );
      case 'play':
        return activeWorkout ? (
          <WorkoutPlayer 
            workout={activeWorkout} 
            settings={settings}
            theme={currentTheme}
            onClose={() => setCurrentScreen('home')}
          />
        ) : null;
      case 'edit':
        return (
          <WorkoutEditor 
            workout={activeWorkout} 
            onSave={(w) => {
              const exists = workouts.find(prev => prev.id === w.id);
              if (exists) {
                setWorkouts(prev => prev.map(item => item.id === w.id ? w : item));
              } else {
                setWorkouts(prev => [...prev, w]);
              }
              setCurrentScreen('home');
            }}
            onDelete={(id) => {
              setWorkouts(prev => prev.filter(w => w.id !== id));
              setCurrentScreen('home');
            }}
            onCancel={() => setCurrentScreen('home')}
            theme={currentTheme}
          />
        );
      case 'settings':
        return (
          <Settings 
            settings={settings} 
            onUpdate={setSettings} 
            onBack={() => setCurrentScreen('home')}
            theme={currentTheme}
          />
        );
      case 'about':
        return (
          <About 
            onBack={() => setCurrentScreen('home')}
            theme={currentTheme}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} transition-colors duration-300 flex flex-col items-center`}>
      <div className="w-full max-w-md h-screen flex flex-col shadow-2xl relative overflow-hidden">
        {/* Header - Sticky */}
        {currentScreen !== 'play' && (
          <header className={`p-4 ${currentTheme.surface} border-b ${currentTheme.border} flex items-center justify-between sticky top-0 z-10`}>
            <div className="flex items-center gap-2">
              {currentScreen !== 'home' && (
                <button 
                  onClick={() => setCurrentScreen('home')}
                  className={`p-2 rounded-full hover:bg-black/10 transition-colors`}
                >
                  <ChevronLeft size={24} />
                </button>
              )}
              <h1 className="text-xl font-bold">ZenFlow</h1>
            </div>
            
            <div className="flex items-center gap-1">
              <button 
                onClick={() => { setActiveWorkout(null); setCurrentScreen('edit'); }}
                className="p-2 rounded-full hover:bg-black/10 transition-colors"
                title="Add Workout"
              >
                <Plus size={22} />
              </button>
              <button 
                onClick={() => setCurrentScreen('about')}
                className="p-2 rounded-full hover:bg-black/10 transition-colors"
                title="About"
              >
                <Info size={22} />
              </button>
              <button 
                onClick={() => setCurrentScreen('settings')}
                className="p-2 rounded-full hover:bg-black/10 transition-colors"
                title="Settings"
              >
                <SettingsIcon size={22} />
              </button>
            </div>
          </header>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar relative">
          {renderScreen()}
        </main>
      </div>
    </div>
  );
};

export default App;
