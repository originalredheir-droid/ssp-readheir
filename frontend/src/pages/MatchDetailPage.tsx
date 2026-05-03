import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { matches } from "../data/mock";
import { Match } from "../types";

const MatchDetailPage = () => {
  const { id } = useParams();
  const [match, setMatch] = useState<Match | null>(null);

  useEffect(() => {
    if (id) {
      const matchRecord = matches.find((item) => item.id === id) || null;
      setMatch(matchRecord);
    }
  }, [id]);

  if (!match) {
    return <p className="text-slate-400">Match not found.</p>;
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
      <div className="mt-8 rounded-3xl border border-slate-800 bg-[#121212] p-6">
        <h2 className="text-lg font-semibold text-white">Match notes</h2>
        <p className="mt-3 text-slate-400">Live scoring interface, referee controls, and match metadata will appear here in the next phase.</p>
      </div>
    </section>
  );
};

export default MatchDetailPage;
