import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { players } from "../data/mock";
import { Player } from "../types";

const PlayerProfilePage = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    if (id) {
      const playerRecord = players.find((item) => item.id === id) || null;
      setPlayer(playerRecord);
    }
  }, [id]);

  if (!player) {
    return <p className="text-slate-400">Player not found.</p>;
  }

  return (
    <section className="rounded-[32px] border border-slate-800 bg-[#181818] p-6 shadow-lg shadow-black/20">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Player</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">{player.name}</h1>
        </div>
        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-300">
          {player.position}
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-[#0d0d0d] p-6">
          <p className="text-sm text-slate-400">Verified</p>
          <p className="mt-3 text-3xl font-semibold text-white">{player.verified ? "Yes" : "No"}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-[#0d0d0d] p-6">
          <p className="text-sm text-slate-400">Birthday</p>
          <p className="mt-3 text-3xl font-semibold text-white">{player.dob || "Unknown"}</p>
        </div>
      </div>
      <div className="mt-8 rounded-3xl border border-slate-800 bg-[#121212] p-6">
        <p className="text-sm text-slate-400">Player status</p>
        <p className="mt-3 text-white">This profile is ready to connect to player stats and verification details.</p>
      </div>
    </section>
  );
};

export default PlayerProfilePage;
