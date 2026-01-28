
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
  const [steps, setSteps] = useState<TimerStep[]>(workout?.steps || [
    { id: Math.random().toString(), name: '', duration: 30, repeats: 1 }
  ]);

  const addStep = () => {
    // New step always starts with an empty name
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
    <div className={`p-4 pb-32 space-y-8 ${theme.text}`}>
      {/* Header Section */}
      <div className="space-y-4">
        <div>
          <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${theme.muted}`}>Flow Name</label>
          <input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full p-5 rounded-3xl ${theme.surface} border-2 ${theme.border} focus:border-purple-500 outline-none transition-all font-bold text-xl placeholder:opacity-30`}
            placeholder="e.g., Sunset Vinyasa"
          />
        </div>

        <div>
          <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${theme.muted}`}>Theme Color</label>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {['#a78bfa', '#818cf8', '#f472b6', '#34d399', '#fbbf24', '#f87171'].map(c => (
              <button 
                key={c}
                onClick={() => setColor(c)}
                className={`w-12 h-12 rounded-full border-4 flex-shrink-0 transition-all active:scale-90 ${color === c ? 'border-white ring-4 ring-purple-500/20' : 'border-transparent opacity-50'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <label className={`block text-[10px] font-black uppercase tracking-widest ${theme.muted}`}>Sequence</label>
          <button 
            onClick={addStep}
            className="text-xs font-black text-purple-500 flex items-center gap-1.5 hover:opacity-80 transition-opacity bg-purple-500/10 px-4 py-2 rounded-full"
          >
            <Plus size={14} strokeWidth={3} /> ADD STEP
          </button>
        </div>

        <div className="space-y-4">
          {steps.map((step, idx) => {
            const mins = Math.floor(step.duration / 60);
            const secs = step.duration % 60;

            return (
              <div key={step.id} className={`p-6 rounded-[2.5rem] ${theme.surface} border-2 ${theme.border} space-y-6 shadow-sm relative group`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <input 
                      value={step.name}
                      onChange={(e) => updateStep(step.id, { name: e.target.value })}
                      className="bg-transparent font-bold text-xl w-full outline-none border-b-2 border-transparent focus:border-purple-500 transition-colors py-1"
                      placeholder="Pose or action name..."
                    />
                  </div>
                  <div className="flex items-center gap-1 bg-black/5 rounded-2xl p-1">
                    <button onClick={() => moveStep(idx, 'up')} className={`p-2 rounded-xl hover:bg-white transition-colors ${idx === 0 ? 'opacity-20 pointer-events-none' : ''}`}><ChevronUp size={18} /></button>
                    <button onClick={() => moveStep(idx, 'down')} className={`p-2 rounded-xl hover:bg-white transition-colors ${idx === steps.length - 1 ? 'opacity-20 pointer-events-none' : ''}`}><ChevronDown size={18} /></button>
                    <div className="w-px h-5 bg-black/10 mx-1"></div>
                    <button onClick={() => removeStep(step.id)} className="p-2 rounded-xl hover:bg-red-50 text-red-400"><X size={18} /></button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-[2] flex gap-2">
                    <div className="flex-1">
                      <span className={`text-[9px] font-black ${theme.muted} block mb-1.5 uppercase tracking-tighter`}>Minutes</span>
                      <div className="relative">
                        <input 
                          type="number" 
                          min="0"
                          value={mins}
                          onChange={(e) => {
                            const val = Math.max(0, parseInt(e.target.value) || 0);
                            updateStep(step.id, { duration: (val * 60) + secs });
                          }}
                          className={`w-full p-4 pr-10 rounded-2xl ${theme.bg} border ${theme.border} outline-none focus:ring-2 focus:ring-purple-500 font-bold text-center tabular-nums`}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black opacity-20">m</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <span className={`text-[9px] font-black ${theme.muted} block mb-1.5 uppercase tracking-tighter`}>Seconds</span>
                      <div className="relative">
                        <input 
                          type="number" 
                          min="0"
                          max="59"
                          value={secs}
                          onChange={(e) => {
                            const val = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
                            updateStep(step.id, { duration: (mins * 60) + val });
                          }}
                          className={`w-full p-4 pr-10 rounded-2xl ${theme.bg} border ${theme.border} outline-none focus:ring-2 focus:ring-purple-500 font-bold text-center tabular-nums`}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black opacity-20">s</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className={`text-[9px] font-black ${theme.muted} block mb-1.5 uppercase tracking-tighter`}>Repeats</span>
                    <input 
                      type="number" 
                      min="1"
                      value={step.repeats}
                      onChange={(e) => updateStep(step.id, { repeats: Math.max(1, parseInt(e.target.value) || 1) })}
                      className={`w-full p-4 rounded-2xl ${theme.bg} border ${theme.border} outline-none focus:ring-2 focus:ring-purple-500 font-bold text-center tabular-nums`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-6 flex gap-4 bg-gradient-to-t from-black/5 to-transparent backdrop-blur-sm z-30">
        <div className="max-w-md w-full mx-auto flex gap-4">
          {workout && (
            <button 
              onClick={() => onDelete(workout.id)}
              className="p-5 rounded-[2rem] border-2 border-red-200 text-red-500 font-black bg-white shadow-xl active:scale-95 transition-all flex items-center justify-center"
            >
              <Trash2 size={24} />
            </button>
          )}
          <button 
            onClick={handleSave}
            className={`p-5 rounded-[2rem] bg-purple-600 text-white font-black hover:bg-purple-700 shadow-2xl shadow-purple-500/40 transition-all active:scale-95 flex items-center justify-center gap-3 ${workout ? 'flex-1' : 'w-full'}`}
          >
            <Save size={24} />
            <span>SAVE ROUTINE</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutEditor;
