# Plugin API examples

## Templater

The following examples are for use with the [Templater Plugin](https://silentvoid13.github.io/Templater/). See the Templater docs for more details.

### Issue link

This template renders a link to an issue at the cursor. For quick access, this can be added as a command in Templater settings.

```text
<%* const issue = await app.plugins.plugins['jira-cloud'].api.getIssue() %><% `[${issue.key}: ${issue.summary}](${issue.link})` %>
```

Note that there are two Templater commands kept on a single line to prevent extra blank lines being added. As two separate lines:

```text
<%* const issue = await app.plugins.plugins['jira-cloud'].api.getIssue() %>
<% `[${issue.key}: ${issue.summary}](${issue.link})` %>
```

### Issue callout

This template gets an issue then formats it into a callout. It creates a callout of type `Issue<IssueType>` where `IssueType` is the issue type from the API. So if you use issue type "Bug", you could configure a new IssueBug [admonition](https://github.com/javalent/admonitions) type.

```text
<%* const issue = await app.plugins.plugins['jira-cloud'].api.getIssue() %>
> [!Issue<% issue.issuetype.name %>] <% `${issue.key}: ${issue.summary}` %>
> <% `**Status:** ${issue.status.name} **Assigned to:** ${issue.assignee.displayName}` %>
>
> <% issue.fullText.split('\n').join('\n> ') %>
```
