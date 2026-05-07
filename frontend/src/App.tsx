import { ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import TournamentListPage from "./pages/TournamentListPage";
import TournamentBracketPage from "./pages/TournamentBracketPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import MatchDetailPage from "./pages/MatchDetailPage";
import MatchListPage from "./pages/MatchListPage";
import PlayerDirectoryPage from "./pages/PlayerDirectoryPage";
import PlayerProfilePage from "./pages/PlayerProfilePage";
import BillingPage from "./pages/BillingPage";
import RefereeScoringPage from "./pages/RefereeScoringPage";
import TopAppBar from "./components/TopAppBar";
import BottomNavBar from "./components/BottomNavBar";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

function App() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <TopAppBar />
      <main className="mx-auto max-w-6xl px-4 py-8 pb-20 md:pb-8">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/tournaments" element={<PrivateRoute><TournamentListPage /></PrivateRoute>} />
          <Route path="/bracket" element={<PrivateRoute><TournamentBracketPage /></PrivateRoute>} />
          <Route path="/matches" element={<PrivateRoute><MatchListPage /></PrivateRoute>} />
          <Route path="/matches/:id" element={<PrivateRoute><MatchDetailPage /></PrivateRoute>} />
          <Route path="/players" element={<PrivateRoute><PlayerDirectoryPage /></PrivateRoute>} />
          <Route path="/players/:id" element={<PrivateRoute><PlayerProfilePage /></PrivateRoute>} />
          <Route path="/billing" element={<PrivateRoute><BillingPage /></PrivateRoute>} />
          <Route path="/scoring" element={<PrivateRoute><RefereeScoringPage /></PrivateRoute>} />
          <Route path="/leaderboard" element={<PrivateRoute><LeaderboardPage /></PrivateRoute>} />
        </Routes>
      </main>
      <BottomNavBar />
    </div>
  );
}

export default App;
