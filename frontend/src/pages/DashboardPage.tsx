import { useEffect, useState } from "react";
import MetricCard from "../components/MetricCard";
import { fetchTournaments } from "../api/tournaments";
import { fetchMatches } from "../api/matches";

const DashboardPage = () => {
  const [tournamentCount, setTournamentCount] = useState(0);
  const [liveMatchCount, setLiveMatchCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchTournaments(), fetchMatches()])
      .then(([tournaments, matches]) => {
        setTournamentCount(tournaments.length);
        setLiveMatchCount(matches.filter((match) => match.status === "live").length);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="space-y-6">
      <div className="rounded-[32px] border border-slate-800 bg-[#181818] p-6 shadow-lg shadow-black/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Overview</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Tenant dashboard</h1>
            <p className="mt-2 text-slate-400">Monitor tournaments, match status, and player verification at a glance.</p>
          </div>
          <div className="rounded-3xl bg-slate-900 px-4 py-3 text-sm text-slate-300">Live analytics</div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Active tournaments"
          value={loading ? "Loading..." : tournamentCount}
          accent="text-cyan-300"
        />
        <MetricCard
          label="Live matches"
          value={loading ? "Loading..." : liveMatchCount}
          accent="text-emerald-400"
        />
        <MetricCard label="Verified players" value="TBD" accent="text-amber-300" />
        <MetricCard label="Leaderboard refresh" value="Realtime" />
      </div>
    </section>
  );
};

export default DashboardPage;
