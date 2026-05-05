import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import MetricCard from "../components/MetricCard";
import { fetchTournaments } from "../api/tournaments";
import { fetchMatches } from "../api/matches";

const DashboardPage = () => {
  const { user } = useAuth();
  const [tournamentCount, setTournamentCount] = useState(0);
  const [liveMatchCount, setLiveMatchCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refreshStats = async () => {
    setLoading(true);
    try {
      const [tournaments, matches] = await Promise.all([fetchTournaments(), fetchMatches()]);
      setTournamentCount(tournaments.length);
      setLiveMatchCount(matches.filter((match) => match.status === "live").length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshStats();
    const interval = window.setInterval(refreshStats, 10000);
    return () => window.clearInterval(interval);
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
        {user?.organization?.subscription_status !== "active" ? (
          <div className="mt-6 rounded-3xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
            Your tenant billing is not active. Complete subscription setup under Billing to enable full organizer workflows.
          </div>
        ) : null}
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
