import { Editor, Notice, Plugin, TFile, normalizePath } from 'obsidian';
import {
	ActorSearchSettings,
	DEFAULT_SETTINGS,
	ActorSearchSettingTab,
} from './settings';
import { ActorSearchModal } from './ui/ActorSearchModal';
import { getPersonDetails } from './tmdb/details';
import { renderTemplate } from './utils/template';

export default class ActorSearchPlugin extends Plugin {
	settings!: ActorSearchSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new ActorSearchSettingTab(this.app, this));

		this.addCommand({
			id: 'create-actor-note',
			name: 'Create actor note',
			callback: () => this.createActorNote(),
		});

		this.addCommand({
			id: 'insert-actor-link',
			name: 'Insert actor link',
			editorCallback: (editor: Editor) => this.insertActorLink(editor),
		});
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<ActorSearchSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private createActorNote(): void {
		const { tmdbApiKey, notesFolder, templateFile } = this.settings;

		if (!tmdbApiKey) {
			new Notice('Please set your TMDb API key in plugin settings.');
			return;
		}

		new ActorSearchModal(this.app, tmdbApiKey, async (result) => {
			// 1. Fetch full details
			let person: Awaited<ReturnType<typeof getPersonDetails>>;

			try {
				person = await getPersonDetails(result.id, tmdbApiKey);
			} catch {
				new Notice(
					'Could not reach TMDb. Check your connection and API key.',
				);
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

				// 4. Load and render template
				let content = '';
				if (templateFile) {
					const tplFile = this.app.vault.getAbstractFileByPath(
						normalizePath(templateFile),
					);
					if (!tplFile || !(tplFile instanceof TFile)) {
						new Notice(
							'Template file not found. Check plugin settings.',
						);
						return;
					}
					const raw = await this.app.vault.read(tplFile);
					content = renderTemplate(raw, person);
				}

				// 5. Ensure folder exists
				await this.app.vault.createFolder(folder).catch(() => {
					// Folder may already exist — ignore
				});

				// 6. Write note and open
				const file = await this.app.vault.create(notePath, content);
				await this.app.workspace.getLeaf(false).openFile(file);
			} catch {
				new Notice(
					'Failed to create note. Check your vault permissions and settings.',
				);
			}
		}).open();
	}

	private insertActorLink(editor: Editor): void {
		const { tmdbApiKey } = this.settings;

		if (!tmdbApiKey) {
			new Notice('Please set your TMDb API key in plugin settings.');
			return;
		}

		new ActorSearchModal(this.app, tmdbApiKey, (result) => {
			editor.replaceSelection(`[[${result.name}]]`);
		}).open();
	}
}
