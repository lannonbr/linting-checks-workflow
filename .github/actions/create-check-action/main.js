const core = require("@actions/core");
const github = require("@actions/github");

const token = core.getInput("github-token");

const octokit = new github.GitHub(token);

async function run() {
  const listSuitesResponse = await octokit.checks.listSuitesForRef({
    ...github.context.repo,
    ref: process.env.GITHUB_SHA
  });

  const checkSuite =
    listSuitesResponse.data.total_count === 1 &&
    listSuitesResponse.data.check_suites[0];
  if (!checkSuite) return;

  const checkRunsResponse = await octokit.checks.listForSuite({
    ...github.context.repo,
    check_name: "Lint",
    check_suite_id: checkSuite.id
  });
  const checkRun =
    checkRunsResponse.data.total_count && checkRunsResponse.data.check_runs[0];
  if (!checkRun) return;

  console.log({ checkRun });

  await octokit.checks.update({
    ...github.context.repo,
    check_run_id: checkRun.id,
    output: {
      summary: "Hey all! ya don' goofed",
      title: "Linting"
    },
    actions: [
      {
        label: "fix",
        description: "run prettier",
        identifier: "prettier"
      }
    ]
  });
}

run();
