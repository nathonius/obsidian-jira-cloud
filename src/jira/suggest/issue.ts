import { BaseSuggest } from './base';
import { JiraCloudPlugin } from '../../plugin';
import { Version3Models } from 'jira.js';

const MIN_QUERY_LENGTH = 3;

/**
 * Suggest modal that searches for Jira issues
 */
export class IssueSuggest extends BaseSuggest<Version3Models.SuggestedIssue> {
  constructor(plugin: JiraCloudPlugin) {
    super(plugin, 'Search for a Jira issue...');
  }

  async getSuggestions(
    query: string,
  ): Promise<Version3Models.SuggestedIssue[]> {
    // No point searching for tiny queries.
    if (query.length < MIN_QUERY_LENGTH) {
      return [];
    }

    const suggestResponse =
      await this.plugin.jira.issueSearch.getIssuePickerResource({
        query,
        currentJQL: `summary ~ "${query}" OR key = "${query}" OR description ~ "${query}"`,
      });

    const suggestionSections = suggestResponse.sections ?? [];
    const suggestedIssues = new Map<string, Version3Models.SuggestedIssue>();
    suggestionSections.forEach((section) => {
      if (!section.issues) {
        return;
      }
      section.issues.forEach((i) => {
        if (!i.key) {
          return;
        }
        suggestedIssues.set(i.key, i);
      });
    });

    return Array.from(suggestedIssues.values());
  }

  renderSuggestion(value: Version3Models.SuggestedIssue, el: HTMLElement) {
    const wrapper = el.createDiv('ojc-search-result');
    if (value.img) {
      wrapper.createEl('img', {
        attr: { src: new URL(value.img, this.plugin.settings.host).href },
      });
    }
    wrapper.createSpan({ text: `${value.key}: ${value.summaryText}` });
  }
}
