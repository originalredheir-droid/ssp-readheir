import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMatches } from "../api/matches";
import type { Match } from "../types";

const statusOptions = ["", "scheduled", "live", "completed", "cancelled"];

const MatchListPage = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMatches({
        search: search || undefined,
        status: statusFilter || undefined,
        team: teamFilter || undefined,
      });
      setMatches(data);
    } catch {
      setError("Unable to load match results.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, [search, statusFilter, teamFilter]);

  return (
    <section className="space-y-6">
      <div className="rounded-[32px] border border-slate-800 bg-[#181818] p-6 shadow-lg shadow-black/20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Matches</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Search and filter matches</h1>
            <p className="mt-2 text-slate-400">Search by team, status, or tournament to find your tenant match lineup.</p>
          </div>
          <Link
            to="/bracket"
            className="rounded-3xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Open bracket
          </Link>
        </div>
      </div>

      <div className="grid gap-4 rounded-[32px] border border-slate-800 bg-[#0f1725] p-6 shadow-lg shadow-black/20 sm:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm uppercase tracking-[0.24em] text-slate-400">Search</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-3xl border border-slate-700 bg-[#111827] px-4 py-3 text-white outline-none focus:border-cyan-400"
            placeholder="Search team or tournament"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm uppercase tracking-[0.24em] text-slate-400">Status</span>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="w-full rounded-3xl border border-slate-700 bg-[#111827] px-4 py-3 text-white outline-none"
          >
            {statusOptions.map((statusOption) => (
              <option key={statusOption} value={statusOption}>
                {statusOption ? statusOption : "All statuses"}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm uppercase tracking-[0.24em] text-slate-400">Team</span>
          <input
            value={teamFilter}
            onChange={(event) => setTeamFilter(event.target.value)}
            className="w-full rounded-3xl border border-slate-700 bg-[#111827] px-4 py-3 text-white outline-none focus:border-cyan-400"
            placeholder="Filter by team"
          />
        </label>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="rounded-3xl border border-slate-800 bg-[#0d0d0d] p-6 text-center text-slate-300">Loading matches...</div>
        ) : error ? (
          <div className="rounded-3xl border border-rose-500 bg-[#0d0d0d] p-6 text-center text-rose-300">{error}</div>
        ) : matches.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-[#0d0d0d] p-6 text-center text-slate-400">No matches found.</div>
        ) : (
          <div className="grid gap-4">
            {matches.map((match) => (
              <Link
                key={match.id}
                to={`/matches/${match.id}`}
                className="rounded-[28px] border border-slate-800 bg-[#111827] p-6 transition hover:border-cyan-400/40 hover:bg-slate-900"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{match.status}</p>
                    <h2 className="mt-2 text-xl font-semibold text-white">{match.home_team} vs {match.away_team}</h2>
                    <p className="mt-2 text-sm text-slate-400">Starts at: {match.starts_at ? new Date(match.starts_at).toLocaleString() : "TBD"}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900 px-4 py-2 text-sm text-cyan-300">
                    {match.home_score} - {match.away_score}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MatchListPage;
