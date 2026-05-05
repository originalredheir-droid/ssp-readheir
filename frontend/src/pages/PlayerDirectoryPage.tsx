import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPlayers } from "../api/players";
import type { Player } from "../types";

const PlayerDirectoryPage = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [search, setSearch] = useState("");
  const [team, setTeam] = useState("");
  const [position, setPosition] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPlayers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPlayers({
        search: search || undefined,
        team: team || undefined,
        position: position || undefined,
      });
      setPlayers(data);
    } catch {
      setError("Unable to load players.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlayers();
  }, [search, team, position]);

  return (
    <section className="space-y-6">
      <div className="rounded-[32px] border border-slate-800 bg-[#181818] p-6 shadow-lg shadow-black/20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Players</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Roster directory</h1>
            <p className="mt-2 text-slate-400">Search players by name, team, or position in your tenant roster.</p>
          </div>
          <Link
            to="/players"
            className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
          >
            Browse all players
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
            placeholder="Name or team"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm uppercase tracking-[0.24em] text-slate-400">Team</span>
          <input
            value={team}
            onChange={(event) => setTeam(event.target.value)}
            className="w-full rounded-3xl border border-slate-700 bg-[#111827] px-4 py-3 text-white outline-none focus:border-cyan-400"
            placeholder="Team name"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm uppercase tracking-[0.24em] text-slate-400">Position</span>
          <select
            value={position}
            onChange={(event) => setPosition(event.target.value)}
            className="w-full rounded-3xl border border-slate-700 bg-[#111827] px-4 py-3 text-white outline-none"
          >
            <option value="">All positions</option>
            <option value="forward">Forward</option>
            <option value="midfielder">Midfielder</option>
            <option value="defender">Defender</option>
            <option value="goalkeeper">Goalkeeper</option>
          </select>
        </label>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="rounded-3xl border border-slate-800 bg-[#0d0d0d] p-6 text-center text-slate-300">Loading players...</div>
        ) : error ? (
          <div className="rounded-3xl border border-rose-500 bg-[#0d0d0d] p-6 text-center text-rose-300">{error}</div>
        ) : players.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-[#0d0d0d] p-6 text-center text-slate-400">No players were found.</div>
        ) : (
          <div className="grid gap-4">
            {players.map((player) => (
              <Link
                key={player.id}
                to={`/players/${player.id}`}
                className="rounded-[28px] border border-slate-800 bg-[#111827] p-6 transition hover:border-cyan-400/40 hover:bg-slate-900"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-white">{player.name}</p>
                    <p className="mt-2 text-sm text-slate-400">{player.position} • {player.team_name || "No team assigned"}</p>
                  </div>
                  <div className="rounded-full bg-slate-900 px-3 py-2 text-sm text-cyan-300">
                    {player.verified ? "Verified" : "Unverified"}
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

export default PlayerDirectoryPage;
