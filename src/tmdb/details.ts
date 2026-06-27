import { requestUrl } from 'obsidian';
import { PersonDetails } from '../types';

const TMDB_BASE = 'https://api.themoviedb.org/3';

export async function getPersonDetails(
  id: number,
  apiKey: string,
): Promise<PersonDetails> {
  const url = `${TMDB_BASE}/person/${id}?api_key=${encodeURIComponent(apiKey)}`;
  const response = await requestUrl({ url });
  return response.json as PersonDetails;
}
