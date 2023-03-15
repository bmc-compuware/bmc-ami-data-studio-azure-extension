import tl = require('azure-pipelines-task-lib/task');
const fs = require('fs');
var xml2js = require('xml2js');
import { UtilityFunctions } from './utilityFunctions';
import { CliVersionUtils } from './cliVersionUtils';
var comonConstant = require('./tedConstants');
const TTL_CLI_200903: string = "20.09.03";
const TED_MINIMUM_CLI_VERSION: string = TTL_CLI_200903;

/**
 * Utility functions for execution runner
 */
export class ExecutionRunnerUtils {
    cliVersionUtils: CliVersionUtils = new CliVersionUtils();
    utilFunctions: UtilityFunctions = new UtilityFunctions();
    TED_CLI_BAT: string = "TedCLI.bat";
    TED_CLI_SH: string = "TedCLI.sh";


    /**
     * This method is used to build path for cli and checking version compatibility with cli
     * @param path 
     * @returns 
     */
    getCliScriptFilePath(path: string) {
        if (!path) {
            throw new Error('ERROR: Topaz Workench CLI location was not specified. Check Common Configuration Extension');
        }
        else if (!this.checkIfCliInstalled(path)) {
            throw new Error(comonConstant.cliNotInstalledError);
        }
        if (!this.cliVersionUtils.checkCliVersionCompatability(path, TED_MINIMUM_CLI_VERSION))
            throw new Error('Uncompatible Topaz Cli Version');
        const fileSeperator = this.utilFunctions.getFileSeperator();
        const isSehll: boolean = this.utilFunctions.isShell();
        let osScriptFile = isSehll ? this.TED_CLI_SH : this.TED_CLI_BAT;
        return path + fileSeperator + osScriptFile;
    }



    /**
     * Method used to check if cli installed.
     * @param path  
     * @returns 
     */
    checkIfCliInstalled(path: String): Boolean {
        if (!fs.existsSync(path)) {
            return false;
        }
        return true;
    }



}