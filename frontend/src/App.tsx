import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import TournamentListPage from "./pages/TournamentListPage";
import TournamentBracketPage from "./pages/TournamentBracketPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import MatchDetailPage from "./pages/MatchDetailPage";
import PlayerProfilePage from "./pages/PlayerProfilePage";
import RefereeScoringPage from "./pages/RefereeScoringPage";
import TopAppBar from "./components/TopAppBar";

function App() {
  return (
    <div className="min-h-screen bg-[#131313] text-white">
      <TopAppBar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tournaments" element={<TournamentListPage />} />
          <Route path="/bracket" element={<TournamentBracketPage />} />
          <Route path="/scoring" element={<RefereeScoringPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/matches/:id" element={<MatchDetailPage />} />
          <Route path="/players/:id" element={<PlayerProfilePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
