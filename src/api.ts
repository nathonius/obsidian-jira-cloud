import { IssueModel, asIssueModel } from './jira/models/issue';

import { JiraCloudPlugin } from './plugin';

export class JiraCloudPluginApi {
  constructor(private readonly plugin: JiraCloudPlugin) {}

  private get jira() {
    return this.plugin.jira;
  }

  async getIssue(): Promise<IssueModel | null> {
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
