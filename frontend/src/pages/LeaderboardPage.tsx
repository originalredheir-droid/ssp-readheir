import { leaderboard } from "../data/mock";

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
          {leaderboard.map((entry) => (
            <div key={entry.rank} className="flex items-center justify-between rounded-3xl border border-slate-800 bg-[#0d0d0d] p-5">
              <div>
                <p className="text-sm text-slate-400">Rank {entry.rank}</p>
                <p className="mt-2 text-xl font-semibold text-white">{entry.name}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">{entry.points}</p>
                <p className={`mt-2 text-sm ${trendColor(entry.trend)}`}>{entry.trend.toUpperCase()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeaderboardPage;
