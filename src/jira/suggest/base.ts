import { JiraCloudPlugin } from '../../plugin';
import { SuggestModal } from 'obsidian';

export abstract class BaseSuggest<T> extends SuggestModal<T> {
  private resolve: ((value: T | null) => void) | null = null;
  private selectedItem: T | null = null;

  constructor(
    protected readonly plugin: JiraCloudPlugin,
    placeholder: string,
  ) {
    super(plugin.app);
    this.setPlaceholder(placeholder);
  }

  /**
   * Creates a promise that will be resolved when the user selects an issue or closes the modal
   */
  pick(): Promise<T | null> {
    return new Promise((resolve) => {
      this.resolve = resolve;
      this.open();
    });
  }

  selectSuggestion(value: T, evt: MouseEvent | KeyboardEvent): void {
    this.selectedItem = value;
    super.selectSuggestion(value, evt);
  }

  /**
   * onChooseSuggestion is called after onClose, so we instead handle the choice in selectSuggestion
   */
  onChooseSuggestion() {}

  onClose(): void {
    if (this.resolve) {
      this.resolve(this.selectedItem);
      this.resolve = null;
      this.selectedItem = null;
      this.reset();
    }
  }

  /**
   * Reset any additional values. Override this if needed.
   */
  protected reset(): void {}

  abstract getSuggestions(query: string): Promise<T[]>;
  abstract renderSuggestion(value: T, el: HTMLElement): void;
}
