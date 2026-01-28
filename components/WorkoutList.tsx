
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
            onClick={() => onPlay(workout)}
            className={`group relative overflow-hidden rounded-2xl border cursor-pointer ${theme.border} ${theme.surface} hover:shadow-lg transition-all duration-300 active:scale-[0.98]`}
          >
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`${theme.accent} w-1.5 h-12 rounded-full`} style={{ backgroundColor: workout.color }}></div>
                <div>
                  <h3 className="font-bold text-lg">{workout.name}</h3>
                  <p className={`text-xs ${theme.muted}`}>
                    {workout.steps.length} steps • {Math.round(workout.steps.reduce((acc, s) => acc + (s.duration * s.repeats), 0) / 60)} min
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(workout);
                  }}
                  className={`p-3 rounded-xl ${theme.bg} ${theme.text} hover:opacity-80 transition-all border ${theme.border}`}
                  title="Edit Routine"
                >
                  <Edit2 size={18} />
                </button>
                <div 
                  className="p-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700 shadow-md transition-all"
                >
                  <Play size={18} fill="currentColor" />
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default WorkoutList;
