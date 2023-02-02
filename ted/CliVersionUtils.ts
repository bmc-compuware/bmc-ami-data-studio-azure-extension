/**
 *	Utility class used to check the version of the installed Topaz CLI.
 */
const fs = require('fs')
var xml2js = require('xml2js');
import { UtilityFunctions } from './UtilityFunctions';
var comonConstant = require('./TEDConstants');


export class CliVersionUtils {

    /**
     * Method reads version file from topaz cli and check its compatibility.
     * @param cliversionFilePath 
     * @param minVersion 
     * @returns 
     */
    checkCliVersionCompatability(cliversionFilePath: string, minVersion: string): Boolean {
        let cliVersion = "";
        var utilFunc = new UtilityFunctions();
        let versionFilePath = cliversionFilePath + utilFunc.getFileSeperator() + comonConstant.VERSION_FILE_NAME;
        const versionXmlData = fs.readFileSync(versionFilePath,
            { encoding: 'utf8', flag: 'r' });
        var parser = new xml2js.Parser();
        parser.parseString(versionXmlData, function (err, result) {
            cliVersion = result['product']['$']['version'];
        });

        if (cliVersion != '' && this.compareVersions(cliVersion, minVersion) == 1) {
            return true;
        }
        return false;
    }

    /**
     * Method used to check version compatability
     * @param cliVersion 
     * @param minVersion 
     * @returns 
     */
    compareVersions(cliVersion: String, minVersion: String) {
        let minimumVersionParts: string[] = minVersion.split('.');
        let cliVersionParts: string[] = cliVersion.split('.');
        let length: Number = Math.max(minimumVersionParts.length, cliVersionParts.length);
        for (var i = 0; i < length; i++) {
            let minimumVersionPart: Number = i < minimumVersionParts.length ? Number(minimumVersionParts[i]) : 0;
            let cliVersionPart: Number = i < cliVersionParts.length ? Number(cliVersionParts[i]) : 0;
            if (cliVersionPart < minimumVersionPart) {
                return -1;
            }
            else if (cliVersionPart > minimumVersionPart) {
                return 1;
            }
        }

        return 0;
    }

}