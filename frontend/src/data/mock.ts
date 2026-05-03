import { Tournament, Match, Player, LeaderboardEntry } from "../types";

export const tournaments: Tournament[] = [
  {
    id: "1",
    name: "Super Cup League",
    description: "Local championship bracket for 16 teams.",
    status: "live",
    starts_at: "2026-05-10T14:00:00Z",
    created_at: "2026-04-22T08:30:00Z",
  },
  {
    id: "2",
    name: "Summer Invitational",
    description: "Grassroots tournament with score tracking.",
    status: "scheduled",
    starts_at: "2026-06-01T10:00:00Z",
    created_at: "2026-04-24T09:00:00Z",
  },
];

export const matches: Match[] = [
  {
    id: "101",
    tournament: "1",
    home_team: "Northview Eagles",
    away_team: "Westside Warriors",
    home_score: 2,
    away_score: 1,
    status: "live",
    starts_at: "2026-05-12T16:00:00Z",
    created_at: "2026-04-28T12:10:00Z",
  },
  {
    id: "102",
    tournament: "1",
    home_team: "River City Knights",
    away_team: "Eastfield Falcons",
    home_score: 0,
    away_score: 0,
    status: "scheduled",
    starts_at: "2026-05-12T18:00:00Z",
    created_at: "2026-04-28T12:20:00Z",
  },
];

export const players: Player[] = [
  {
    id: "p1",
    name: "Ariana Blake",
    position: "forward",
    verified: true,
    dob: "2004-12-15",
    created_at: "2026-04-15T10:00:00Z",
  },
  {
    id: "p2",
    name: "Jamal Ortiz",
    position: "midfielder",
    verified: false,
    dob: "2005-03-08",
    created_at: "2026-04-15T11:20:00Z",
  },
];

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Northview Eagles", points: 18, trend: "up" },
  { rank: 2, name: "River City Knights", points: 15, trend: "flat" },
  { rank: 3, name: "Eastfield Falcons", points: 13, trend: "down" },
];
