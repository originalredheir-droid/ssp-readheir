import { Link } from "react-router-dom";
import { tournaments } from "../data/mock";

const TournamentListPage = () => {
  return (
    <section className="space-y-6">
      <div className="rounded-[32px] border border-slate-800 bg-[#181818] p-6 shadow-lg shadow-black/20">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Tournaments</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Manage brackets</h1>
          </div>
          <Link
            to="/bracket"
            className="rounded-2xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            View bracket
          </Link>
        </div>
        <div className="mt-6 grid gap-4">
          {tournaments.map((tournament) => (
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default TournamentListPage;
