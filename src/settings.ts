import { App, PluginSettingTab, Setting } from 'obsidian';

import { JiraCloudPlugin } from './plugin';

export interface JiraCloudSettings {
  apiKey: string;
  username: string;
  host: string;
}

export const DEFAULT_SETTINGS: JiraCloudSettings = {
  apiKey: '',
  username: '',
  host: '',
};

export class JiraCloudSettingsTab extends PluginSettingTab {
  constructor(
    public readonly app: App,
    private readonly plugin: JiraCloudPlugin,
  ) {
    super(app, plugin);
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl('h2', { text: 'Jira Cloud settings' });

    new Setting(containerEl)
      .setName('Host')
      .setDesc('Your Atlassian URI, eg. https://my-company.atlassian.net')
      .addText((text) =>
        text
          .setPlaceholder('https://my-company.atlassian.net')
          .setValue(this.plugin.settings.host)
          .onChange(async (value) => {
            this.plugin.settings.host = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Username')
      .setDesc('Your Atlassian username, eg. myname@my-company.com')
      .addText((text) =>
        text
          .setPlaceholder('myname@my-company.com')
          .setValue(this.plugin.settings.username)
          .onChange(async (value) => {
            this.plugin.settings.username = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Host')
      .setDesc(
        'Your Atlassian API Key, generated here https://id.atlassian.com/manage-profile/security/api-tokens',
      )
      .addText((text) =>
        text
          .setPlaceholder('ZnJlZDpmcmVk')
          .setValue(this.plugin.settings.apiKey)
          .onChange(async (value) => {
            this.plugin.settings.apiKey = value;
            await this.plugin.saveSettings();
          }),
      );
  }
}
