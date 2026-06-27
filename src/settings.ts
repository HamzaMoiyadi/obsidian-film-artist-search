import { App, PluginSettingTab, Setting } from 'obsidian';
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
    this.containerEl.empty();

    new Setting(this.containerEl)
      .setName('TMDb API key')
      .setDesc('Your TMDb v3 API key. Get one free at themoviedb.org.')
      .addText(text => {
        text.inputEl.type = 'password';
        text
          .setPlaceholder('Paste your API key')
          .setValue(this.plugin.settings.tmdbApiKey)
          .onChange(async value => {
            this.plugin.settings.tmdbApiKey = value;
            await this.plugin.saveSettings();
          });
      });

    new Setting(this.containerEl)
      .setName('Notes folder')
      .setDesc('Vault-relative folder where actor notes are saved. Example: People/')
      .addText(text =>
        text
          .setPlaceholder('People/')
          .setValue(this.plugin.settings.notesFolder)
          .onChange(async value => {
            this.plugin.settings.notesFolder = value;
            await this.plugin.saveSettings();
          }));

    new Setting(this.containerEl)
      .setName('Template file')
      .setDesc('Vault-relative path to your note template. Example: Templates/Actor.md')
      .addText(text =>
        text
          .setPlaceholder('Templates/Actor.md')
          .setValue(this.plugin.settings.templateFile)
          .onChange(async value => {
            this.plugin.settings.templateFile = value;
            await this.plugin.saveSettings();
          }));
  }
}
