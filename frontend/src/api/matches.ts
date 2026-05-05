import api from "./client";
import type { Match } from "../types";

export interface MatchQuery {
  search?: string;
  status?: string;
  tournament?: string;
  team?: string;
}

export async function fetchMatches(query: MatchQuery = {}): Promise<Match[]> {
  const response = await api.get<Match[]>("/matches/", { params: query });
  return response.data;
}

export async function fetchMatch(id: string): Promise<Match> {
  const response = await api.get<Match>(`/matches/${id}/`);
  return response.data;
}

export async function updateMatch(
  id: string,
  payload: Partial<Pick<Match, "home_score" | "away_score" | "status">>
): Promise<Match> {
  const response = await api.patch<Match>(`/matches/${id}/`, payload);
  return response.data;
}
