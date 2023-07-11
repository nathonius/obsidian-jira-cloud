%%
Use this to simply insert a link to an issue at the cursor. For quick access, this can be added as a command in Templater settings.
%%
<%*const issue = await app.plugins.plugins['jira-cloud'].api.getIssue()%><% `[${issue.key}: ${issue.summary}](${issue.link})` %>
