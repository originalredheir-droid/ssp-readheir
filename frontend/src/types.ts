export interface Organization {
  id: string;
  name: string;
  slug: string;
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
  position: string;
  verified: boolean;
  dob: string | null;
  created_at: string;
}
