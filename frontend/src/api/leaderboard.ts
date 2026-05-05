import api from "./client";
import type { LeaderboardEntry } from "../types";

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  const response = await api.get<LeaderboardEntry[]>("/leaderboard/");
  return response.data;
}
