import { App, PluginSettingTab, Setting } from 'obsidian';
import ActorSearchPlugin from './main';
import { FileSuggest } from './settings/FileSuggester';
import { FolderSuggest } from './settings/FolderSuggester';

export interface ActorSearchSettings {
	tmdbApiKey: string;
	notesFolder: string;
	templateFile: string;
}

export const DEFAULT_SETTINGS: ActorSearchSettings = {
	tmdbApiKey: '',
	notesFolder: 'People/',
	templateFile: '',
};

export class ActorSearchSettingTab extends PluginSettingTab {
	plugin: ActorSearchPlugin;

	constructor(app: App, plugin: ActorSearchPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		this.containerEl.empty();

		new Setting(this.containerEl)
			// eslint-disable-next-line obsidianmd/ui/sentence-case
			.setName('TMDb API key')
			// eslint-disable-next-line obsidianmd/ui/sentence-case
			.setDesc('Your TMDb v3 API key. Get one free at themoviedb.org.')
			.addText((text) => {
				text.inputEl.type = 'password';
				text.setPlaceholder('Paste your API key')
					.setValue(this.plugin.settings.tmdbApiKey)
					.onChange(async (value) => {
						this.plugin.settings.tmdbApiKey = value;
						await this.plugin.saveSettings();
					});
			});

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
