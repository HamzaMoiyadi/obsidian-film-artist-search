export interface PersonSearchResult {
  id: number;
  name: string;
  known_for_department: string;
  profile_path: string | null;
}

export interface PersonDetails {
  id: number;
  name: string;
  birthday: string | null;       // ISO date string e.g. "1970-04-04" or null
  deathday: string | null;       // ISO date string or null
  place_of_birth: string | null; // e.g. "Los Angeles, California, USA" or null
  gender: number;                // 0 = not set, 1 = female, 2 = male, 3 = non-binary
  profile_path: string | null;   // e.g. "/abc123.jpg" — NOT a full URL
  biography: string | null;
}
