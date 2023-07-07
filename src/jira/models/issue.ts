import { Version3Models } from 'jira.js';

export class IssueModel {
  constructor(readonly _issueData: Version3Models.Issue) {}

  get key() {
    return this._issueData.key;
  }

  get summary() {
    return this._issueData.fields.summary;
  }

  get status() {
    return this._issueData.fields.status.name;
  }

  get assignee() {
    return this._issueData.fields.assignee.displayName;
  }

  get link() {
    const baseUrl = this._issueData.self?.split('/rest')[0];
    return `${baseUrl}/browse/${this._issueData.key}`;
  }

  get reporter() {
    return this._issueData.fields.creator.displayName;
  }

  get fullText() {
    return this._issueData.fields.description?.text;
  }

  get createDate() {
    return this._issueData.fields.created;
  }

  get lastUpdated() {
    return this._issueData.fields.updated;
  }
}
