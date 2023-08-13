<!-- markdownlint-disable MD024 -->
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!--
## [0.0.0] - YYYY-MM-DD

### Added

### Fixed

### Changed

### Removed
-->

## Unreleased

### Added

- New button in settings to verify the connection to jira
- Better error logging
- Create new issue command

### Fixed

- Search includes issue key match results

### Changed

- BREAKING CHANGE: The plugin's api now always returns the raw response from Jira. Previously, issues were mutated into a simpler form. All keys will need to be updated to reference the correct field; see the [Jira REST api docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-get) for more information.

## [1.2.0] - 2023-07-27

### Added

- New command to insert issue link at cursor

## [1.1.0] - 2023-07-11

### Added

- Show issue type icons in search
- Search both recently viewed issues and use JQL to search all issues
- Added documentation site

### Fixed

- Corrected API token setting name

## 1.0.0 - 2023-07-10

Initial release.

[1.2.0]: https://github.com/OfficerHalf/obsidian-jira-cloud/compare/1.1.0...1.2.0
[1.1.0]: https://github.com/OfficerHalf/obsidian-jira-cloud/compare/1.0.0...1.1.0
