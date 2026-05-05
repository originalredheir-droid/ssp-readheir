import api from "./client";
import type { Player } from "../types";

export interface PlayerQuery {
  search?: string;
  position?: string;
  team?: string;
}

export async function fetchPlayers(query: PlayerQuery = {}): Promise<Player[]> {
  const response = await api.get<Player[]>("/players/", { params: query });
  return response.data;
}

export async function fetchPlayer(id: string): Promise<Player> {
  const response = await api.get<Player>(`/players/${id}/`);
  return response.data;
}
