import { Command, Editor } from 'obsidian';

import { BaseCommandSet } from './base';

/**
 */
export class EditorCommand extends BaseCommandSet {
  readonly commands: Command[] = [
    {
      id: 'editor-link-at-cursor',
      name: 'Insert issue link at cursor',
      editorCallback: this.insertIssueAtCursor.bind(this),
    },
  ];

  private async insertIssueAtCursor(editor: Editor): Promise<void> {
    const issue = await this.plugin.api.getIssue();
    if (!issue) {
      return;
    }

    const issueLink = `[${issue.key}: ${issue.summary}](${issue.link})`;
    const cursor = editor.getCursor();
    // Insert text at cursor
    editor.replaceRange(issueLink, cursor);
    // Move cursor to the end of the link
    editor.setCursor(cursor.line, cursor.ch + issueLink.length);
  }
}