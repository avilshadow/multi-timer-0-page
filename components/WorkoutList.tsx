
import React from 'react';
import { Workout } from '../types';
import { Play, Edit2, Clock } from 'lucide-react';

interface Props {
  workouts: Workout[];
  onPlay: (w: Workout) => void;
  onEdit: (w: Workout) => void;
  theme: any;
}

const WorkoutList: React.FC<Props> = ({ workouts, onPlay, onEdit, theme }) => {
  const formatTotalTime = (workout: Workout) => {
    const totalSeconds = workout.steps.reduce((acc, s) => acc + (s.duration * s.repeats), 0);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 space-y-4">
      {workouts.length === 0 ? (
        <div className={`flex flex-col items-center justify-center py-20 ${theme.muted}`}>
          <div className="mb-4 opacity-20">
            <Clock size={64} />
          </div>
          <p className="text-xl font-bold">No flows yet</p>
          <p className="text-sm opacity-60">Tap + to create your first yoga sequence</p>
        </div>
      ) : (
        workouts.map((workout) => (
          <div 
            key={workout.id}
            onClick={() => onEdit(workout)}
            className={`group relative overflow-hidden rounded-[2.5rem] border-2 cursor-pointer ${theme.border} ${theme.surface} hover:shadow-2xl hover:border-purple-400/50 transition-all duration-300 active:scale-[0.98] outline-none`}
            role="button"
            tabIndex={0}
          >
            <div className="p-6 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-5">
                <div 
                  className="w-1.5 h-14 rounded-full shadow-lg" 
                  style={{ backgroundColor: workout.color }}
                ></div>
                <div>
                  <h3 className="font-black text-xl leading-tight">{workout.name || 'Untitled Routine'}</h3>
                  <div className={`flex items-center gap-3 mt-1 text-xs font-bold uppercase tracking-widest ${theme.muted}`}>
                    <span>{workout.steps.length} steps</span>
                    <span className="w-1 h-1 rounded-full bg-current opacity-30"></span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} strokeWidth={3} />
                      {formatTotalTime(workout)}
                    </span>
                  </div>
                </div>
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay(workout);
                }}
                className="p-5 rounded-[2rem] bg-purple-600 text-white hover:bg-purple-700 shadow-xl shadow-purple-500/30 transition-all active:scale-90 flex items-center justify-center"
                aria-label={`Start ${workout.name}`}
              >
                <Play size={24} fill="currentColor" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default WorkoutList;
