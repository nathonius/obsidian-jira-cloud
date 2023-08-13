import { BaseSuggest } from './base';
import { JiraCloudPlugin } from '../../plugin';
import { Version3Models } from 'jira.js';

/**
 * Suggest modal that searches for Jira issues
 */
export class ProjectSuggest extends BaseSuggest<Version3Models.Project> {
  constructor(plugin: JiraCloudPlugin) {
    super(plugin, 'Search for a Jira project...');
  }

  async getSuggestions(query: string): Promise<Version3Models.Project[]> {
    const suggestResponse = await this.plugin.jira.projects.searchProjects({
      query,
    });

    return suggestResponse.values ?? [];
  }

  renderSuggestion(value: Version3Models.Project, el: HTMLElement) {
    const wrapper = el.createDiv('ojc-search-result');
    if (value.avatarUrls?.['48x48']) {
      wrapper.createEl('img', {
        attr: {
          src: new URL(value.avatarUrls['48x48'], this.plugin.settings.host)
            .href,
        },
      });
    }
    wrapper.createSpan({ text: `${value.key}: ${value.name}` });
  }
}
