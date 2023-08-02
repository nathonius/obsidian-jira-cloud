import {
  DEFAULT_SETTINGS,
  JiraCloudSettings,
  JiraCloudSettingsTab,
} from './settings';
import { JiraAPIError, JiraAPIErrorReason } from './util';
import { Notice, Plugin } from 'obsidian';

import { EditorCommand } from './commands/editor';
import { JiraCloudPluginApi } from './api';
import { JiraIssuePicker } from './jira/issuePicker';
import { LoggerMiddleware } from './jira/sdk/logger';
import { ObsidianJiraClient } from './jira/sdk/jira';
import { YamlCommand } from './commands/yaml';

// import { QuickAddCommand } from './commands/quickadd';

export class JiraCloudPlugin extends Plugin {
  settings: JiraCloudSettings = { ...DEFAULT_SETTINGS };
  readonly issuePicker = new JiraIssuePicker(this);
  readonly api = new JiraCloudPluginApi(this);
  private notified = false;
  private _jira: ObsidianJiraClient | undefined;

  get jira(): ObsidianJiraClient {
    if (!this._jira) {
      throw new JiraAPIError(JiraAPIErrorReason.NotInitialized);
    }
    return this._jira;
  }

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new JiraCloudSettingsTab(this.app, this));
    this.createJiraClient();
    new YamlCommand(this).register();
    new EditorCommand(this).register();
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings(recreateClient = false) {
    await this.saveData(this.settings);
    if (!this._jira || recreateClient) {
      this.createJiraClient();
    }
  }

  private createJiraClient(): void {
    if (this.settings.apiKey && this.settings.username && this.settings.host) {
      if (this._jira !== undefined) {
        delete this._jira;
      }

      this._jira = new ObsidianJiraClient({
        host: this.settings.host,
        authentication: {
          basic: {
            email: this.settings.username,
            apiToken: this.settings.apiKey,
          },
        },
        newErrorHandling: true,
        middlewares: {
          onResponse: LoggerMiddleware,
        },
      });
    } else if (!this.notified) {
      new Notice('Jira Cloud plugin requires configuration before use.');
      this.notified = true;
    }
  }
}
