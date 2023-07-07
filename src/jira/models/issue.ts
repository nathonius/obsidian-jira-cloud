import { Version3Models } from 'jira.js';

export interface IssueModel {
  key: string;
  summary: string;
  status?: string;
  assignee?: string;
  link: string;
  reporter?: string;
  fullText?: string;
  lastUpdated: string;
  createDate: string;
  _issueData: Version3Models.Issue;
}

export function asIssueModel(_issueData: Version3Models.Issue): IssueModel {
  const baseUrl = _issueData.self?.split('/rest')[0];
  return {
    key: _issueData.key,
    summary: _issueData.fields.summary,
    status: _issueData.fields.status.name,
    assignee: _issueData.fields.assignee.displayName,
    link: `${baseUrl}/browse/${_issueData.key}`,
    reporter: _issueData.fields.creator.displayName,
    fullText: _issueData.fields.description?.text,
    lastUpdated: _issueData.fields.updated,
    createDate: _issueData.fields.created,
    _issueData,
  };
}
