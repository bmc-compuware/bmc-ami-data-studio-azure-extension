import tl = require('azure-pipelines-task-lib/task');
import { ToolRunner } from 'azure-pipelines-task-lib/toolrunner';
import { TEDExecutionBuilder } from './TEDExecutionBuilder';
import { ExecutionRunnerUtils } from './ExecutionRunnerUtils';
import { UtilityFunctions } from './UtilityFunctions';
import { spawn, exec } from 'child_process';
var cliargList = require('./CliArguments');

/**
 * Class used to execute specifications on cli
 */
export class TEDExecutionRunner {
  tEDExecutionBuilder: TEDExecutionBuilder = new TEDExecutionBuilder();
  runnerUtils: ExecutionRunnerUtils = new ExecutionRunnerUtils();
  utilityFunc: UtilityFunctions = new UtilityFunctions();
  cliPath: string | undefined = undefined;

  execteRunner(cliAruguments: any) {
    try {
      var commandLineArgs: string[] = [];
      this.tEDExecutionBuilder.validateParams();
      (this.utilityFunc.isShell) ? this.cliPath = this.tEDExecutionBuilder.linuxTopazWorkbenchCliHome : this.tEDExecutionBuilder.windowsTopazWorkbenchCliHome;
      let scliScriptPath = this.runnerUtils.getCliScriptFilePath('' + this.cliPath);
      var workSpacePath = tl.getVariable('Agent.WorkFolder');

      this.addArguments(cliAruguments);
      cliAruguments.forEach((value: string, key: string) => {
        commandLineArgs.push(key);
        commandLineArgs.push('"' + value + '"');
      });
      // console.log(cliAruguments);
      if (!this.utilityFunc.isShell)
        this.executeShellWindows(scliScriptPath, commandLineArgs, '' + this.cliPath);
      else
        this.executeScript(scliScriptPath, commandLineArgs, '' + this.cliPath);

    } catch (err) {
      console.log(err.message);
      tl.setResult(tl.TaskResult.Failed, err.message);
    }

  }

  addArguments(cliAruguments: any) {
    cliAruguments.set(cliargList.command, 'execute');
    //Adding repository names
    if (this.tEDExecutionBuilder.repositoryName && this.tEDExecutionBuilder.repositoryName.length != 0)
      cliAruguments.set(cliargList.repository, this.tEDExecutionBuilder.repositoryName);
    if (this.tEDExecutionBuilder.resultsRepositoryName && this.tEDExecutionBuilder.resultsRepositoryName.length != 0)
      cliAruguments.set(cliargList.resultsRepository, this.tEDExecutionBuilder.resultsRepositoryName);

    //Adding specification args
    if (this.tEDExecutionBuilder.selectExecutionOption == 'singleExecution') {
      if (this.tEDExecutionBuilder.specificationName && this.tEDExecutionBuilder.specificationName.length != 0)
        cliAruguments.set(cliargList.specification, this.tEDExecutionBuilder.specificationName);
      if (this.tEDExecutionBuilder.specificationType && this.tEDExecutionBuilder.specificationType.length != 0)
        cliAruguments.set(cliargList.specificationType, this.tEDExecutionBuilder.specificationType);

    } else {
      if (this.tEDExecutionBuilder.multiSpecificationList && this.tEDExecutionBuilder.multiSpecificationList.length > 0)
        cliAruguments.set(cliargList.specificationList, this.tEDExecutionBuilder.multiSpecificationList);
      cliAruguments.set(cliargList.exitonfailure, this.tEDExecutionBuilder.exitOnFailure);
    }

    //Adding timeout flags
    cliAruguments.set(cliargList.executionTimeout, this.tEDExecutionBuilder.executionTimeout);
    let executionContext = this.tEDExecutionBuilder.executionContext;
    if (executionContext && executionContext.length > 0) {
      if (executionContext.indexOf('/') != -1 || executionContext.indexOf('\\') != -1)
        executionContext = "" + this.cliPath + this.utilityFunc.getFileSeperator() + 'EnterpriseData' + this.utilityFunc.getFileSeperator() + this.utilityFunc.getFileSeperator() + executionContext;
      cliAruguments.set(cliargList.executionContext, executionContext);

    }

    //add ces arguments
    if (this.tEDExecutionBuilder.defineCES) {
      cliAruguments.set(cliargList.usecloud, this.tEDExecutionBuilder.useCloudCES);
      if (this.tEDExecutionBuilder.cesURL && this.tEDExecutionBuilder.cesURL.length > 0)
        cliAruguments.set(cliargList.cesUri, this.tEDExecutionBuilder.cesURL);
      if (this.tEDExecutionBuilder.cloudCustomerNo && this.tEDExecutionBuilder.cloudCustomerNo.length > 0)
        cliAruguments.set(cliargList.cesCustno, this.tEDExecutionBuilder.cloudCustomerNo);
      if (this.tEDExecutionBuilder.cloudSiteID && this.tEDExecutionBuilder.cloudSiteID.length > 0)
        cliAruguments.set(cliargList.cesSiteId, this.tEDExecutionBuilder.cloudSiteID);
    }

    //Add communicationmanager args
    if (this.tEDExecutionBuilder.defineManager) {
      if (this.tEDExecutionBuilder.communicationManagerHost && this.tEDExecutionBuilder.communicationManagerHost.length > 0)
        cliAruguments.set(cliargList.commManager, this.tEDExecutionBuilder.communicationManagerHost);

      if (this.tEDExecutionBuilder.communicationManagerPort && this.tEDExecutionBuilder.communicationManagerPort.length > 0)
        cliAruguments.set(cliargList.commManagerPort, this.tEDExecutionBuilder.communicationManagerPort);

    }

    //Add ExecutionServer args

    if (this.tEDExecutionBuilder.defineServer) {
      if (this.tEDExecutionBuilder.executionServer && this.tEDExecutionBuilder.executionServer.length > 0)
        cliAruguments.set(cliargList.executionServer, this.tEDExecutionBuilder.executionServer);
      if (this.tEDExecutionBuilder.executionServerPort && this.tEDExecutionBuilder.executionServerPort.length > 0)
        cliAruguments.set(cliargList.executionServerPort, this.tEDExecutionBuilder.executionServerPort);


    }

    //Add mainframe Specific args
    this.addHostConnectionInfoArguments(cliAruguments);
    this.addHostCredentialsArgument(cliAruguments);
    this.addJCLJobcardArguments(cliAruguments);
    this.addDatasetQualifierArguments(cliAruguments);
    this.addDataPrivacyOverrideArguments(cliAruguments);

  }


