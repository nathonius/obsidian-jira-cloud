import { JiraCloudPlugin } from '../plugin';
import { SuggestModal } from 'obsidian';
import { Version3Models } from 'jira.js';

const MIN_QUERY_LENGTH = 3;

/**
 * Suggest modal that searches for Jira issues
 */
export class JiraIssuePicker extends SuggestModal<Version3Models.SuggestedIssue> {
  private resolve:
    | ((value: Version3Models.SuggestedIssue | null) => void)
    | null = null;
  private selectedIssue: Version3Models.SuggestedIssue | null = null;

  constructor(private readonly plugin: JiraCloudPlugin) {
    super(plugin.app);
    this.setPlaceholder('Search for a Jira issue...');
  }

  /**
   * Creates a promise that will be resolved when the user selects an issue or closes the modal
   */
  pick(): Promise<Version3Models.SuggestedIssue | null> {
    return new Promise((resolve) => {
      this.resolve = resolve;
      this.open();
    });
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
        currentJQL: `summary ~ "${query}"`,
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

  selectSuggestion(
    value: Version3Models.SuggestedIssue,
    evt: MouseEvent | KeyboardEvent,
  ): void {
    this.selectedIssue = value;
    super.selectSuggestion(value, evt);
  }

  /**
   * onChooseSuggestion is called after onClose, so we instead handle the choice in selectSuggestion
   */
  onChooseSuggestion() {}

  onClose(): void {
    if (this.resolve) {
      this.resolve(this.selectedIssue);
      this.resolve = null;
      this.selectedIssue = null;
    }
  }
}
