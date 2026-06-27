import { Plugin } from 'obsidian';
import { ActorSearchSettings, DEFAULT_SETTINGS, ActorSearchSettingTab } from './settings';

export default class ActorSearchPlugin extends Plugin {
	settings!: ActorSearchSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new ActorSearchSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<ActorSearchSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
