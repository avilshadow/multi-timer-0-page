
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Workout, AppSettings } from '../types';
import { X, Play, Pause, SkipForward, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface Props {
  workout: Workout;
  settings: AppSettings;
  theme: any;
  onClose: () => void;
}

const WorkoutPlayer: React.FC<Props> = ({ workout, settings, theme, onClose }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [currentRepeat, setCurrentRepeat] = useState(1);
  const [timeLeft, setTimeLeft] = useState(workout.steps[0].duration);
  const [isActive, setIsActive] = useState(true);
  const [muted, setMuted] = useState(!settings.soundEnabled);

  const currentStep = workout.steps[currentStepIdx];
  const progress = ((currentStep.duration - timeLeft) / currentStep.duration) * 100;
  const timerRef = useRef<number | null>(null);
  const wakeLockRef = useRef<any>(null);

  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
        }
      } catch (err) {
        console.warn(`Wake Lock error: ${err}`);
      }
    };

    const releaseWakeLock = async () => {
      if (wakeLockRef.current) {
        try {
          await wakeLockRef.current.release();
          wakeLockRef.current = null;
        } catch (err) {
          console.warn(`Wake Lock release error: ${err}`);
        }
      }
    };

    if (isActive) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isActive) {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      releaseWakeLock();
    };
  }, [isActive]);

  const speak = useCallback((text: string) => {
    if (!settings.enableTTS || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  }, [settings.enableTTS]);

  const playChime = useCallback(() => {
    if (muted) return;
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.connect(gain);
      gain.connect(context.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, context.currentTime);
      gain.gain.setValueAtTime(0, context.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, context.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
      osc.start();
      osc.stop(context.currentTime + 0.6);
    } catch (e) {
      console.warn("Audio Context blocked", e);
    }
  }, [muted]);

  // Handle TTS and Round Transition Announcements
  useEffect(() => {
    if (isActive && currentStep) {
      const stepName = currentStep.name || `Step ${currentStepIdx + 1}`;
      const roundLabel = currentStep.repeats > 1 ? `, round ${currentRepeat}` : '';
      speak(`Next: ${stepName}${roundLabel}`);
    }
  }, [currentStepIdx, currentRepeat, settings.enableTTS, isActive]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      playChime();
      if (currentRepeat < currentStep.repeats) {
        setCurrentRepeat(prev => prev + 1);
        setTimeLeft(currentStep.duration);
      } else if (currentStepIdx < workout.steps.length - 1) {
        const nextIdx = currentStepIdx + 1;
        setCurrentStepIdx(nextIdx);
        setCurrentRepeat(1);
        setTimeLeft(workout.steps[nextIdx].duration);
      } else {
        setIsActive(false);
        speak("Workout complete. Well done.");
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, currentStep, currentRepeat, currentStepIdx, workout, playChime, speak]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setCurrentStepIdx(0);
    setCurrentRepeat(1);
    setTimeLeft(workout.steps[0].duration);
    setTimeout(() => setIsActive(true), 150);
  };

  const skipStep = () => {
    if (currentStepIdx < workout.steps.length - 1) {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      setCurrentRepeat(1);
      setTimeLeft(workout.steps[nextIdx].duration);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${theme.bg} ${theme.text}`}>
      <div className="p-4 flex items-center justify-between">
        <button onClick={onClose} className="p-2 hover:bg-black/10 rounded-full transition-colors" aria-label="Exit">
          <X size={24} />
        </button>
        <div className="text-center flex-1">
          <h2 className="text-lg font-bold truncate max-w-[200px] mx-auto">{workout.name}</h2>
          <p className={`text-[10px] font-black tracking-widest ${theme.muted} uppercase`}>Step {currentStepIdx + 1} / {workout.steps.length}</p>
        </div>
        <button onClick={() => setMuted(!muted)} className="p-2 hover:bg-black/10 rounded-full transition-colors">
          {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-12">
        <div className="w-full max-w-sm flex flex-col gap-4">
          {workout.steps.map((step, idx) => {
            const isCurrent = idx === currentStepIdx;
            if (idx < currentStepIdx - 1 || idx > currentStepIdx + 2) return null;

            return (
              <div
                key={step.id}
                className={`relative overflow-hidden rounded-[2.5rem] border transition-all duration-700 ${isCurrent ? 'h-64' : 'h-20'} ${isCurrent ? `border-purple-500/50 ${theme.surface} shadow-2xl` : `${theme.border} opacity-40 scale-95`}`}
              >
                {isCurrent && (
                  <div
                    className="absolute inset-0 bg-purple-500/10 origin-left transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  ></div>
                )}

                <div className="relative h-full flex flex-col items-center justify-center px-8 text-center">
                  {isCurrent ? (
                    <>
                      <span className="text-2xl font-medium mb-1">{step.name || 'Relax...'}</span>
                      <span className="text-8xl font-black tracking-tighter tabular-nums text-purple-500">
                        {formatTime(timeLeft)}
                      </span>
                      {step.repeats > 1 && (
                        <div className="mt-4 text-[10px] font-black bg-purple-600 text-white px-5 py-1.5 rounded-full uppercase tracking-[0.2em]">
                          Round {currentRepeat} / {step.repeats}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full flex justify-between items-center opacity-80">
                      <span className="font-bold text-lg">{step.name || `Step ${idx + 1}`}</span>
                      <span className={`text-sm font-black ${theme.muted}`}>{formatTime(step.duration)}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-12">
          <button onClick={resetTimer} className={`p-5 rounded-full border ${theme.border} hover:bg-black/5 active:scale-90 transition-all`}><RotateCcw size={32} /></button>
          <button onClick={toggleTimer} className={`w-28 h-28 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 ${isActive ? 'bg-zinc-800 text-white shadow-zinc-500/20' : 'bg-purple-600 text-white shadow-purple-500/40'}`}>
            {isActive ? <Pause size={56} fill="currentColor" /> : <Play size={56} fill="currentColor" className="ml-2" />}
          </button>
          <button onClick={skipStep} className={`p-5 rounded-full border ${theme.border} hover:bg-black/5 active:scale-90 transition-all`}><SkipForward size={32} /></button>
        </div>
      </div>

      <div className={`p-8 ${theme.surface} border-t ${theme.border} rounded-t-[40px] shadow-2xl`}>
        <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme.muted} mb-3`}>Up Next</p>
        {currentStepIdx < workout.steps.length - 1 ? (
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">{workout.steps[currentStepIdx + 1].name || `Step ${currentStepIdx + 2}`}</span>
            <span className={`text-sm font-black ${theme.muted}`}>{formatTime(workout.steps[currentStepIdx + 1].duration)}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-purple-500 font-bold"><span className="text-xl italic opacity-70">Finish Line</span></div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPlayer;
