import { PersonDetails } from '../types';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w185';

export function renderTemplate(template: string, person: PersonDetails): string {
  const profileImageUrl = person.profile_path
    ? `${IMAGE_BASE}${person.profile_path}`
    : '';

  const vars: Record<string, string> = {
    name: person.name,
    birthday: person.birthday ?? '',
    deathday: person.deathday ?? '',
    place_of_birth: person.place_of_birth ?? '',
    gender: String(person.gender),
    profile_image_url: profileImageUrl,
    industry: '',
  };

  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? '');
}
