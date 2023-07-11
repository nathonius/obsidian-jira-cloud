%%
Get an issue, then format it into a callout. It creates a callout of type `Issue<IssueType>` where `IssueType` is the issue type from the API. So if you use issue type "Bug", you could configure a new IssueBug admonition type.
%%
<%* const issue = await app.plugins.plugins['jira-cloud'].api.getIssue() %>
> [!Issue<% issue.issuetype.name %>] <% `${issue.key}: ${issue.summary}` %>
> <% `**Status:** ${issue.status.name} **Assigned to:** ${issue.assignee.displayName}` %>
>
> <% issue.fullText.split('\n').join('\n> ') %>