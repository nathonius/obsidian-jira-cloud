import { Version3Models } from 'jira.js';
import { htmlToMarkdown } from 'obsidian';
import { removeKeys } from '../../util';

/**
 * A somewhat arbitrary list of keys to remove from any fields.
 */
const sanitizedKeys = [
  'id',
  'self',
  'avatarId',
  'accountId',
  'timeZone',
  'avatarUrls',
  'statusCategory',
  'active',
  'accountType',
  'hierarchyLevel',
  'description',
] as const;

/**
 * A flattened and simplified version of the original Issue response
 */
export interface IssueModel {
  key: string;
  summary: string;
  issuetype?: Version3Models.IssueTypeDetails;
  status?: Version3Models.StatusDetails;
  assignee: Version3Models.UserDetails & { avatar?: string };
  avatar?: string;
  link: string;
  reporter: Version3Models.User & { avatar?: string };
  fullText?: string;
  updated: string;
  created: string;
  priority: Version3Models.Priority;
  project: {
    key?: string;
    name?: string;
    avatar?: string;
  };
  labels: string[];
  resolution?: Version3Models.Resolution;
  _fields: Partial<Version3Models.Fields>;
}

/**
 * Removes nullish values and flattens the API issue response into a simpler form
 * Replace fields with Partial<fields> for safety; types can be inaccurate.
 */
export function asIssueModel(
  _issueData: Omit<Version3Models.Issue, 'fields'> & {
    fields: Partial<Version3Models.Fields>;
  },
  renderToMarkdown = true,
): IssueModel {
  const baseUrl = _issueData.self?.split('/rest')[0];
  const model = removeKeys({
    key: _issueData.key,
    summary: _issueData.fields.summary ?? '',
    link: `${baseUrl}/browse/${_issueData.key}`,
    issuetype: _issueData.fields.issuetype
      ? removeKeys(_issueData.fields.issuetype, sanitizedKeys)
      : undefined,
    status: removeKeys(_issueData.fields.status, sanitizedKeys),
    assignee: {
      ...removeKeys(_issueData.fields.assignee, sanitizedKeys),
      avatar: _issueData.fields.assignee?.avatarUrls?.['48x48'],
    },
    reporter: {
      ...removeKeys(_issueData.fields.reporter, sanitizedKeys),
      avatar: _issueData.fields?.reporter?.avatarUrls?.['48x48'],
    },
    fullText: (_issueData.renderedFields as Record<string, string>)
      ?.description,
    updated: _issueData.fields.updated ?? '',
    created: _issueData.fields.created ?? '',
    priority: removeKeys(_issueData.fields.priority, sanitizedKeys),
    project: {
      name: _issueData.fields.project?.name,
      key: _issueData.fields.project?.key,
      avatar: _issueData.fields.project?.avatarUrls?.['48x48'],
    },
    labels: _issueData.fields.labels ?? [],
    resolution: _issueData.fields.resolution
      ? removeKeys(_issueData.fields.resolution, sanitizedKeys)
      : undefined,
    _fields: removeKeys(_issueData.fields),
  });

  // Render HTML fields to markdown
  if (renderToMarkdown) {
    model.fullText = htmlToMarkdown(model.fullText ?? '');
  }

  return model;
}
