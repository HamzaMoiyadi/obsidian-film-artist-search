import {
	Editor,
	MarkdownView,
	Notice,
	Plugin,
	TFile,
	normalizePath,
} from 'obsidian';
import {
	FilmArtistSearchSettings,
	DEFAULT_SETTINGS,
	FilmArtistSearchSettingTab,
} from './settings';
import { FilmArtistSearchModal } from './ui/FilmArtistSearchModal';
import { getPersonDetails } from './tmdb/details';
import { renderTemplate, DEFAULT_TEMPLATE } from './utils/template';
import { downloadProfileImage } from './utils/image';

export default class FilmArtistSearchPlugin extends Plugin {
	settings!: FilmArtistSearchSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new FilmArtistSearchSettingTab(this.app, this));

		this.addCommand({
			id: 'create-film-artist-note',
			name: 'Create film artist note',
			callback: () => this.createFilmArtistNote(),
		});

		this.addCommand({
			id: 'insert-film-artist-link',
			name: 'Insert film artist link',
			editorCallback: (editor: Editor) => this.insertFilmArtistLink(editor),
		});

		this.addCommand({
			id: 'insert-film-artist-metadata',
			name: 'Insert film artist metadata',
			checkCallback: (checking) => this.insertFilmArtistMetadata(checking),
		});
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<FilmArtistSearchSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private async renderPersonTemplate(
		person: Awaited<ReturnType<typeof getPersonDetails>>,
		localProfileImagePath = '',
	): Promise<string | null> {
		const { templateFile } = this.settings;
		if (!templateFile) return renderTemplate(DEFAULT_TEMPLATE, person, localProfileImagePath);
		const tplFile = this.app.vault.getAbstractFileByPath(
			normalizePath(templateFile),
		);
		if (!tplFile || !(tplFile instanceof TFile)) {
			new Notice('Template file not found. Check plugin settings.');
			return null;
		}
		return renderTemplate(await this.app.vault.read(tplFile), person, localProfileImagePath);
	}

	private createFilmArtistNote(): void {
		const { notesFolder } = this.settings;
		const tmdbApiKey = this.app.secretStorage.getSecret(this.settings.tmdbApiKey);

		if (!tmdbApiKey) {
			// eslint-disable-next-line obsidianmd/ui/sentence-case
			new Notice('Please set your TMDb API key in plugin settings.');
			return;
		}

		new FilmArtistSearchModal(this.app, tmdbApiKey, async (result) => {
			// 1. Fetch full details
			let person: Awaited<ReturnType<typeof getPersonDetails>>;

			try {
				person = await getPersonDetails(result.id, tmdbApiKey);
			} catch {
				/* eslint-disable obsidianmd/ui/sentence-case */
				new Notice(
					'Could not reach TMDb. Check your connection and API key.',
				);
				/* eslint-enable obsidianmd/ui/sentence-case */
				return;
			}

			try {
				// 2. Resolve note path
				const folder = normalizePath(notesFolder || 'People');
				const notePath = normalizePath(`${folder}/${person.name}.md`);

				// 3. Check for existing note
				if (this.app.vault.getAbstractFileByPath(notePath)) {
					new Notice('Note already exists.');
					return;
				}

				// 4. Optionally download profile image
				const localProfileImagePath = this.settings.downloadProfileImages
					? await downloadProfileImage(this.app, person, this.settings.imageFolder)
					: '';

				// 5. Load and render template
				const content = await this.renderPersonTemplate(person, localProfileImagePath);
				if (content === null) return;

				// 6. Ensure folder exists
				await this.app.vault.createFolder(folder).catch(() => {
					// Folder may already exist — ignore
				});

				// 7. Write note and open
				const file = await this.app.vault.create(notePath, content);
				await this.app.workspace.getLeaf(false).openFile(file);
			} catch {
				new Notice(
					'Failed to create note. Check your vault permissions and settings.',
				);
			}
		}).open();
	}

	private insertFilmArtistMetadata(checking: boolean): boolean | void {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) return false;
		if (checking) return true;

		const tmdbApiKey = this.app.secretStorage.getSecret(this.settings.tmdbApiKey);

		if (!tmdbApiKey) {
			// eslint-disable-next-line obsidianmd/ui/sentence-case
			new Notice('Please set your TMDb API key in plugin settings.');
			return;
		}

		const editor = view.editor;
		const initialQuery = view.file?.basename ?? '';

		// Move cursor into the editor body before opening the modal so that
		// content insertion works even when focus was on the inline title.
		editor.focus();

		new FilmArtistSearchModal(
			this.app,
			tmdbApiKey,
			async (result) => {
				let person: Awaited<ReturnType<typeof getPersonDetails>>;

				try {
					person = await getPersonDetails(result.id, tmdbApiKey);
				} catch {
					/* eslint-disable obsidianmd/ui/sentence-case */
					new Notice(
						'Could not reach TMDb. Check your connection and API key.',
					);
					/* eslint-enable obsidianmd/ui/sentence-case */
					return;
				}

				const localProfileImagePath = this.settings.downloadProfileImages
					? await downloadProfileImage(this.app, person, this.settings.imageFolder)
					: '';

				const content = await this.renderPersonTemplate(person, localProfileImagePath);
				if (content === null) return;

				editor.setValue(content);
			},
			initialQuery,
		).open();
	}

	private insertFilmArtistLink(editor: Editor): void {
		const tmdbApiKey = this.app.secretStorage.getSecret(this.settings.tmdbApiKey);

		if (!tmdbApiKey) {
			// eslint-disable-next-line obsidianmd/ui/sentence-case
			new Notice('Please set your TMDb API key in plugin settings.');
			return;
		}

		new FilmArtistSearchModal(this.app, tmdbApiKey, (result) => {
			editor.replaceSelection(`[[${result.name}]]`);
		}).open();
	}
}
