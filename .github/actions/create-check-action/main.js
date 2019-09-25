const core = require("@actions/core");
const github = require("@actions/github");

const token = core.getInput("github-token");

const octokit = new github.GitHub(token, {
  previews: ["antiope"]
});

async function run() {
  try {
    const listSuitesResponse = await octokit.checks.listSuitesForRef({
      ...github.context.repo,
      ref: process.env.GITHUB_SHA
    });

    // console.log(JSON.stringify(listSuitesResponse));

    const checkSuite = listSuitesResponse.data.check_suites.find(
      suite => suite.app.slug === "github-actions"
    );

    // const checkSuite =
    //   listSuitesResponse.data.total_count === 1 &&
    //   listSuitesResponse.data.check_suites[0];
    if (!checkSuite) {
      console.log("no check suite");
      return;
    }

    const checkRunsResponse = await octokit.checks.listForSuite({
      ...github.context.repo,
      check_name: "Lint",
      check_suite_id: checkSuite.id
    });
    const checkRun =
      checkRunsResponse.data.total_count &&
      checkRunsResponse.data.check_runs[0];
    if (!checkRun) {
      console.log("no check run");
      return;
    }

    console.log({ checkRun });

    await octokit.checks.update({
      ...github.context.repo,
      check_run_id: checkRun.id,
      status: "completed",
      conclusion: "action_required",
      output: {
        summary: "Hey all! ya don' goofed",
        title: "Linting",
        annotations: [
          {
            path: "./foo.js",
            start_line: 1,
            end_line: 1,
            annotation_level: "notice",
            message: "yep"
          }
        ]
      },
      actions: [
        {
          label: "fix linting",
          description: "run prettier",
          identifier: "prettier"
        }
      ]
    });
  } catch (err) {
    core.error(err);
  }

  await new Promise(resolve => {
    setTimeout(() => resolve(), 5000);
  });
}

run();
