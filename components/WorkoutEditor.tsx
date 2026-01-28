
import React, { useState } from 'react';
import { Workout, TimerStep } from '../types';
import { Save, Trash2, Plus, ChevronUp, ChevronDown, X, Clock } from 'lucide-react';

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
  // Ensuring initial step has an empty name
  const [steps, setSteps] = useState<TimerStep[]>(workout?.steps || [
    { id: Math.random().toString(), name: '', duration: 30, repeats: 1 }
  ]);

  const addStep = () => {
    // New steps strictly start with an empty string name
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
    <div className={`p-4 pb-24 space-y-6 ${theme.text}`}>
      {/* Routine Metadata */}
      <div className="space-y-4">
        <div>
          <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${theme.muted}`}>Routine Title</label>
          <input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full p-4 rounded-2xl ${theme.surface} border ${theme.border} focus:ring-2 focus:ring-purple-500 outline-none transition-all font-bold text-lg`}
            placeholder="e.g., Vinyasa Flow"
          />
        </div>

        <div>
          <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${theme.muted}`}>Theme Accent</label>
          <div className="flex gap-3">
            {['#a78bfa', '#818cf8', '#f472b6', '#34d399', '#fbbf24', '#f87171'].map(c => (
              <button 
                key={c}
                onClick={() => setColor(c)}
                className={`w-10 h-10 rounded-full border-2 transition-all active:scale-90 ${color === c ? 'border-white ring-4 ring-purple-500/30' : 'border-transparent opacity-60'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <label className={`block text-[10px] font-black uppercase tracking-[0.2em] ${theme.muted}`}>Sequence Steps</label>
          <button 
            onClick={addStep}
            className="text-xs font-black text-purple-500 flex items-center gap-1.5 hover:opacity-80 transition-opacity bg-purple-500/10 px-3 py-1.5 rounded-full"
          >
            <Plus size={14} strokeWidth={3} /> ADD NEW
          </button>
        </div>

        <div className="space-y-4">
          {steps.map((step, idx) => {
            const mins = Math.floor(step.duration / 60);
            const secs = step.duration % 60;

            return (
              <div key={step.id} className={`p-5 rounded-[2rem] ${theme.surface} border ${theme.border} space-y-5 shadow-sm hover:shadow-md transition-shadow`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <input 
                      value={step.name}
                      onChange={(e) => updateStep(step.id, { name: e.target.value })}
                      className="bg-transparent font-bold text-xl w-full outline-none border-b-2 border-transparent focus:border-purple-500 transition-colors py-1"
                      placeholder="Step name..."
                    />
                  </div>
                  <div className="flex items-center bg-black/5 rounded-xl p-1">
                    <button onClick={() => moveStep(idx, 'up')} className={`p-1.5 rounded-lg hover:bg-white/50 transition-colors ${idx === 0 ? 'opacity-20 pointer-events-none' : ''}`}><ChevronUp size={18} /></button>
                    <button onClick={() => moveStep(idx, 'down')} className={`p-1.5 rounded-lg hover:bg-white/50 transition-colors ${idx === steps.length - 1 ? 'opacity-20 pointer-events-none' : ''}`}><ChevronDown size={18} /></button>
                    <div className="w-px h-4 bg-black/10 mx-1"></div>
                    <button onClick={() => removeStep(step.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors"><Trash2 size={18} /></button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="relative">
                    <span className={`text-[9px] font-black ${theme.muted} block mb-2 uppercase tracking-tighter`}>Minutes</span>
                    <input 
                      type="number" 
                      min="0"
                      value={mins}
                      onChange={(e) => {
                        const val = Math.max(0, parseInt(e.target.value) || 0);
                        updateStep(step.id, { duration: (val * 60) + secs });
                      }}
                      className={`w-full p-3 rounded-2xl ${theme.bg} border ${theme.border} outline-none focus:ring-2 focus:ring-purple-500 font-bold text-center tabular-nums`}
                    />
                  </div>
                  <div className="relative">
                    <span className={`text-[9px] font-black ${theme.muted} block mb-2 uppercase tracking-tighter`}>Seconds</span>
                    <input 
                      type="number" 
                      min="0"
                      max="59"
                      value={secs}
                      onChange={(e) => {
                        const val = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
                        updateStep(step.id, { duration: (mins * 60) + val });
                      }}
                      className={`w-full p-3 rounded-2xl ${theme.bg} border ${theme.border} outline-none focus:ring-2 focus:ring-purple-500 font-bold text-center tabular-nums`}
                    />
                  </div>
                  <div className="relative">
                    <span className={`text-[9px] font-black ${theme.muted} block mb-2 uppercase tracking-tighter`}>Repeats</span>
                    <input 
                      type="number" 
                      min="1"
                      value={step.repeats}
                      onChange={(e) => updateStep(step.id, { repeats: Math.max(1, parseInt(e.target.value) || 1) })}
                      className={`w-full p-3 rounded-2xl ${theme.bg} border ${theme.border} outline-none focus:ring-2 focus:ring-purple-500 font-bold text-center tabular-nums`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Save / Delete Actions */}
      <div className="flex gap-4 pt-6 sticky bottom-4 z-20">
        {workout && (
          <button 
            onClick={() => onDelete(workout.id)}
            className="p-5 rounded-3xl border-2 border-red-200 text-red-500 font-black bg-white/90 backdrop-blur-lg hover:bg-red-50 transition-all active:scale-95 flex items-center justify-center gap-2"
            title="Delete Routine"
          >
            <Trash2 size={24} />
          </button>
        )}
        <button 
          onClick={handleSave}
          className={`p-5 rounded-3xl bg-purple-600 text-white font-black hover:bg-purple-700 shadow-2xl shadow-purple-500/40 transition-all active:scale-95 flex items-center justify-center gap-3 ${workout ? 'flex-1' : 'w-full'}`}
        >
          <Save size={24} />
          <span>SAVE ROUTINE</span>
        </button>
      </div>
    </div>
  );
};

export default WorkoutEditor;
