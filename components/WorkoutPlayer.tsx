
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
  // Start the timer automatically when entering the player screen
  const [isActive, setIsActive] = useState(true);
  const [muted, setMuted] = useState(!settings.soundEnabled);
  
  const currentStep = workout.steps[currentStepIdx];
  const progress = ((currentStep.duration - timeLeft) / currentStep.duration) * 100;

  const speak = useCallback((text: string) => {
    if (!settings.enableTTS || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }, [settings.enableTTS]);

  const playChime = useCallback(() => {
    if (muted) return;
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
  }, [muted]);

  // Handle TTS announcements for step changes AND repetition cycles
  useEffect(() => {
    if (settings.enableTTS && currentStep) {
      let message = '';
      if (currentRepeat > 1) {
        // Announcement for repeated timer cycles
        message = `${currentStep.name}, round ${currentRepeat}`;
      } else {
        // Announcement for new steps
        message = `Next: ${currentStep.name}`;
      }
      speak(message);
    }
  }, [currentStepIdx, currentRepeat, settings.enableTTS, currentStep, speak]);

  useEffect(() => {
    let timer: any;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      playChime();
      if (currentRepeat < currentStep.repeats) {
        // Trigger same step repetition
        setCurrentRepeat(prev => prev + 1);
        setTimeLeft(currentStep.duration);
      } else if (currentStepIdx < workout.steps.length - 1) {
        // Move to the next unique step
        const nextIdx = currentStepIdx + 1;
        setCurrentStepIdx(nextIdx);
        setCurrentRepeat(1);
        setTimeLeft(workout.steps[nextIdx].duration);
      } else {
        // Routine completion
        setIsActive(false);
        speak("Workout complete. Well done.");
      }
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, currentStep, currentRepeat, currentStepIdx, workout, playChime, speak]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setCurrentStepIdx(0);
    setCurrentRepeat(1);
    setTimeLeft(workout.steps[0].duration);
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
      {/* Top Bar */}
      <div className="p-4 flex items-center justify-between">
        <button onClick={onClose} className="p-2 hover:bg-black/10 rounded-full transition-colors">
          <X size={24} />
        </button>
        <div className="text-center flex-1">
          <h2 className="text-lg font-bold">{workout.name}</h2>
          <p className={`text-xs ${theme.muted}`}>Step {currentStepIdx + 1} of {workout.steps.length}</p>
        </div>
        <button onClick={() => setMuted(!muted)} className="p-2 hover:bg-black/10 rounded-full transition-colors">
          {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      </div>

      {/* Main Display Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-12">
        {/* Step Indicator Stack */}
        <div className="w-full flex flex-col gap-2 overflow-hidden">
          {workout.steps.map((step, idx) => {
            const isCurrent = idx === currentStepIdx;
            // Only show neighboring steps to keep focus
            if (idx < currentStepIdx - 1 || idx > currentStepIdx + 2) return null;

            return (
              <div 
                key={step.id} 
                className={`relative overflow-hidden rounded-2xl border transition-all duration-500 ${isCurrent ? 'h-52' : 'h-16'} ${isCurrent ? `border-purple-500/50 ${theme.surface}` : `${theme.border} opacity-50`}`}
              >
                {/* Visual Progress Overlay */}
                {isCurrent && (
                  <div 
                    className="absolute inset-0 bg-purple-500/10 origin-left transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  ></div>
                )}

                <div className={`relative h-full flex flex-col items-center justify-center px-6`}>
                   {isCurrent ? (
                     <>
                      <span className="text-3xl font-light mb-1 text-center">{step.name}</span>
                      <span className="text-7xl font-bold tracking-tighter tabular-nums">
                        {formatTime(timeLeft)}
                      </span>
                      {step.repeats > 1 && (
                        <div className="mt-2 text-sm font-medium bg-purple-500 text-white px-3 py-0.5 rounded-full">
                          Repeat {currentRepeat} / {step.repeats}
                        </div>
                      )}
                     </>
                   ) : (
                     <div className="w-full flex justify-between items-center">
                        <span className="font-medium">{step.name}</span>
                        <span className={`text-sm ${theme.muted}`}>{formatTime(step.duration)}</span>
                     </div>
                   )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-8">
          <button 
            onClick={resetTimer}
            className={`p-4 rounded-full border ${theme.border} hover:bg-black/5 transition-all`}
            title="Reset Workout"
          >
            <RotateCcw size={28} />
          </button>
          
          <button 
            onClick={toggleTimer}
            className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 ${isActive ? 'bg-zinc-800 text-white' : 'bg-purple-600 text-white shadow-purple-500/50'}`}
          >
            {isActive ? <Pause size={42} fill="currentColor" /> : <Play size={42} fill="currentColor" className="ml-2" />}
          </button>

          <button 
            onClick={skipStep}
            className={`p-4 rounded-full border ${theme.border} hover:bg-black/5 transition-all`}
            title="Skip Step"
          >
            <SkipForward size={28} />
          </button>
        </div>
      </div>

      {/* Up Next Preview */}
      <div className={`p-6 ${theme.surface} border-t ${theme.border}`}>
        <p className={`text-xs font-bold uppercase tracking-widest ${theme.muted} mb-2`}>Coming Up</p>
        {currentStepIdx < workout.steps.length - 1 ? (
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">{workout.steps[currentStepIdx + 1].name}</span>
            <span className={`text-sm ${theme.muted}`}>{formatTime(workout.steps[currentStepIdx + 1].duration)}</span>
          </div>
        ) : (
          <span className="text-lg font-medium italic opacity-50">End of session</span>
        )}
      </div>
    </div>
  );
};

export default WorkoutPlayer;
