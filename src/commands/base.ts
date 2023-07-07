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
}
