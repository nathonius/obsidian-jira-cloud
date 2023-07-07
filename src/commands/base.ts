import { IssueModel, asIssueModel } from '../jira/models/issue';

import { Command } from 'obsidian';
import { JiraCloudPlugin } from '../plugin';

export abstract class BaseCommandSet {
  abstract readonly commands: Command[];

  constructor(protected readonly plugin: JiraCloudPlugin) {}

  protected get jira() {
    return this.plugin.jira;
  }

  register(): void {
    this.commands.forEach((c) => {
      this.plugin.addCommand(c);
    });
  }

  protected async getIssue(): Promise<IssueModel | null> {
    const suggestion = await this.plugin.issuePicker.pick();
    if (!suggestion || !suggestion.key) {
      return null;
    }
    return asIssueModel(
      await this.jira.issues.getIssue({
        issueIdOrKey: suggestion.key,
      }),
    );
  }
}