 //Method used to set host connection in arguments
  addHostConnectionInfoArguments(argumentSet: any) {
    if (this.tEDExecutionBuilder.defineHost && this.tEDExecutionBuilder.execConnectionId && this.tEDExecutionBuilder.execConnectionId.length > 0) {
      var connectionDetails = this.tEDExecutionBuilder.execConnectionId.split('#');
      var codePage = connectionDetails[2];
      argumentSet.set(cliargList.ccsid, codePage.split(" ")[0]);
      var hostPort = connectionDetails[0].split(':');
      var host = hostPort[0];
      argumentSet.set(cliargList.executionhost, host);
      var port = hostPort[1];
      argumentSet.set(cliargList.executionHostPort, port);
    }

  }
   //Method used to set host connection credentials in arguments
  addHostCredentialsArgument(argumentSet: any) {
    if (this.tEDExecutionBuilder.includeCred && this.tEDExecutionBuilder.execCredentialsID && this.tEDExecutionBuilder.execCredentialsID.length > 0) {
      argumentSet.set(cliargList.hciUserid,tl.getVariable(""+this.tEDExecutionBuilder.execCredentialsID)?.split(":")[0]);
      argumentSet.set(cliargList.hciPassword,tl.getVariable(""+this.tEDExecutionBuilder.execCredentialsID)?.split(":")[1]);
    }
  }

   
  addJCLJobcardArguments(argumentSet: any) {
    if (this.tEDExecutionBuilder.defineJobcard) {
      if (this.tEDExecutionBuilder.jclJobcardLine1 && this.tEDExecutionBuilder.jclJobcardLine1.length > 0)
        argumentSet.set(cliargList.jclJobcard1, this.tEDExecutionBuilder.jclJobcardLine1);

      if (this.tEDExecutionBuilder.jclJobcardLine2 && this.tEDExecutionBuilder.jclJobcardLine2.length > 0)
        argumentSet.set(cliargList.jclJobcard2, this.tEDExecutionBuilder.jclJobcardLine2);

      if (this.tEDExecutionBuilder.jclJobcardLine3 && this.tEDExecutionBuilder.jclJobcardLine3.length > 0)
        argumentSet.set(cliargList.jclJobcard3, this.tEDExecutionBuilder.jclJobcardLine3);

      if (this.tEDExecutionBuilder.jclJobcardLine4 && this.tEDExecutionBuilder.jclJobcardLine4.length > 0)
        argumentSet.set(cliargList.jclJobcard4, this.tEDExecutionBuilder.jclJobcardLine4);

      if (this.tEDExecutionBuilder.jclJobcardLine5 && this.tEDExecutionBuilder.jclJobcardLine5.length > 0)
        argumentSet.set(cliargList.jclJobcard5, this.tEDExecutionBuilder.jclJobcardLine5);

    }

  }


