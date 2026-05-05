import api from "./client";
import { Tournament } from "../types";

export interface TournamentQuery {
  search?: string;
  status?: string;
}

export async function fetchTournaments(query: TournamentQuery = {}): Promise<Tournament[]> {
  const response = await api.get("/tournaments/", { params: query });
  return response.data;
}

export async function fetchTournament(id: string): Promise<Tournament> {
  const response = await api.get(`/tournaments/${id}/`);
  return response.data;
}
