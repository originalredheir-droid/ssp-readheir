import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchMatch } from "../api/matches";
import type { Match } from "../types";

const MatchDetailPage = () => {
  const { id } = useParams();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMatch = async () => {
    setLoading(true);
    setError(null);
    if (!id) {
      setError("Match ID is missing.");
      setLoading(false);
      return;
    }

    try {
      const data = await fetchMatch(id);
      setMatch(data);
    } catch {
      setError("Unable to load match details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatch();
    const interval = window.setInterval(loadMatch, 8000);
    return () => window.clearInterval(interval);
  }, [id]);

  if (loading) {
    return <p className="text-slate-300">Loading match details...</p>;
  }

  if (error || !match) {
    return <p className="text-rose-400">{error ?? "Match not found."}</p>;
  }

  return (
    <section className="rounded-[32px] border border-slate-800 bg-[#181818] p-6 shadow-lg shadow-black/20">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Match</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">{match.home_team} vs {match.away_team}</h1>
        </div>
        <div className="rounded-3xl bg-slate-900 px-4 py-2 text-sm text-slate-300">{match.status}</div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-[#0d0d0d] p-6">
          <p className="text-sm text-slate-400">Home score</p>
          <p className="mt-3 text-4xl font-semibold text-white">{match.home_score}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-[#0d0d0d] p-6">
          <p className="text-sm text-slate-400">Away score</p>
          <p className="mt-3 text-4xl font-semibold text-white">{match.away_score}</p>
        </div>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto]">
        <div className="rounded-3xl border border-slate-800 bg-[#121212] p-6">
          <h2 className="text-lg font-semibold text-white">Match notes</h2>
          <p className="mt-3 text-slate-400">This match is loaded from your backend and is tenant-isolated by auth.</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-[#121212] p-6 text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Referee controls</p>
          <Link
            to={`/scoring?matchId=${match.id}`}
            className="mt-4 inline-flex rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Open scoring panel
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MatchDetailPage;
