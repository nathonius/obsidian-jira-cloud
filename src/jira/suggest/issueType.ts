import { BaseSuggest } from './base';
import { JiraCloudPlugin } from '../../plugin';
import { Version3Models } from 'jira.js';

/**
 * Suggest modal that searches for Jira issues
 */
export class IssueTypeSuggest extends BaseSuggest<Version3Models.IssueTypeDetails> {
  projectId: number | null = null;
  constructor(plugin: JiraCloudPlugin) {
    super(plugin, 'Search for a Jira issue type...');
  }

  async getSuggestions(
    query: string,
  ): Promise<Version3Models.IssueTypeDetails[]> {
    let suggestions: Version3Models.IssueTypeDetails[] = [];
    if (this.projectId) {
      suggestions = await this.plugin.jira.issueTypes.getIssueTypesForProject({
        projectId: this.projectId,
      });
    } else {
      suggestions = await this.plugin.jira.issueTypes.getIssueAllTypes();
    }

    if (query) {
      return suggestions.filter(
        (issueType) =>
          issueType.name?.toLowerCase().includes(query.toLowerCase()),
      );
    }

    return suggestions;
  }

  renderSuggestion(value: Version3Models.IssueTypeDetails, el: HTMLElement) {
    const wrapper = el.createDiv('ojc-search-result');
    if (value.iconUrl) {
      wrapper.createEl('img', {
        attr: {
          src: new URL(value.iconUrl, this.plugin.settings.host).href,
        },
      });
    }
    wrapper.createSpan({ text: `${value.name}` });
  }

  protected override reset(): void {
    this.projectId = null;
  }
}
