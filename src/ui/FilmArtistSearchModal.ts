import { App, Notice, SuggestModal } from 'obsidian';
import { searchPersons } from '../tmdb/search';
import { PersonSearchResult } from '../types';

export class FilmArtistSearchModal extends SuggestModal<PersonSearchResult> {
	private apiKey: string;
	private onChoose: (result: PersonSearchResult) => void | Promise<void>;
	private initialQuery: string;

	constructor(
		app: App,
		apiKey: string,
		onChoose: (result: PersonSearchResult) => void | Promise<void>,
		initialQuery = '',
	) {
		super(app);
		this.apiKey = apiKey;
		this.onChoose = onChoose;
		this.initialQuery = initialQuery;
		this.setPlaceholder('Search for an actor or performer…');
	}

	onOpen() {
		super.onOpen();
		if (this.initialQuery) {
			this.inputEl.value = this.initialQuery;
			this.inputEl.dispatchEvent(new Event('input'));
		}
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
		el.addClass('film-artist-search-suggestion');

		// Thumbnail column
		const wrap = el.createDiv({ cls: 'film-artist-thumb-wrap' });
		wrap.createSpan({ cls: 'film-artist-thumb-placeholder', text: '👤' });

		if (result.profile_path) {
			const img = wrap.createEl('img', { cls: 'film-artist-thumb-img' });
			img.src = `https://image.tmdb.org/t/p/w92${result.profile_path}`;
			img.addEventListener('load', () => img.addClass('loaded'));
			img.addEventListener('error', () => img.remove());
		}

		// Text column
		const text = el.createDiv();
		text.createEl('div', { text: result.name });
		text.createEl('small', {
			text: result.known_for_department || 'Acting',
			cls: 'film-artist-search-dept',
		});
	}

	onChooseSuggestion(result: PersonSearchResult) {
		this.onChoose(result)?.catch((err) => {
			console.error(err);
		});
	}
}
