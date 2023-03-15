import tl = require('azure-pipelines-task-lib/task');
import {TEDExecutionRunner} from './tedExecutionRunner';

async function run() {
  try {
    let tEDExecutionRunner: TEDExecutionRunner = new TEDExecutionRunner();
    let cliArguments = new Map<string, string>();
    tEDExecutionRunner.execteRunner(cliArguments);
}
catch (err: any) {
    tl.setResult(tl.TaskResult.Failed, err.stack);
}
}
run();