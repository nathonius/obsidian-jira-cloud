declare module 'obsidian' {
  interface App {
    plugins: {
      plugins: {
        [key: string]: SupportedPlugin | undefined;
        quickadd: QuickAddPlugin | undefined;
        templater: TemplaterPlugin | undefined;
      };
    };
  }
}

export type SupportedPlugin = QuickAddPlugin | TemplaterPlugin;

export interface TemplaterPlugin {
  pass: string;
}

export interface QuickAddPlugin {
  settings: {
    choices: QuickAddChoice[];
  };
  api: QuickAddAPI;
}

export interface QuickAddAPI {
  executeChoice: (
    choiceName: string,
    variables?: { [key: string]: any },
  ) => Promise<void>;
}

export interface QuickAddChoice {
  name: string;
}
