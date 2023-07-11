import { Command, Notice } from 'obsidian';

import { BaseCommandSet } from './base';

/**
 * QuickAdd integration. Currently unused.
 */
export class QuickAddCommand extends BaseCommandSet {
  commands: Command[] = [
    {
      id: 'quickadd-issue',
      name: 'Execute QuickAdd choice',
      callback: this.executeChoice.bind(this),
    },
  ];

  private get hasApi() {
    return Boolean(this.plugin.app.plugins.plugins.quickadd);
  }

  private get api() {
    if (!this.plugin.app.plugins.plugins.quickadd) {
      throw 'Quickadd not available.';
    }
    return this.plugin.app.plugins.plugins.quickadd.api;
  }

  async executeChoice() {
    if (!this.hasApi) {
      new Notice(
        'Jira Cloud plugin could not find QuickAdd. QuickAdd must be installed.',
      );
      return;
    }

    if (!this.plugin.settings.quickAddChoice) {
      new Notice(
        'Using the Jira Cloud + QuickAdd integration requires a QuickAdd choice to be configured in plugin settings.',
      );
      return;
    }

    const issue = await this.plugin.api.getIssue();
    if (!issue) {
      return;
    }

    this.api.executeChoice(this.plugin.settings.quickAddChoice, issue);
  }
}
