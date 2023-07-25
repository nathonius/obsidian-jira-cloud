# Configuration

## Add username and host

Jira Cloud can only be connected to one Jira instance at a time.

1. In Obsidian, navigate to Jira Cloud plugin settings.
2. The Host setting should be configured with your Atlassian URI, eg. `https://my-company.atlassian.net`.
3. The Username setting should be configured with your Atlassian username. This will likely be an email address, eg. `myname@my-company.com`.

## Generate an API key

Obsidian Jira Cloud must be connected to your Jira account. This should be the account associated with the configured username.

1. Navigate to the [API Tokens page](https://id.atlassian.com/manage-profile/security/api-tokens) in Atlassian account settings.
2. Click "Create API token".
3. Give the token a memorable name. For example, it could be simply named `Obsidian`.
4. Click "Create".
5. Click the "Copy" button to copy the token. Note that you cannot retrieve the token again, so it must be copied before closing this page.
6. Paste the value into the "API Token" Jira Cloud plugin setting in Obsidian.

The API token can be revoked at any time by returning to the [API Tokens page](https://id.atlassian.com/manage-profile/security/api-tokens) or by clicking the link in the email you received from Atlassian upon creation of the token.

## Verify configuration

To test the configuration, execute one of the Jira Cloud Obsidian commands and search for an issue. If issue suggestions appear, the plugin is working.

In the future, a verification button may be added to plugin settings. See [#5](https://github.com/OfficerHalf/obsidian-jira-cloud/issues/5).

## Troubleshooting

If something goes wrong, check that your Jira URI, Username, and API token are correct, then restart Obsidian.

If you continue to have issues, reach out to @OfficerHalf on the [Obsidian Discord](https://discord.gg/obsidianmd).
