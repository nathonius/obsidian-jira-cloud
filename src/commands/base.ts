import { Command } from 'obsidian';
import { JiraCloudPlugin } from '../plugin';

export abstract class BaseCommandSet {
  abstract readonly commands: Command[];

  constructor(protected readonly plugin: JiraCloudPlugin) {}

  register(): void {
    this.commands.forEach((c) => {
      this.plugin.addCommand(c);
    });
  }
}
