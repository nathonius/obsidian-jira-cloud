import { IssueModel, asIssueModel } from './jira/models/issue';
import { JiraAPIError, JiraAPIErrorReason } from './util';
import { Notice, htmlToMarkdown } from 'obsidian';

import { JiraCloudPlugin } from './plugin';

/**
 * Public API of the Jira Cloud plugin. Use this with other plugins.
 */
export class JiraCloudPluginApi {
  constructor(private readonly plugin: JiraCloudPlugin) {}

  private get jira() {
    return this.plugin.jira;
  }

  async verifyConnection(): Promise<void> {
    let message = 'Connection verified successfully!';
    try {
      // Try to get recently viewed issues
      const response = await this.jira.issueSearch.getIssuePickerResource();

      // Something weird happened
      if (!response?.sections || response.sections.length === 0) {
        throw new Error();
      }

      // Successful response, but no issues present
      if (
        !response.sections[0].issues ||
        response.sections[0].issues.length === 0
      ) {
        message =
          'Connection could not be verified, no issues were returned from the API. Please check the console.';
        console.warn('Jira API response follows:');
        console.warn(response);
      }
      void new Notice(message);
    } catch (err) {
      if (err instanceof JiraAPIError) {
        console.error(err.response);
        if (err.reason === JiraAPIErrorReason.NotInitialized) {
          message = 'Could not verify connection. Jira was not initialized.';
        } else if (err.reason === JiraAPIErrorReason.Unauthorized) {
          message =
            'Jira client not authorized. Please verify your configuration.';
        } else if (
          err.reason === JiraAPIErrorReason.Other &&
          err.response?.status === 404
        ) {
          message =
            '404 Error: Could not reach Jira instance, check your host URI.';
        }
      } else {
        message = 'Could not verify connection. Unknown error, check logs.';
      }
      void new Notice(message);
      throw err;
    }
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
