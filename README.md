# UW Medicine CMS

A Drupal multisite installation powering the UW Medicine Enterprise CMS. 

This project was created with [Acquia BLT (Build and Launch Tool)](http://blt.readthedocs.io/en/latest/) and is maintained by the UW Medicine Strategic Marketing & Communications Web Team at the University of Washington.

## Commit Message Conventions

BLT comes with a `commit-msg` hook that forces commits to include a prefix that associates commits with JIRA issues. Since work on this project is distributed across many teams and there is no centralized project management tool, we've modified the `commit-msg` format to include a prefix that identifies which website the commit impacts.

A valid `commit-msg` follows this format `UWM-PREFIX: Imperative commit subject line` where the prefix is chosen from the table below, the subject line text is at least 15 characters, and the subject doesn't end in a period.

We generally follow Chris Beams' rules for [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/). The most important to us is [#5 Use the imperative mood in the subject line](https://chris.beams.io/posts/git-commit/#imperative). See Chris' blog post for examples and more explanation. We're fine with subject lines up to 72 characters since the prefix takes up at least 9 characters.

The summary list of rules is:

1. Separate subject from body with a blank line
1. Limit the subject line to 72 characters
1. Capitalize the subject line
1. Do not end the subject line with a period
1. Use the imperative mood in the subject line
1. Wrap the body at 72 characters
1. Use the body to explain what and why vs. how

### Commit Message Prefixes

| PREFIX | Multisite Affiliation |
| --- | --- |
| UWM-CMS | Entire Platform |
| UWM-CHEW | Consumer Health Engagement Website (CHEW) |
| UWM-HUD | Huddle (Employee Communications Website) |

## Contributing

The general process for getting set up to contribute code on this platform is below. Please see [Local Development](#local-development) for links to the BLT installation docs which provide in-depth instructions.

1. Fork this repository
1. Clone your fork and set an `upstream` remote pointing to this repo
1. `composer install` and `blt local:setup` in your local clone
1. Set git to use our custom hooks `git config core.hooksPath ./git-config/hooks`
1. Dev locally using the [Gitflow Workflow](https://blt.readthedocs.io/en/8.x/readme/dev-workflow/#gitflow-workflow)
1. Submit a pull request on the `master` branch
1. Resolve any [merge conflicts](https://blt.readthedocs.io/en/8.x/readme/dev-workflow/#resolving-merge-conflicts)

### Coding Standards

All code for this project must follow [Drupal Coding Standards](https://www.drupal.org/docs/develop/standards/coding-standards). Commits must pass PHP Code Sniffer, Twig validation, and composer validation tests before they will be merged. There's a git pre-commit hook that comes with BLT and is also replicated in the [git-config/hooks](git-config/hooks) directory. 

If you're working on this project, but not using BLT (not recommended), you can use the `pre-commit` hook supplied in the hooks directory as a template for getting the necessary tests to run.

### Local Development

The recommended local setup for contributing to this project is to use BLT with Drupal VM. If you already have a local *AMP stack or other environment, you can (and should) still use BLT. 

The BLT docs provide detailed instructions for getting up and running.  

1. [BLT installation](https://blt.readthedocs.io/en/8.x/INSTALL/)
1. [Onboarding](https://blt.readthedocs.io/en/8.x/readme/onboarding/)

For setups not using Drupal VM, see: [Local development](https://blt.readthedocs.io/en/8.x/readme/local-development/) in the BLT docs.

### Custom Git Hooks

Since we're using a custom `commit-msg` format, we've included our customized pre-commit hook in the [git-config/hooks](git-config/hooks) folder. You must set a git config in your local clone in order to use these hooks:

`git config core.hooksPath ./git-config/hooks`

## Contact Us

We have a Slack channel for discussing development on the multisite platform at: https://uwmweb.slack.com. To get in touch with the team working on this project, email uwmweb@uw.edu.

## Maintainers

* Brian Tofte-Schumacher
* Nick Meyer

#
#
#
