import tl = require('azure-pipelines-task-lib/task');

/**
 * 
 * Class used to Prepare Parameters with validations from Configurations to execute TED Specifications.
*/

export class TEDExecutionBuilder {
  repositoryName: String | undefined = tl.getInput('repositoryName', true);
  resultsRepositoryName: String | undefined = tl.getInput('resultRepositoryName', false);
  selectExecutionOption: String | undefined = tl.getInput('executionOptions', false);
  specificationName: String | undefined = tl.getInput('specificationName', false);
  windowsTopazWorkbenchCliHome: string | undefined = tl.getInput('windowsTopazWorkbenchCliHome', false);
  linuxTopazWorkbenchCliHome: string | undefined = tl.getInput('linuxTopazWorkbenchCliHome', false);
  specificationType: String | undefined = tl.getInput('specificationType', false);
  specificationList: String | undefined = tl.getInput('multiSpecificationExecution', false);
  multiSpecificationList: String | undefined = tl.getInput('multiSpecificationExecution', false);
  exitOnFailure: Boolean | false = tl.getBoolInput('exitOnFailure', false);
  executionContext: String | undefined = tl.getInput('executionContext', false);
  executionTimeout: String | undefined = tl.getInput('executionTimeout', false);
  defineCES: Boolean | undefined = tl.getBoolInput('defineCes', false);
  // connectionId:String | undefined=tl.getInput('connectionId', false);
  cesURL: String | undefined = tl.getInput('cesUri', false);
  useCloudCES: Boolean = tl.getBoolInput('useCloudCes', false);;
  cloudCustomerNo: String | undefined = tl.getInput('customerNumber', false);
  cloudSiteID: String | undefined = tl.getInput('siteID', false);
  defineManager: Boolean = tl.getBoolInput('defineCommManager', false);;
  communicationManagerHost: String | undefined = tl.getInput('host', false);;
  communicationManagerPort: String | undefined = tl.getInput('port', false);;
  defineServer: Boolean = tl.getBoolInput('defineExecServer', false);;
  executionServer: String | undefined = tl.getInput('execServerHost', false);
  executionServerPort: String | undefined = tl.getInput('execServerPort', false);
  defineHost: Boolean = tl.getBoolInput('defineExecHost', false);
  execConnectionId: String | undefined = tl.getInput('execConnectionId', false);
  includeCred: Boolean = tl.getBoolInput('useCredentials', false);
  execCredentialsID: String | undefined = tl.getInput('exexHostCredentials', false);
  defineJobcard: Boolean = tl.getBoolInput('defineJobCardPref', false);
  jclJobcardLine1: String | undefined = tl.getInput('jobCardLine1', false);
  jclJobcardLine2: String | undefined = tl.getInput('jobCardLine2', false);
  jclJobcardLine3: String | undefined = tl.getInput('jobCardLine3', false);
  jclJobcardLine4: String | undefined = tl.getInput('jobCardLine4', false);
  jclJobcardLine5: String | undefined = tl.getInput('jobCardLine5', false);
  defineQualifiers: Boolean = tl.getBoolInput('dataSetNamingPref');
  datasetHighLevelQualifier: String | undefined = tl.getInput('dataSetHighQualifier');
  temporaryDatasetPrefix: String | undefined = tl.getInput('tempDatasetPrefix');
  temporaryDatasetSuffix: String | undefined = tl.getInput('tempDatasetSuffix');
  defineDataprivacyOverride: Boolean = tl.getBoolInput('dataPrivacyOverride');
  dpOverrideFADEBUG: String | undefined = tl.getInput('fADEbUG', false);
  dpOverrideFAEXPATH: String | undefined = tl.getInput('fAEXpATH', false);
  dpOverrideFAIPADDR: String | undefined = tl.getInput('fAIPaDDR', false);
  dpOverrideFAJOPTS: String | undefined = tl.getInput('fAJoPTS', false);
  dpOverrideFAJPATH: String | undefined = tl.getInput('fAJpATH', false);
  haltPipelineOnFailure: Boolean = tl.getBoolInput('haltPipeline', false);

  /**
   * 
   * @returns This method validate required parameters
   */
  validateParams() {
    let errorMesage = '';
    if (this.selectExecutionOption == 'singleExecution') {
      if ((this.specificationName == undefined) || (this.specificationName == '')) {
        errorMesage = 'No specification name provided. Enter a specification name.';
        return errorMesage;
      }
      if ((this.specificationType == undefined) || (this.specificationType == '')) {
        errorMesage = 'Type of the specification that is to be executed is not selected. Select the specification type.';
      }
    }

    if (this.selectExecutionOption == 'multipleLine') {
      if ((this.multiSpecificationList == undefined) || (this.multiSpecificationList == '')) {
        errorMesage = 'Specification list is not provided. Enter the list of space separated specification name and type.';
        return errorMesage;
      }

    }

    if (this.defineHost && (!this.execConnectionId || this.execConnectionId.length == 0)) {
      errorMesage = 'No host connection defined. Check common configurations extension to make sure a valid host connection is set.';
      return errorMesage;

    }

    if (this.includeCred && (!this.execCredentialsID || this.execCredentialsID.length == 0)) {
      errorMesage = '"Missing Credentials ID - configure extension correctly.';
      return errorMesage;

    }

    if (this.defineCES) {
      if (!this.cesURL)
        errorMesage = 'A valid CES url needs to be provided.';
      if (this.useCloudCES && (!this.cloudCustomerNo || this.cloudCustomerNo.length == 0 || !this.cloudSiteID || this.cloudSiteID.length == 0))
        errorMesage = 'Since Cloud CES Type is chosen, Site ID and Customer Number needs to be provided.';
    }



  }

}