# Linting Checks Workflow

This is meant to be a test of GitHub Actions w/ the Checks API. What is meant to happen is on push, a workflow will run prettier and check for any linting errors. If it picks one up, it will make a "action" ([Checks action](https://developer.github.com/v3/checks/runs/#check-runs-and-requested-actions), not GitHub Action) that you can use to trigger another workflow which will run prettier on your behalf and commit it to the codebase.

This though does not work right now as workflows can not trigger other workflows. If this changes in the future, I will try to complete this.
