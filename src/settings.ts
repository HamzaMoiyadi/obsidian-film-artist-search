import { App, PluginSettingTab, SecretComponent, Setting } from 'obsidian';
import FilmArtistSearchPlugin from './main';
import { FileSuggest } from './settings/FileSuggester';
import { FolderSuggest } from './settings/FolderSuggester';

export interface FilmArtistSearchSettings {
	tmdbApiKey: string;
	notesFolder: string;
	templateFile: string;
}

export const DEFAULT_SETTINGS: FilmArtistSearchSettings = {
	tmdbApiKey: '',
	notesFolder: 'People/',
	templateFile: '',
};

export class FilmArtistSearchSettingTab extends PluginSettingTab {
	plugin: FilmArtistSearchPlugin;

	constructor(app: App, plugin: FilmArtistSearchPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		this.containerEl.empty();

		new Setting(this.containerEl)
			// eslint-disable-next-line obsidianmd/ui/sentence-case
			.setName('TMDb API key')
			.setDesc(
				// eslint-disable-next-line obsidianmd/ui/sentence-case
				'Select the secret that holds your TMDb v3 API key. Add it via Settings → Secret storage.',
			)
			.addComponent((el) =>
				new SecretComponent(this.app, el)
					.setValue(this.plugin.settings.tmdbApiKey)
					.onChange(async (value) => {
						this.plugin.settings.tmdbApiKey = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(this.containerEl)
			.setName('New file location')
			.setDesc('New actor notes will be placed here.')
			.addSearch((cb) => {
				new FolderSuggest(this.app, cb.inputEl, (value) => {
					this.plugin.settings.notesFolder = value;
					void this.plugin.saveSettings();
				});
				cb.setPlaceholder('Example: folder1/folder2')
					.setValue(this.plugin.settings.notesFolder)
					.onChange((new_folder) => {
						this.plugin.settings.notesFolder = new_folder;
						void this.plugin.saveSettings();
					});
			});

		new Setting(this.containerEl)
			.setName('Template file')
			.setDesc(
				'Vault-relative path to your note template. Example: Templates/Actor.md',
			)
			.addSearch((searchEl) => {
				new FileSuggest(this.app, searchEl.inputEl, (value) => {
					this.plugin.settings.templateFile = value;
					void this.plugin.saveSettings();
				});
				searchEl
					.setPlaceholder('Templates/Actor.md')
					.setValue(this.plugin.settings.templateFile)
					.onChange(async (value) => {
						this.plugin.settings.templateFile = value;
						await this.plugin.saveSettings();
					});
			});
	}
}
