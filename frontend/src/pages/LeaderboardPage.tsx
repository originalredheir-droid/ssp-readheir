import { useEffect, useState } from "react";
import { fetchLeaderboard } from "../api/leaderboard";
import type { LeaderboardEntry } from "../types";

const trendColor = (trend: string) => {
  switch (trend) {
    case "up":
      return "text-emerald-400";
    case "down":
      return "text-rose-400";
    default:
      return "text-slate-400";
  }
};

const LeaderboardPage = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard()
      .then((data) => setEntries(data))
      .catch(() => setError("Unable to load leaderboard."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="space-y-6">
      <div className="rounded-[32px] border border-slate-800 bg-[#181818] p-6 shadow-lg shadow-black/20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Leaderboard</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Top teams right now</h1>
          </div>
          <div className="rounded-3xl bg-slate-900 px-4 py-3 text-sm text-slate-300">Updated moments ago</div>
        </div>
        <div className="mt-8 grid gap-4">
          {loading ? (
            <div className="rounded-3xl border border-slate-800 bg-[#0d0d0d] p-8 text-center text-slate-300">
              Loading leaderboard...
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-rose-500 bg-[#0d0d0d] p-8 text-center text-rose-300">
              {error}
            </div>
          ) : entries.length === 0 ? (
            <div className="rounded-3xl border border-slate-800 bg-[#0d0d0d] p-8 text-center text-slate-300">
              No leaderboard data available.
            </div>
          ) : (
            entries.map((entry) => (
              <div key={entry.rank} className="flex items-center justify-between rounded-3xl border border-slate-800 bg-[#0d0d0d] p-5">
                <div>
                  <p className="text-sm text-slate-400">Rank {entry.rank}</p>
                  <p className="mt-2 text-xl font-semibold text-white">{entry.name}</p>
                  <p className="mt-1 text-sm text-slate-400">{entry.played} matches • {entry.wins}W {entry.draws}D {entry.losses}L</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">{entry.points}</p>
                  <p className={`mt-2 text-sm ${trendColor(entry.goal_difference > 0 ? "up" : entry.goal_difference < 0 ? "down" : "flat")}`}>
                    GD {entry.goal_difference}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default LeaderboardPage;
