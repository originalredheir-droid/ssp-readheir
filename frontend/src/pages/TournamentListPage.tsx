import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTournaments } from "../api/tournaments";
import type { Tournament } from "../types";

const TournamentListPage = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTournaments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTournaments({ search: search || undefined, status: statusFilter || undefined });
      setTournaments(data);
    } catch {
      setError("Unable to load tournaments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTournaments();
  }, [search, statusFilter]);

  return (
    <section className="space-y-6">
      <div className="rounded-[32px] border border-slate-800 bg-[#181818] p-6 shadow-lg shadow-black/20">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Tournaments</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Manage brackets</h1>
            <p className="mt-2 text-slate-400">Your tenant tournaments are loaded from the backend.</p>
          </div>
          <Link
            to="/bracket"
            className="rounded-2xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            View bracket
          </Link>
        </div>
        <div className="mt-6 grid gap-4 rounded-[32px] border border-slate-800 bg-[#0f1725] p-6 shadow-lg shadow-black/20">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Search tournaments</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-3xl border border-slate-700 bg-[#111827] px-4 py-3 text-white outline-none focus:border-cyan-400"
              placeholder="Search by name or description"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-3xl border border-slate-700 bg-[#111827] px-4 py-3 text-white outline-none"
            >
              <option value="">All statuses</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="live">Live</option>
              <option value="completed">Completed</option>
            </select>
          </label>
        </div>
      </div>
      <div className="mt-6 grid gap-4">
          {loading ? (
            <div className="rounded-3xl border border-slate-800 bg-[#0d0d0d] p-6 text-center text-slate-300">
              Loading tournaments...
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-rose-500 bg-[#0d0d0d] p-6 text-center text-rose-300">
              {error}
            </div>
          ) : tournaments.length === 0 ? (
            <div className="rounded-3xl border border-slate-800 bg-[#0d0d0d] p-6 text-center text-slate-300">
              No tournaments found for your organization.
            </div>
          ) : (
            tournaments.map((tournament) => (
              <div key={tournament.id} className="rounded-3xl border border-slate-800 bg-[#0d0d0d] p-6 transition hover:border-cyan-400/30">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-white">{tournament.name}</p>
                    <p className="mt-2 text-sm text-slate-400">{tournament.description}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-slate-900 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-300">
                      {tournament.status}
                    </span>
                    <Link
                      to="/bracket"
                      className="rounded-2xl border border-cyan-500/20 px-4 py-2 text-sm text-cyan-300 hover:bg-slate-900"
                    >
                      Open bracket
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default TournamentListPage;
