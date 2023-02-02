var os = require('os');
export class UtilityFunctions{

/**
 * Method to check if sysem is windows or linux
 * @returns boolean
 */
    isShell(): boolean {
        if (os.platform() == 'win32')
            return false
        return true;
    }

    /**
     * Method used to get file seperator based on windows or linux
     * @returns String
     */
    getFileSeperator(): String {
        if (os.platform() == 'win32')
            return "\\";
        else
            return "/";
    }

}