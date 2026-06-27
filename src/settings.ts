import { App, PluginSettingTab } from 'obsidian';
import ActorSearchPlugin from './main';

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
    // UI implemented in Issue 03
    this.containerEl.empty();
  }
}
