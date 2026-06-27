import { PersonDetails } from '../types';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w185';
const TMDB_PERSON_BASE = 'https://www.themoviedb.org/person';

export function renderTemplate(template: string, person: PersonDetails): string {
  const profileImageUrl = person.profile_path
    ? `${IMAGE_BASE}${person.profile_path}`
    : '';

  const vars: Record<string, string> = {
    name: person.name,
    birthday: person.birthday ?? '',
    deathday: person.deathday ?? '',
    placeOfBirth: person.place_of_birth ?? '',
    gender: String(person.gender),
    profileImageUrl: profileImageUrl,
    tmdbUrl: `${TMDB_PERSON_BASE}/${person.id}`,
    industry: '',
  };

  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? '');
}
