import { App, Notice, SuggestModal } from 'obsidian';
import { searchPersons } from '../tmdb/search';
import { PersonSearchResult } from '../types';

export class ActorSearchModal extends SuggestModal<PersonSearchResult> {
  private apiKey: string;
  private onChoose: (result: PersonSearchResult) => void;

  constructor(
    app: App,
    apiKey: string,
    onChoose: (result: PersonSearchResult) => void,
  ) {
    super(app);
    this.apiKey = apiKey;
    this.onChoose = onChoose;
    this.setPlaceholder('Search for an actor or performer…');
  }

  async getSuggestions(query: string): Promise<PersonSearchResult[]> {
    if (!query.trim()) return [];
    try {
      return await searchPersons(query, this.apiKey);
    } catch {
      new Notice('Could not reach TMDb. Check your connection.');
      return [];
    }
  }

  renderSuggestion(result: PersonSearchResult, el: HTMLElement): void {
    el.createEl('div', { text: result.name });
    el.createEl('small', {
      text: result.known_for_department || 'Acting',
      cls: 'actor-search-dept',
    });
  }

  onChooseSuggestion(result: PersonSearchResult): void {
    this.onChoose(result);
  }
}
