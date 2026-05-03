import api from "./client";
import type { Match } from "../types";

export async function fetchMatches(): Promise<Match[]> {
  const response = await api.get<Match[]>("/matches/");
  return response.data;
}

export async function fetchMatch(id: string): Promise<Match> {
  const response = await api.get<Match>(`/matches/${id}/`);
  return response.data;
}
