
import React from 'react';
import { Workout } from '../types';
import { Play, Edit2 } from 'lucide-react';

interface Props {
  workouts: Workout[];
  onPlay: (w: Workout) => void;
  onEdit: (w: Workout) => void;
  theme: any;
}

const WorkoutList: React.FC<Props> = ({ workouts, onPlay, onEdit, theme }) => {
  return (
    <div className="p-4 space-y-4">
      {workouts.length === 0 ? (
        <div className={`flex flex-col items-center justify-center py-20 ${theme.muted}`}>
          <p className="text-lg">No routines yet.</p>
          <p className="text-sm">Click + to create your first flow.</p>
        </div>
      ) : (
        workouts.map((workout) => (
          <div 
            key={workout.id}
            onClick={() => onEdit(workout)}
            className={`group relative overflow-hidden rounded-2xl border cursor-pointer ${theme.border} ${theme.surface} hover:shadow-xl hover:border-purple-400/50 transition-all duration-300 active:scale-[0.99] focus-within:ring-2 focus-within:ring-purple-500 outline-none`}
            role="button"
            aria-label={`Edit ${workout.name}`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onEdit(workout);
              }
            }}
          >
            <div className="p-5 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className={`${theme.accent} w-1.5 h-12 rounded-full shadow-sm`} style={{ backgroundColor: workout.color }}></div>
                <div>
                  <h3 className="font-bold text-lg">{workout.name}</h3>
                  <p className={`text-xs ${theme.muted}`}>
                    {workout.steps.length} steps • {Math.round(workout.steps.reduce((acc, s) => acc + (s.duration * s.repeats), 0) / 60)} min
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${theme.muted}`}>
                  <Edit2 size={16} />
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // Crucial: Prevents triggering the card's onEdit
                    onPlay(workout);
                  }}
                  className="p-4 rounded-2xl bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-500/20 transition-all active:scale-90 flex items-center justify-center"
                  title="Run Workout"
                  aria-label={`Run ${workout.name}`}
                >
                  <Play size={20} fill="currentColor" />
                </button>
              </div>
            </div>
            
            {/* Subtle background gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </div>
        ))
      )}
    </div>
  );
};

export default WorkoutList;
