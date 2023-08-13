import { Modal } from 'obsidian';

export class TextInputModal extends Modal {
  private resolve: ((value: string | null) => void) | null = null;
  private prompt: string | null = null;
  private input: HTMLInputElement | null = null;

  onOpen(): void {
    this.containerEl.empty();
    const promptContainer = this.containerEl.createDiv({ cls: 'prompt' });
    const wrapper = promptContainer.createDiv({
      cls: 'prompt-input-container',
    });
    this.input = wrapper.createEl('input', {
      cls: 'prompt-input ojc-text-input',
      attr: {
        id: 'ojc-text-input',
        type: 'text',
        placeholder: this.prompt ?? '',
      },
    });
    this.input.addEventListener('keydown', this.submit.bind(this));
    this.input.focus();
  }

  getInput(prompt: string | null = null): Promise<string | null> {
    return new Promise((resolve) => {
      this.resolve = resolve;
      this.prompt = prompt;
      this.open();
    });
  }

  submit(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      if (this.resolve && this.input) {
        this.resolve(this.input.value);
        this.resolve = null;
        this.input = null;
        this.prompt = null;
      }
      this.close();
    }
  }
}
