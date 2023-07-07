declare module 'obsidian' {
  interface App {
    plugins: {
      plugins: {
        quickadd: QuickAddPlugin | undefined;
      };
    };
  }
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
