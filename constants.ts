
import { Workout, AppSettings } from './types';

export const INITIAL_WORKOUTS: Workout[] = [
  {
    id: '1',
    name: 'Morning Sun Salutation',
    color: '#a78bfa',
    steps: [
      { id: 's1', name: 'Mountain Pose', duration: 15, repeats: 1 },
      { id: 's2', name: 'Forward Fold', duration: 10, repeats: 2 },
      { id: 's3', name: 'Plank', duration: 20, repeats: 1 },
      { id: 's4', name: 'Cobra', duration: 15, repeats: 1 },
      { id: 's5', name: 'Downward Dog', duration: 30, repeats: 1 },
    ]
  },
  {
    id: '2',
    name: 'Evening Box Breathing',
    color: '#818cf8',
    steps: [
      { id: 'b1', name: 'Inhale', duration: 4, repeats: 4 },
      { id: 'b2', name: 'Hold', duration: 4, repeats: 4 },
      { id: 'b3', name: 'Exhale', duration: 4, repeats: 4 },
      { id: 'b4', name: 'Hold', duration: 4, repeats: 4 },
    ]
  },
  {
    id: '3',
    name: 'Core Focus',
    color: '#f472b6',
    steps: [
      { id: 'c1', name: 'Plank Hold', duration: 60, repeats: 1 },
      { id: 'c2', name: 'Rest', duration: 15, repeats: 1 },
      { id: 'c3', name: 'Side Plank (L)', duration: 45, repeats: 1 },
      { id: 'c4', name: 'Side Plank (R)', duration: 45, repeats: 1 },
    ]
  }
];

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  enableTTS: true,
  vibrateOnFinish: true,
  vibrateOnStep: true,
  soundEnabled: true,
  keepScreenOn: true,
};

export const THEMES = {
  dark: {
    bg: 'bg-zinc-950',
    surface: 'bg-zinc-900',
    text: 'text-zinc-100',
    muted: 'text-zinc-400',
    border: 'border-zinc-800',
    accent: 'bg-purple-500',
    accentText: 'text-purple-400'
  },
  light: {
    bg: 'bg-zinc-50',
    surface: 'bg-white',
    text: 'text-zinc-900',
    muted: 'text-zinc-500',
    border: 'border-zinc-200',
    accent: 'bg-purple-600',
    accentText: 'text-purple-600'
  },
  zen: {
    bg: 'bg-stone-100',
    surface: 'bg-stone-50',
    text: 'text-stone-800',
    muted: 'text-stone-500',
    border: 'border-stone-200',
    accent: 'bg-emerald-600',
    accentText: 'text-emerald-700'
  }
};
