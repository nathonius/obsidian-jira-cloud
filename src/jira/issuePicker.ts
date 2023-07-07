import { JiraCloudPlugin } from '../plugin';
import { SuggestModal } from 'obsidian';
import { Version3Models } from 'jira.js';

const MIN_QUERY_LENGTH = 3;

export class JiraIssuePicker extends SuggestModal<Version3Models.SuggestedIssue> {
  private resolve:
    | ((value: Version3Models.SuggestedIssue | null) => void)
    | null = null;
  private selectedIssue: Version3Models.SuggestedIssue | null = null;

  constructor(private readonly plugin: JiraCloudPlugin) {
    super(plugin.app);
  }

  pick(): Promise<Version3Models.SuggestedIssue | null> {
    return new Promise((resolve) => {
      this.resolve = resolve;
      this.open();
    });
  }

  async getSuggestions(
    query: string,
  ): Promise<Version3Models.SuggestedIssue[]> {
    if (query.length < MIN_QUERY_LENGTH) {
      return [];
    }
    const suggestResponse =
      await this.plugin.jira.issueSearch.getIssuePickerResource({ query });
    if (!suggestResponse.sections?.[0]?.issues?.[0]) {
      return [];
    }
    return suggestResponse.sections[0].issues;
  }

  renderSuggestion(value: Version3Models.SuggestedIssue, el: HTMLElement) {
    el.innerHTML = `${value.key}: ${value.summaryText}`;
  }

  selectSuggestion(
    value: Version3Models.SuggestedIssue,
    evt: MouseEvent | KeyboardEvent,
  ): void {
    this.selectedIssue = value;
    super.selectSuggestion(value, evt);
  }

  onChooseSuggestion() {}

  onClose(): void {
    if (this.resolve) {
      this.resolve(this.selectedIssue);
      this.resolve = null;
      this.selectedIssue = null;
    }
  }
}