  addDatasetQualifierArguments(argumentSet: any) {
    if (this.tEDExecutionBuilder.defineQualifiers) {
      if (this.tEDExecutionBuilder.datasetHighLevelQualifier && this.tEDExecutionBuilder.datasetHighLevelQualifier.length > 0)
        argumentSet.set(cliargList.datasetHlq, this.tEDExecutionBuilder.datasetHighLevelQualifier);
      if (this.tEDExecutionBuilder.temporaryDatasetPrefix && this.tEDExecutionBuilder.temporaryDatasetPrefix.length > 0)
        argumentSet.set(cliargList.tempdatasetPrefix, this.tEDExecutionBuilder.temporaryDatasetPrefix);
      if (this.tEDExecutionBuilder.temporaryDatasetSuffix && this.tEDExecutionBuilder.temporaryDatasetSuffix.length > 0)
        argumentSet.set(cliargList.tempdatasetSuffix, this.tEDExecutionBuilder.temporaryDatasetSuffix);
    }


  }


  addDataPrivacyOverrideArguments(argumentSet: any) {
    if (this.tEDExecutionBuilder.defineDataprivacyOverride) {
      if (this.tEDExecutionBuilder.dpOverrideFADEBUG && this.tEDExecutionBuilder.dpOverrideFADEBUG.length > 0)
        argumentSet.set(cliargList.fadebug, this.tEDExecutionBuilder.dpOverrideFADEBUG);
      if (this.tEDExecutionBuilder.dpOverrideFAEXPATH && this.tEDExecutionBuilder.dpOverrideFAEXPATH.length > 0)
        argumentSet.set(cliargList.faexpath, this.tEDExecutionBuilder.dpOverrideFAEXPATH);
      if (this.tEDExecutionBuilder.dpOverrideFAIPADDR && this.tEDExecutionBuilder.dpOverrideFAIPADDR.length > 0)
        argumentSet.set(cliargList.faipaddr, this.tEDExecutionBuilder.dpOverrideFAIPADDR);
      if (this.tEDExecutionBuilder.dpOverrideFAJOPTS && this.tEDExecutionBuilder.dpOverrideFAJOPTS.length > 0)
        argumentSet.set(cliargList.fajopts, this.tEDExecutionBuilder.dpOverrideFAJOPTS);
      if (this.tEDExecutionBuilder.dpOverrideFAJPATH && this.tEDExecutionBuilder.dpOverrideFAJPATH.length > 0)
        argumentSet.set(cliargList.fajpath, this.tEDExecutionBuilder.dpOverrideFAJPATH);

    }


  }



  /**
      * function to execute commands on linux
      */
  executeScript(scriptFile: string, commandLineArgs: string[], cliPath: string) {
    let scriptToExecute = scriptFile + ' ' + commandLineArgs.join(' ');
    exec(scriptToExecute, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        tl.setResult(tl.TaskResult.Failed, " An error may have occurred. Please see task logs or see the log file: " + cliPath + "\\TopazBatchWkspc\\.metadata\\.log.");
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });
  }

  /**
   * function to execute commands from commandline interface
   */
  executeShellWindows(scriptFile: string, commandLineArgs: string[], cliPath: string) {
    var bat = require.resolve(scriptFile);
    console.log(commandLineArgs);
    var ls = spawn(bat, commandLineArgs, { shell: true });

    ls.stdout.on('data', function (data) {
      console.log('stdout: ' + data);
    });

    ls.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });

    ls.on('exit', function (code) {
      console.log('child process exited with code ' + code);
      if (code != null && code != 0) {
        tl.setResult(tl.TaskResult.Failed, " An error may have occurred. Please see task logs or see the log file: " + cliPath + "\\TopazBatchWkspc\\.metadata\\.log.");
      }
    });

  }


}