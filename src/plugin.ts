import {
  DEFAULT_SETTINGS,
  JiraCloudSettings,
  JiraCloudSettingsTab,
} from './settings';
import { JiraAPIError, JiraAPIErrorReason } from './util';
import { Notice, Plugin } from 'obsidian';

import { CreateIssueCommand } from './commands/create-issue';
import { EditorCommand } from './commands/editor';
import { IssueSuggest } from './jira/suggest/issue';
import { IssueTypeSuggest } from './jira/suggest/issueType';
import { JiraCloudPluginApi } from './api';
import { LoggerMiddleware } from './jira/sdk/logger';
import { ObsidianJiraClient } from './jira/sdk/jira';
import { ProjectSuggest } from './jira/suggest/project';
import { TextInputModal } from './text-input-modal';
import { YamlCommand } from './commands/yaml';

// import { QuickAddCommand } from './commands/quickadd';

export class JiraCloudPlugin extends Plugin {
  settings: JiraCloudSettings = { ...DEFAULT_SETTINGS };
  readonly issueSuggest = new IssueSuggest(this);
  readonly projectSuggest = new ProjectSuggest(this);
  readonly issueTypeSuggest = new IssueTypeSuggest(this);
  readonly textInputModal = new TextInputModal(this.app);
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
    new CreateIssueCommand(this).register();
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
        noCheckAtlassianToken: true,
      });
    } else if (!this.notified) {
      new Notice('Jira Cloud plugin requires configuration before use.');
      this.notified = true;
    }
  }
}
