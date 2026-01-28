
import React, { useState } from 'react';
import { Workout, TimerStep } from '../types';
import { Save, Trash2, Plus, ChevronUp, ChevronDown, X } from 'lucide-react';

interface Props {
  workout: Workout | null;
  onSave: (w: Workout) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
  theme: any;
}

const WorkoutEditor: React.FC<Props> = ({ workout, onSave, onDelete, onCancel, theme }) => {
  const [name, setName] = useState(workout?.name || '');
  const [color, setColor] = useState(workout?.color || '#a78bfa');
  const [steps, setSteps] = useState<TimerStep[]>(workout?.steps || [
    { id: Math.random().toString(), name: '', duration: 30, repeats: 1 }
  ]);

  const addStep = () => {
    setSteps([...steps, { id: Math.random().toString(), name: '', duration: 30, repeats: 1 }]);
  };

  const removeStep = (id: string) => {
    if (steps.length > 1) {
      setSteps(steps.filter(s => s.id !== id));
    }
  };

  const updateStep = (id: string, updates: Partial<TimerStep>) => {
    setSteps(steps.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const moveStep = (idx: number, direction: 'up' | 'down') => {
    const newSteps = [...steps];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx >= 0 && targetIdx < newSteps.length) {
      [newSteps[idx], newSteps[targetIdx]] = [newSteps[targetIdx], newSteps[idx]];
      setSteps(newSteps);
    }
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: workout?.id || Math.random().toString(),
      name,
      color,
      steps
    });
  };

  return (
    <div className={`p-4 pb-20 space-y-6 ${theme.text}`}>
      <div className="space-y-4">
        <div>
          <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${theme.muted}`}>Routine Name</label>
          <input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full p-4 rounded-xl ${theme.surface} border ${theme.border} focus:ring-2 focus:ring-purple-500 outline-none transition-all`}
            placeholder="e.g., Daily Yoga Flow"
          />
        </div>

        <div>
          <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${theme.muted}`}>Theme Color</label>
          <div className="flex gap-2">
            {['#a78bfa', '#818cf8', '#f472b6', '#34d399', '#fbbf24'].map(c => (
              <button 
                key={c}
                onClick={() => setColor(c)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${color === c ? 'border-white ring-2 ring-purple-500' : 'border-transparent'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className={`block text-xs font-bold uppercase tracking-wider ${theme.muted}`}>Steps & Timers</label>
          <button 
            onClick={addStep}
            className="text-xs font-bold text-purple-500 flex items-center gap-1 hover:underline"
          >
            <Plus size={14} /> ADD STEP
          </button>
        </div>

        <div className="space-y-3">
          {steps.map((step, idx) => {
            const mins = Math.floor(step.duration / 60);
            const secs = step.duration % 60;

            return (
              <div key={step.id} className={`p-4 rounded-2xl ${theme.surface} border ${theme.border} space-y-4 shadow-sm group`}>
                <div className="flex items-start justify-between gap-3">
                  <input 
                    value={step.name}
                    onChange={(e) => updateStep(step.id, { name: e.target.value })}
                    className="bg-transparent font-semibold flex-1 outline-none border-b border-transparent focus:border-purple-500"
                    placeholder="Pose/Step name (e.g. Inhale)"
                  />
                  <div className="flex gap-1">
                    <button onClick={() => moveStep(idx, 'up')} className={`p-1 rounded hover:bg-black/5 ${theme.muted}`} disabled={idx === 0}><ChevronUp size={16} /></button>
                    <button onClick={() => moveStep(idx, 'down')} className={`p-1 rounded hover:bg-black/5 ${theme.muted}`} disabled={idx === steps.length - 1}><ChevronDown size={16} /></button>
                    <button onClick={() => removeStep(step.id)} className="p-1 rounded hover:bg-red-50 text-red-400"><X size={16} /></button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <span className={`text-[10px] font-bold ${theme.muted} block mb-1`}>MINUTES</span>
                    <input 
                      type="number" 
                      min="0"
                      value={mins}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        updateStep(step.id, { duration: (val * 60) + secs });
                      }}
                      className={`w-full p-2 rounded-lg ${theme.bg} border ${theme.border} outline-none focus:ring-1 focus:ring-purple-500`}
                    />
                  </div>
                  <div>
                    <span className={`text-[10px] font-bold ${theme.muted} block mb-1`}>SECONDS</span>
                    <input 
                      type="number" 
                      min="0"
                      max="59"
                      value={secs}
                      onChange={(e) => {
                        const val = Math.min(59, parseInt(e.target.value) || 0);
                        updateStep(step.id, { duration: (mins * 60) + val });
                      }}
                      className={`w-full p-2 rounded-lg ${theme.bg} border ${theme.border} outline-none focus:ring-1 focus:ring-purple-500`}
                    />
                  </div>
                  <div>
                    <span className={`text-[10px] font-bold ${theme.muted} block mb-1`}>REPEATS</span>
                    <input 
                      type="number" 
                      min="1"
                      value={step.repeats}
                      onChange={(e) => updateStep(step.id, { repeats: Math.max(1, parseInt(e.target.value) || 1) })}
                      className={`w-full p-2 rounded-lg ${theme.bg} border ${theme.border} outline-none focus:ring-1 focus:ring-purple-500`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3 pt-4 sticky bottom-4 z-20">
        {workout && (
          <button 
            onClick={() => onDelete(workout.id)}
            className="flex-1 p-4 rounded-2xl border border-red-200 text-red-500 font-bold bg-white/80 backdrop-blur-md hover:bg-red-50 transition-all flex items-center justify-center gap-2"
          >
            <Trash2 size={20} /> DELETE
          </button>
        )}
        <button 
          onClick={handleSave}
          className={`p-4 rounded-2xl bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-xl shadow-purple-500/20 transition-all flex items-center justify-center gap-2 ${workout ? 'flex-[2]' : 'w-full'}`}
        >
          <Save size={20} /> SAVE ROUTINE
        </button>
      </div>
    </div>
  );
};

export default WorkoutEditor;
