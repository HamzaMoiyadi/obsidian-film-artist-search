import { requestUrl } from 'obsidian';
import { PersonSearchResult } from '../types';

const TMDB_BASE = 'https://api.themoviedb.org/3';

export async function searchPersons(
  query: string,
  apiKey: string,
): Promise<PersonSearchResult[]> {
  if (!query.trim()) return [];

  const url = `${TMDB_BASE}/search/person?api_key=${encodeURIComponent(apiKey)}&query=${encodeURIComponent(query)}&page=1`;

  const response = await requestUrl({ url });
  const data = response.json as { results: PersonSearchResult[] };
  return data.results ?? [];
}
