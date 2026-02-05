import type { StrikeTracker as StrikeTrackerType } from '@/types/jury';
import { getRemainingStrikes } from '@/lib/juryUtils';

interface StrikeTrackerProps {
  strikes: StrikeTrackerType;
}

export function StrikeTracker({ strikes }: StrikeTrackerProps) {
  const plaintiffRemaining = getRemainingStrikes(strikes, 'plaintiff');
  const defenseRemaining = getRemainingStrikes(strikes, 'defense');

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl border border-slate-600/40 p-5 shadow-2xl">
      <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Strike Tracker</h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Plaintiff Strikes */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase tracking-wide">Plaintiff</span>
          </div>

          <div className="space-y-2">
            {/* Peremptory Strikes */}
            <div className="bg-slate-900/50 rounded-lg p-3 border border-blue-500/30">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Peremptory</span>
                <span className={`text-lg font-bold ${plaintiffRemaining > 0 ? 'text-blue-400' : 'text-red-400'}`}>
                  {plaintiffRemaining}
                </span>
              </div>
              <div className="text-[10px] text-slate-500">
                {strikes.plaintiff.peremptory} of {strikes.plaintiff.maxPeremptory} used
              </div>
              <div className="mt-2 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${(strikes.plaintiff.peremptory / strikes.plaintiff.maxPeremptory) * 100}%` }}
                />
              </div>
            </div>

            {/* Cause Challenges */}
            <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-600/30">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">For Cause</span>
                <span className="text-lg font-bold text-slate-300">{strikes.plaintiff.cause}</span>
              </div>
              <div className="text-[10px] text-slate-500">Unlimited</div>
            </div>
          </div>
        </div>

        {/* Defense Strikes */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase tracking-wide">Defense</span>
          </div>

          <div className="space-y-2">
            {/* Peremptory Strikes */}
            <div className="bg-slate-900/50 rounded-lg p-3 border border-red-500/30">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Peremptory</span>
                <span className={`text-lg font-bold ${defenseRemaining > 0 ? 'text-red-400' : 'text-red-600'}`}>
                  {defenseRemaining}
                </span>
              </div>
              <div className="text-[10px] text-slate-500">
                {strikes.defense.peremptory} of {strikes.defense.maxPeremptory} used
              </div>
              <div className="mt-2 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 transition-all duration-300"
                  style={{ width: `${(strikes.defense.peremptory / strikes.defense.maxPeremptory) * 100}%` }}
                />
              </div>
            </div>

            {/* Cause Challenges */}
            <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-600/30">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">For Cause</span>
                <span className="text-lg font-bold text-slate-300">{strikes.defense.cause}</span>
              </div>
              <div className="text-[10px] text-slate-500">Unlimited</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
