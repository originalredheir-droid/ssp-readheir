import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { path: "/tournaments", label: "Tournaments", icon: "emoji_events" },
  { path: "/bracket", label: "Bracket", icon: "account_tree" },
  { path: "/matches", label: "Matches", icon: "sports_soccer" },
  { path: "/players", label: "Players", icon: "groups" },
  { path: "/leaderboard", label: "Leaderboard", icon: "leaderboard" },
  { path: "/billing", label: "Billing", icon: "payments" },
  { path: "/scoring", label: "Scoring", icon: "sports_score" },
];

const TopAppBar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <>
      {/* Desktop Header */}
      <header className="sticky top-0 z-50 border-b border-outline-variant/10 bg-surface shadow-[0_0_15px_rgba(0,229,255,0.05)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/dashboard" className="flex items-center gap-2 font-label uppercase tracking-widest text-sm text-secondary font-bold">
            <span className="material-symbols-outlined text-xl">sports_esports</span>
            <span>TACTICAL COMMAND</span>
          </Link>
          <nav className="hidden md:flex gap-8 text-sm">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`transition-colors ${
                    isActive
                      ? "text-secondary"
                      : "text-outline-variant hover:text-on-surface"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="w-8 h-8 rounded-none bg-surface-container-high flex items-center justify-center overflow-hidden border border-outline-variant/20">
                  {/* Avatar placeholder */}
                  <span className="material-symbols-outlined text-outline-variant text-sm">
                    person
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="rounded-lg bg-surface-container-high px-3 py-2 text-on-surface transition hover:bg-surface-container-highest"
                  type="button"
                >
                  Logout
                </button>
              </>
            ) : (
              <span className="rounded-lg border border-outline-variant/20 bg-surface-container-high px-3 py-2 text-on-surface">
                Preview mode
              </span>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default TopAppBar;
