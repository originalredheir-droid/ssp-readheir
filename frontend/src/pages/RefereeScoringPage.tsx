import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchMatch, fetchMatches, updateMatch } from "../api/matches";
import type { Match } from "../types";

const RefereeScoringPage = () => {
  const [searchParams] = useSearchParams();
  const matchId = searchParams.get("matchId");
  const [match, setMatch] = useState<Match | null>(null);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [status, setStatus] = useState("live");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadMatch = async () => {
    setLoading(true);
    setError(null);

    try {
      if (matchId) {
        const data = await fetchMatch(matchId);
        setMatch(data);
        setHomeScore(data.home_score);
        setAwayScore(data.away_score);
        setStatus(data.status);
      } else {
        const allMatches = await fetchMatches();
        const liveMatch = allMatches.find((item) => item.status === "live") || allMatches[0] || null;
        if (!liveMatch) {
          setError("No match available for scoring.");
          return;
        }
        setMatch(liveMatch);
        setHomeScore(liveMatch.home_score);
        setAwayScore(liveMatch.away_score);
        setStatus(liveMatch.status);
      }
    } catch {
      setError("Unable to load referee match session.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatch();
    const interval = window.setInterval(loadMatch, 10000);
    return () => window.clearInterval(interval);
  }, [matchId]);

  const saveScore = async () => {
    if (!match) return;
    setSaving(true);
    setMessage(null);
    try {
      const updated = await updateMatch(match.id, {
        home_score: homeScore,
        away_score: awayScore,
        status,
      });
      setMatch(updated);
      setMessage("Match score updated successfully.");
    } catch {
      setMessage("Unable to update match. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-slate-300">Loading referee scoring session...</p>;
  }

  if (error || !match) {
    return <p className="text-rose-400">{error ?? "Match not found."}</p>;
  }

  return (
    <main className="space-y-8">
      <section className="rounded-[32px] border border-slate-800 bg-[#181818] p-6 shadow-lg shadow-black/20">
        <div className="mb-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Match Command</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Live referee interface</h1>
            <p className="mt-2 max-w-2xl text-slate-400">Update scores, log events, and monitor the live match state from a single referee dashboard.</p>
          </div>
          <div className="rounded-3xl bg-slate-900 px-4 py-3 text-sm text-slate-300">Verified session</div>
        </div>
        <div className="grid gap-6 rounded-[28px] border border-slate-800 bg-[#0d0d0d] p-8 xl:grid-cols-[1fr_auto_1fr]">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Home squad</p>
            <h2 className="mt-3 text-3xl font-bold text-white">{match.home_team}</h2>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 rounded-3xl bg-[#131313] p-6">
            <div className="text-center">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Score</p>
              <p className="mt-2 text-6xl font-black text-cyan-300">{homeScore} - {awayScore}</p>
            </div>
            <div className="rounded-full bg-slate-900 px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-300">{match.status.toUpperCase()}</div>
          </div>
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Away squad</p>
            <h2 className="mt-3 text-3xl font-bold text-white">{match.away_team}</h2>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-[32px] border border-slate-800 bg-[#181818] p-6 shadow-lg shadow-black/20">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Score management</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Live score controls</h2>
            </div>
            <span className="rounded-full bg-slate-900 px-3 py-2 text-sm text-slate-300">{match.status.toUpperCase()}</span>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-slate-800 bg-[#0d0d0d] p-6">
              <span className="text-xs uppercase tracking-[0.18em] text-slate-400">{match.home_team}</span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setHomeScore(Math.max(0, homeScore - 1))}
                  className="h-16 w-16 rounded-3xl bg-slate-900 text-2xl text-white transition hover:bg-slate-800"
                  type="button"
                >
                  -
                </button>
                <span className="text-5xl font-black text-white">{homeScore}</span>
                <button
                  onClick={() => setHomeScore(homeScore + 1)}
                  className="h-16 w-16 rounded-3xl bg-cyan-500 text-3xl font-bold text-slate-950 transition hover:bg-cyan-400"
                  type="button"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-slate-800 bg-[#0d0d0d] p-6">
              <span className="text-xs uppercase tracking-[0.18em] text-slate-400">{match.away_team}</span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setAwayScore(Math.max(0, awayScore - 1))}
                  className="h-16 w-16 rounded-3xl bg-slate-900 text-2xl text-white transition hover:bg-slate-800"
                  type="button"
                >
                  -
                </button>
                <span className="text-5xl font-black text-white">{awayScore}</span>
                <button
                  onClick={() => setAwayScore(awayScore + 1)}
                  className="h-16 w-16 rounded-3xl bg-cyan-500 text-3xl font-bold text-slate-950 transition hover:bg-cyan-400"
                  type="button"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 rounded-3xl border border-slate-800 bg-[#131313] p-6">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Status</span>
              <select
                className="rounded-2xl bg-[#111111] px-3 py-2 text-white outline-none"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="scheduled">Scheduled</option>
                <option value="live">Live</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <button
              onClick={saveScore}
              disabled={saving}
              className="mt-4 rounded-3xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-40"
              type="button"
            >
              {saving ? "Saving..." : "Save match update"}
            </button>
            {message ? <p className="mt-3 text-sm text-cyan-300">{message}</p> : null}
          </div>
        </div>

        <aside className="space-y-6 rounded-[32px] border border-slate-800 bg-[#181818] p-6 shadow-lg shadow-black/20">
          <div>
            <h2 className="text-sm uppercase tracking-[0.24em] text-cyan-300">Event logger</h2>
            <p className="mt-2 text-slate-400">Quick actions for referee events and card tracking.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: "Yellow card", color: "bg-amber-400/10 text-amber-300" },
              { label: "Red card", color: "bg-rose-500/10 text-rose-300" },
              { label: "Foul", color: "bg-slate-700/10 text-slate-200" },
              { label: "Substitute", color: "bg-cyan-500/10 text-cyan-300" },
            ].map((item) => (
              <button
                key={item.label}
                className={`rounded-3xl border border-slate-800 bg-[#0d0d0d] p-5 text-left transition hover:border-cyan-400/40 ${item.color}`}
                type="button"
              >
                <div className="text-sm font-bold uppercase tracking-[0.18em]">{item.label}</div>
                <div className="mt-2 text-xs text-slate-300">Tap to record event</div>
              </button>
            ))}
          </div>
          <div className="rounded-3xl border border-slate-800 bg-[#131313] p-5">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-400">
              <span>Crowd sentiment</span>
              <span className="font-semibold text-cyan-300">78% tactical</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full w-[78%] bg-cyan-300"></div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default RefereeScoringPage;
