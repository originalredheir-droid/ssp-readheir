import { tournaments } from "../data/mock";

const TournamentBracketPage = () => {
  const tournament = tournaments[0];

  return (
    <section className="space-y-6">
      <div className="rounded-[32px] border border-slate-800 bg-[#181818] p-6 shadow-lg shadow-black/20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Bracket view</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">{tournament.name}</h1>
            <p className="mt-2 text-slate-400">{tournament.description}</p>
          </div>
          <div className="rounded-3xl bg-slate-900 px-4 py-3 text-sm text-slate-300">Live bracket</div>
        </div>
      </div>
      <div className="overflow-x-auto rounded-[32px] border border-slate-800 bg-[#131313] p-6 shadow-lg shadow-black/20">
        <div className="min-w-[900px] grid gap-8 lg:grid-cols-[minmax(260px,1fr)_minmax(260px,1fr)_minmax(260px,1fr)]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-[#0d0d0d] p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Quarter Finals</p>
              <div className="mt-5 space-y-4">
                <div className="rounded-3xl bg-slate-950 p-4">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>#01 NAVI TACTICAL</span>
                    <span className="font-bold text-cyan-300">13</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-slate-200">
                    <span>#08 OMEGA OPS</span>
                    <span>09</span>
                  </div>
                </div>
                <div className="rounded-3xl bg-[#121212] p-4 border border-slate-800">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>#04 SENTINEL GHOST</span>
                    <span>11</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-slate-200">
                    <span>#05 FNATIC ELITE</span>
                    <span className="text-amber-300 font-semibold">13</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-[#0d0d0d] p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Semi Finals</p>
              <div className="mt-5 space-y-4">
                <div className="rounded-3xl bg-slate-950 p-4">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>Winner Match 1</span>
                    <span className="font-semibold text-white">TBD</span>
                  </div>
                </div>
                <div className="rounded-3xl bg-[#121212] p-4 border border-slate-800">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>Winner Match 2</span>
                    <span className="font-semibold text-white">TBD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-[#0d0d0d] p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Final</p>
              <div className="mt-6 rounded-3xl bg-slate-950 p-6 text-center">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Pending championship</p>
                <p className="mt-4 text-2xl font-bold text-white">Winner of semi finals</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TournamentBracketPage;
