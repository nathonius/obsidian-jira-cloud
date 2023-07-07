import { BaseCommandSet } from './base';
import { Command } from 'obsidian';
import { IssueModel } from '../jira/models';

export class IssueYamlCommand extends BaseCommandSet {
  readonly commands: Command[] = [
    {
      id: 'ojc-yaml-summarize',
      name: 'Summarize issue to frontmatter',
      callback: this.summarize.bind(this),
    },
    {
      id: 'ojc-yaml-issue',
      name: 'Add issue to frontmatter',
      callback: this.fullText.bind(this),
    },
  ];

  summarize(): Promise<void> {
    return this.toYaml(true);
  }

  fullText(): Promise<void> {
    return this.toYaml(false);
  }

  private async toYaml(summarize = true): Promise<void> {
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

      const summary: Record<string, string | undefined> = {
        key: issue.key,
        summary: issue.summary,
        link: issue.link,
        assignee: issue.assignee,
        status: issue.status,
        reporter: issue.reporter,
        createDate: issue.createDate,
        lastUpdated: issue.lastUpdated,
      };

      if (summarize === false) {
        summary['fullText'] = issue.fullText;
      }

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
