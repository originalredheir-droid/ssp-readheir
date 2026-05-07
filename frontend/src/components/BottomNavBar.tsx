import { Link, useLocation } from "react-router-dom";

type NavItem = {
  path: string;
  label: string;
  icon: string;
};

const navItems: NavItem[] = [
  { path: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { path: "/tournaments", label: "Tournaments", icon: "emoji_events" },
  { path: "/matches", label: "Matches", icon: "sports_soccer" },
  { path: "/players", label: "Players", icon: "groups" },
  { path: "/leaderboard", label: "Leaderboard", icon: "leaderboard" },
];

const BottomNavBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t border-outline-variant/20 bg-surface/90 px-2 py-3 backdrop-blur-xl md:hidden">
      {navItems.map((item) => {
        const isActive = currentPath === item.path || 
          (item.path === "/tournaments" && currentPath === "/bracket");
        
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 transition-colors ${
              isActive
                ? "text-secondary"
                : "text-outline-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-xl">{item.icon}</span>
            <span className="font-label text-[10px] uppercase tracking-[0.15em]">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNavBar;
