import { Command } from 'obsidian';
import { JiraCloudPlugin } from '../plugin';

/**
 * A utility class that encapsulates multiple Obsidian command configs with shared logic.
 * These will be registered in the main plugin class.
 */
export abstract class BaseCommandSet {
  abstract readonly commands: Command[];

  constructor(protected readonly plugin: JiraCloudPlugin) {}

  register(): void {
    this.commands.forEach((c) => {
      this.plugin.addCommand(c);
    });
  }
}
