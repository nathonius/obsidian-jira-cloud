import { htmlToMarkdown } from 'obsidian';
import { IssueModel, asIssueModel } from './jira/models/issue';

import { JiraCloudPlugin } from './plugin';

/**
 * Public API of the Jira Cloud plugin. Use this with other plugins.
 */
export class JiraCloudPluginApi {
  constructor(private readonly plugin: JiraCloudPlugin) {}

  private get jira() {
    return this.plugin.jira;
  }

  /**
   * Open a suggest modal to select an issue and return the issue value.
   * @throws error when the Jira client has not been initialized.
   */
  async getIssue(): Promise<IssueModel | null> {
    const suggestion = await this.plugin.issuePicker.pick();
    if (!suggestion || !suggestion.key) {
      return null;
    }
    const issue = asIssueModel(
      await this.jira.issues.getIssue({
        issueIdOrKey: suggestion.key,
      }),
    );

    // Render HTML fields to markdown
    if (this.plugin.settings.renderToMarkdown) {
      issue.fullText = htmlToMarkdown(issue.fullText ?? '');
    }

    return issue;
  }
}
