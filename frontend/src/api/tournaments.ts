import api from "./client";
import { Tournament, Match, Player } from "../types";

export async function fetchTournaments(): Promise<Tournament[]> {
  const response = await api.get("/tournaments/");
  return response.data;
}

export async function fetchMatch(id: string): Promise<Match> {
  const response = await api.get(`/matches/${id}/`);
  return response.data;
}

export async function fetchPlayer(id: string): Promise<Player> {
  const response = await api.get(`/players/${id}/`);
  return response.data;
}
