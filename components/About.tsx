
import React from 'react';
import { Heart, CheckCircle2, Star } from 'lucide-react';

interface Props {
  onBack: () => void;
  theme: any;
}

const About: React.FC<Props> = ({ theme }) => {
  return (
    <div className="p-6 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-block p-4 rounded-3xl bg-purple-500 text-white shadow-xl shadow-purple-500/30 mb-2">
          <Wind size={48} />
        </div>
        <h2 className="text-3xl font-bold">ZenFlow</h2>
        <p className={`${theme.muted}`}>A mindful approach to your practice.</p>
      </div>

      <div className="space-y-6">
        <div className={`p-5 rounded-2xl ${theme.surface} border ${theme.border} shadow-sm`}>
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Heart size={18} className="text-red-400" /> The Philosophy
          </h3>
          <p className={`text-sm leading-relaxed ${theme.muted}`}>
            ZenFlow was designed for practitioners who value rhythm and focus. Unlike standard kitchen timers, 
            it handles complex sequences, allowing you to focus entirely on your breath and body.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {[
            { title: 'Custom Flows', text: 'Build multi-step routines for yoga, HIIT, or meditation.' },
            { title: 'Audio Cues', text: 'Professional TTS voices and high-frequency chimes.' },
            { title: 'Zen Mode', text: 'Special light-stone theme for minimal distractions.' }
          ].map((item, i) => (
            <div key={i} className="flex gap-4">
              <div className="mt-1"><CheckCircle2 size={18} className="text-green-500" /></div>
              <div>
                <h4 className="font-semibold text-sm">{item.title}</h4>
                <p className={`text-xs ${theme.muted}`}>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`p-6 rounded-2xl bg-purple-600 text-white text-center space-y-2`}>
        <div className="flex justify-center gap-1 mb-2">
          {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
        </div>
        <p className="font-bold">Loved by practitioners worldwide</p>
        <p className="text-xs opacity-80">Start your journey today.</p>
      </div>
    </div>
  );
};

const Wind = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.8 19.6a2 2 0 1 0-1.8-3.2" />
    <path d="M2 17.5a2.5 2.5 0 1 1 2-4.5h15" />
    <path d="M12.7 9.1a2 2 0 1 1 1.7 3.3" />
    <path d="M8 5.5a2.5 2.5 0 1 1 2 4.5h12" />
  </svg>
);

export default About;
