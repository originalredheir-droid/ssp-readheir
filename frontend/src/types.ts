export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan_tier: string;
  subscription_status: string;
  subscription_next_billing_at?: string;
  created_at?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  organization?: Organization | null;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  status: string;
  starts_at: string | null;
  created_at: string;
}

export interface Match {
  id: string;
  tournament: string;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  status: string;
  starts_at: string | null;
  created_at: string;
}

export interface Player {
  id: string;
  name: string;
  team_name: string;
  position: string;
  verified: boolean;
  dob: string | null;
  created_at: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
}
