import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const TopAppBar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-slate-800 bg-[#0f0f0f] text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link to="/dashboard" className="text-xl font-semibold text-white">
          SuperSports
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
          <Link to="/dashboard" className="hover:text-white">
            Dashboard
          </Link>
          <Link to="/tournaments" className="hover:text-white">
            Tournaments
          </Link>
          <Link to="/bracket" className="hover:text-white">
            Bracket
          </Link>
          <Link to="/matches" className="hover:text-white">
            Matches
          </Link>
          <Link to="/players" className="hover:text-white">
            Players
          </Link>
          <Link to="/billing" className="hover:text-white">
            Billing
          </Link>
          <Link to="/scoring" className="hover:text-white">
            Scoring
          </Link>
          <Link to="/leaderboard" className="hover:text-white">
            Leaderboard
          </Link>
          {user ? (
            <>
              <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-slate-200">
                {user.username}
              </span>
              <button
                onClick={logout}
                className="rounded-lg bg-slate-900 px-3 py-2 text-slate-200 transition hover:bg-slate-800"
                type="button"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="rounded-lg bg-slate-900 px-3 py-2 hover:bg-slate-800">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default TopAppBar;
