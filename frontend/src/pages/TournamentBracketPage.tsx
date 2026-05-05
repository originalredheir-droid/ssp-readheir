import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTournaments } from "../api/tournaments";
import { fetchMatches } from "../api/matches";
import type { Match, Tournament } from "../types";

const phaseLabel = {
  live: "Live",
  scheduled: "Upcoming",
  completed: "Completed",
} as const;

const TournamentBracketPage = () => {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBracket = async () => {
    setLoading(true);
    setError(null);

    try {
      const [tournaments, allMatches] = await Promise.all([fetchTournaments(), fetchMatches()]);
      const selected = tournaments.find((item) => item.status === "live") || tournaments[0] || null;
      setTournament(selected);
      setMatches(selected ? allMatches.filter((match) => match.tournament === selected.id) : []);
    } catch {
      setError("Unable to load bracket data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBracket();
    const interval = window.setInterval(loadBracket, 10000);
    return () => window.clearInterval(interval);
  }, []);

  const schedule = useMemo(() => {
    return matches.reduce<Record<string, Match[]>>((acc, match) => {
      const key = match.status || "scheduled";
      acc[key] = [...(acc[key] || []), match];
      return acc;
    }, {});
  }, [matches]);

  return (
    <section className="min-h-screen space-y-8 pb-12">
      <div className="rounded-[32px] border border-slate-800 bg-[#181818] p-8 shadow-lg shadow-black/20">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-3 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-2 text-sm uppercase tracking-[0.25em] text-cyan-300">
              <span>Official Circuit</span>
              <span className="text-slate-500">{tournament?.status?.toUpperCase() ?? "LIVE"}</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {tournament?.name ?? "Tournament Bracket"}
              </h1>
              <p className="mt-3 text-slate-400 sm:text-lg">
                {tournament?.description ?? "View live bracket progress, match results, and referee scoring for your current tournament."}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-800 bg-[#0f1725] p-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Dates</p>
                <p className="mt-2 text-white">{tournament?.starts_at ? new Date(tournament.starts_at).toLocaleDateString() : "TBD"}</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-[#0f1725] p-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Status</p>
                <p className="mt-2 text-white">{tournament?.status?.toUpperCase() ?? "LIVE"}</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-[#0f1725] p-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Matches</p>
                <p className="mt-2 text-white">{matches.length}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <button className="rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Export intel
            </button>
            <button className="rounded-3xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
              View live feed
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto px-2">
        <div className="inline-flex min-w-full gap-8 py-8">
          {(["live", "scheduled", "completed"] as const).map((phase) => (
            <div key={phase} className="min-w-[300px] space-y-6">
              <div className="border-l-2 border-slate-700 pl-4">
                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">{phaseLabel[phase]} Bracket</p>
              </div>
              {loading ? (
                <div className="rounded-3xl border border-slate-800 bg-[#0d0d0d] p-6 text-center text-slate-300">
                  Loading...
                </div>
              ) : error ? (
                <div className="rounded-3xl border border-rose-500 bg-[#0d0d0d] p-6 text-center text-rose-300">
                  {error}
                </div>
              ) : !schedule[phase]?.length ? (
                <div className="rounded-3xl border border-slate-800 bg-[#0d0d0d] p-6 text-center text-slate-500">
                  No {phaseLabel[phase].toLowerCase()} matches
                </div>
              ) : (
                schedule[phase].map((match) => (
                  <Link
                    key={match.id}
                    to={`/matches/${match.id}`}
                    className="group relative block rounded-[28px] border border-slate-800 bg-[#111827] p-5 transition hover:border-cyan-400/40 hover:bg-slate-900"
                  >
                    <div className="flex items-center justify-between gap-3 text-slate-400 text-xs uppercase tracking-[0.25em]">
                      <span>Match ID {match.id}</span>
                      <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] text-cyan-300">
                        {match.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Home</p>
                          <p className="mt-2 text-lg font-bold uppercase tracking-tight text-white">{match.home_team}</p>
                        </div>
                        <p className="text-3xl font-black text-cyan-300">{match.home_score}</p>
                      </div>
                      <div className="flex items-center justify-between opacity-80">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Away</p>
                          <p className="mt-2 text-lg font-bold uppercase tracking-tight text-slate-200">{match.away_team}</p>
                        </div>
                        <p className="text-3xl font-black text-white">{match.away_score}</p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TournamentBracketPage;
