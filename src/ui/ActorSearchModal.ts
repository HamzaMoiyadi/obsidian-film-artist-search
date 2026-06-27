import { App, Notice, SuggestModal } from 'obsidian';
import { searchPersons } from '../tmdb/search';
import { PersonSearchResult } from '../types';

export class ActorSearchModal extends SuggestModal<PersonSearchResult> {
	private apiKey: string;
	private onChoose: (result: PersonSearchResult) => void | Promise<void>;

	constructor(
		app: App,
		apiKey: string,
		onChoose: (result: PersonSearchResult) => void | Promise<void>,
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
			// eslint-disable-next-line obsidianmd/ui/sentence-case
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

	onChooseSuggestion(result: PersonSearchResult) {
		this.onChoose(result)?.catch((err) => {
			console.error(err);
		});
	}
}
