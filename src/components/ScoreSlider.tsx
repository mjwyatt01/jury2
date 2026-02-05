import { getScoreColor, getScoreBgColor } from '@/lib/juryUtils';

interface ScoreSliderProps {
  score: number;
  onChange: (score: number) => void;
}

export function ScoreSlider({ score, onChange }: ScoreSliderProps) {
  const scoreColor = getScoreColor(score);
  const scoreBg = getScoreBgColor(score);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-300">Juror Rating</label>
        <div className={`px-3 py-1.5 rounded-lg border ${scoreBg} ${scoreColor} font-bold text-lg min-w-[60px] text-center`}>
          {score}/10
        </div>
      </div>

      <div className="space-y-2">
        <input
          type="range"
          min="1"
          max="10"
          value={score}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-5
                     [&::-webkit-slider-thumb]:h-5
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-amber-500
                     [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-webkit-slider-thumb]:shadow-lg
                     [&::-webkit-slider-thumb]:border-2
                     [&::-webkit-slider-thumb]:border-slate-900
                     [&::-moz-range-thumb]:w-5
                     [&::-moz-range-thumb]:h-5
                     [&::-moz-range-thumb]:rounded-full
                     [&::-moz-range-thumb]:bg-amber-500
                     [&::-moz-range-thumb]:cursor-pointer
                     [&::-moz-range-thumb]:shadow-lg
                     [&::-moz-range-thumb]:border-2
                     [&::-moz-range-thumb]:border-slate-900
                     [&::-moz-range-thumb]:border-0"
        />

        <div className="flex justify-between text-[10px] text-slate-500 px-1">
          <span className="text-red-400">Low</span>
          <span className="text-amber-400">Medium</span>
          <span className="text-emerald-400">High</span>
        </div>
      </div>

      <div className="text-xs text-slate-400 leading-relaxed">
        <span className="text-emerald-400 font-semibold">8-10:</span> Favorable
        {' • '}
        <span className="text-amber-400 font-semibold">5-7:</span> Neutral
        {' • '}
        <span className="text-red-400 font-semibold">1-4:</span> Unfavorable
      </div>
    </div>
  );
}
