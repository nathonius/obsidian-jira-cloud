import {
  DEFAULT_SETTINGS,
  JiraCloudSettings,
  JiraCloudSettingsTab,
} from './settings';
import { Notice, Plugin } from 'obsidian';

import { IssueYamlCommand } from './commands/yaml';
import { JiraIssuePicker } from './jira/issuePicker';
import { ObsidianJiraClient } from './jira/sdk/jira';
import { QuickAddCommand } from './commands/quickadd';

export class JiraCloudPlugin extends Plugin {
  settings: JiraCloudSettings = { ...DEFAULT_SETTINGS };
  readonly issuePicker = new JiraIssuePicker(this);
  private notified = false;
  private _jira: ObsidianJiraClient | undefined;

  get jira(): ObsidianJiraClient {
    if (!this._jira) {
      throw 'Jira not initialized!';
    }
    return this._jira;
  }

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new JiraCloudSettingsTab(this.app, this));
    this.createJiraClient();
    new IssueYamlCommand(this).register();
    new QuickAddCommand(this).register();
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
    if (!this._jira) {
      this.createJiraClient();
    }
  }

  private createJiraClient(): void {
    if (this.settings.apiKey && this.settings.username && this.settings.host) {
      this._jira = new ObsidianJiraClient({
        host: this.settings.host,
        authentication: {
          basic: {
            email: this.settings.username,
            apiToken: this.settings.apiKey,
          },
        },
        newErrorHandling: true,
      });
    } else if (!this.notified) {
      new Notice('Jira Cloud plugin requires configuration before use.');
      this.notified = true;
    }
  }
}
