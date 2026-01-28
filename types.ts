
export interface TimerStep {
  id: string;
  name: string;
  duration: number; // in seconds
  repeats: number;
}

export interface Workout {
  id: string;
  name: string;
  steps: TimerStep[];
  color: string;
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'zen';
  enableTTS: boolean;
  vibrateOnFinish: boolean;
  vibrateOnStep: boolean;
  soundEnabled: boolean;
  keepScreenOn: boolean;
}

export type Screen = 'home' | 'play' | 'edit' | 'settings' | 'about';
