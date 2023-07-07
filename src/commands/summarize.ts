import { BaseCommandSet } from './base';
import { Command } from 'obsidian';
import { IssueModel } from '../jira/models';

export class SummarizeCommand extends BaseCommandSet {
  readonly commands: Command[] = [
    {
      id: 'ojc-summarize-yaml',
      name: 'Summarize issue to frontmatter',
      callback: this.toYaml.bind(this),
    },
  ];

  async toYaml(): Promise<void> {
    const issue = await this.getIssue();
    const targetFile = this.plugin.app.workspace.getActiveFile();

    if (!issue || !targetFile) {
      return;
    }

    await this.plugin.app.fileManager.processFrontMatter(targetFile, (yaml) => {
      const existingIssues = yaml['issues'];
      let index = -1;

      if (existingIssues && Array.isArray(existingIssues)) {
        index = existingIssues.findIndex(
          (v: { key: string }) => v.key === issue.key,
        );
      } else {
        yaml['issues'] = [];
        index = 0;
      }

      const summary = {
        key: issue.key,
        summary: issue.summary,
        link: issue.link,
        assignee: issue.assignee,
        status: issue.status,
        reporter: issue.reporter,
        createDate: issue.createDate,
        lastUpdated: issue.lastUpdated,
      };

      if (index === -1) {
        yaml['issues'].push(summary);
      } else {
        yaml['issues'][index] = summary;
      }
    });
  }

  private async getIssue(): Promise<IssueModel | null> {
    const suggestion = await this.plugin.issuePicker.pick();
    if (!suggestion || !suggestion.key) {
      return null;
    }
    return new IssueModel(
      await this.jira.issues.getIssue({
        issueIdOrKey: suggestion.key,
      }),
    );
  }
}
