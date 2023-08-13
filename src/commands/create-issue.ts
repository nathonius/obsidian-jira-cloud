import { Command, Notice } from 'obsidian';

import { BaseCommandSet } from './base';

export class CreateIssueCommand extends BaseCommandSet {
  readonly commands: Command[] = [
    {
      id: 'create-issue',
      name: 'Create new issue',
      callback: this.createIssue.bind(this),
    },
  ];

  private async createIssue(): Promise<void> {
    const issueName = await this.plugin.textInputModal.getInput(
      'Enter issue name',
    );
    if (!issueName) {
      return;
    }
    const project = await this.plugin.api.getProject();
    if (!project) {
      return;
    }
    const issueType = await this.plugin.api.getIssueType(Number(project.id));
    if (!issueType) {
      return;
    }
    const issue = await this.plugin.jira.issues.createIssue({
      fields: {
        summary: issueName,
        issuetype: { id: issueType.id },
        project: { id: project.id },
      },
    });

    if (issue) {
      const baseUrl = issue.self.split('/rest')[0];
      await navigator.clipboard.writeText(`${baseUrl}/browse/${issue.key}`);
      new Notice(
        `Created issue ${issue.key}: ${issueName}. Link copied to clipboard.`,
      );
    }
  }
}
