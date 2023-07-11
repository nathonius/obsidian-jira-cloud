import { BaseCommandSet } from './base';
import { Command } from 'obsidian';
import { IssueModel } from 'src/jira/models/issue';
import { removeKeys } from 'src/util';

/**
 * Add an issue to the current note frontmatter.
 * If the selected issue is already in frontmatter, it's value will be overwritten.
 */
export class YamlCommand extends BaseCommandSet {
  readonly commands: Command[] = [
    {
      id: 'ojc-yaml-summarize',
      name: 'Summarize issue to frontmatter',
      callback: this.summarize.bind(this),
    },
    {
      id: 'ojc-yaml-issue',
      name: 'Add issue to frontmatter',
      callback: this.fullIssue.bind(this),
    },
  ];

  /**
   * Adds a subset of issue fields to yaml
   */
  summarize(): Promise<void> {
    return this.toYaml(true);
  }

  /**
   * Adds most fields to yaml. May be a large amount of data.
   * Fields included are those on the IssueModel object.
   */
  fullIssue(): Promise<void> {
    return this.toYaml(false);
  }

  private async toYaml(summarize = true): Promise<void> {
    const issue = await this.plugin.api.getIssue();
    const targetFile = this.plugin.app.workspace.getActiveFile();

    if (!issue || !targetFile) {
      return;
    }

    await this.plugin.app.fileManager.processFrontMatter(targetFile, (yaml) => {
      // Issues will be a child of another key
      const issueKey = this.plugin.settings.issueYamlKey;

      const existingIssues = yaml[issueKey];
      let index = -1;

      if (existingIssues && Array.isArray(existingIssues)) {
        index = existingIssues.findIndex(
          (v: { key: string }) => v.key === issue.key,
        );
      } else {
        yaml[issueKey] = [];
        index = 0;
      }

      let output: Record<string, string | undefined> | IssueModel;
      if (summarize) {
        output = {
          key: issue.key,
          summary: issue.summary,
          link: issue.link,
          assignee: issue.assignee.displayName,
          status: issue.status?.name,
          reporter: issue.reporter.displayName,
          created: issue.created,
          updated: issue.updated,
          fullText: issue.fullText,
        };
      } else {
        // Don't include the full output from the API if not enabled.
        output = this.plugin.settings.includeAll
          ? issue
          : removeKeys(issue, ['_fields']);
      }

      if (index === -1) {
        yaml[issueKey].push(output);
      } else {
        yaml[issueKey][index] = output;
      }
    });
  }
}
