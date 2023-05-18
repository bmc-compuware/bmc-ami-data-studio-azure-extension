### Overview

BMC AMI DevX Data Studio Extension is a data management product with automation to speed data extraction, privatization and loading. The extension allows Azure DevOps users to run DevX Data Studio specifications.

### Prerequisites

The following are required to use this extension:

-   Azure Pipelines - in Azure DevOps Services or Azure DevOps Server
-   Azure Key Vault Task
-   BMC Common Configuration extension
-   Workbench CLI. Refer to the [Workbench for Eclipse Install Guide](https://docs.bmc.com/docs/x/YE6wR) for instructions.
-   BMC AMI DevX Data Studio license

### Installing in an Azure Pipelines - in Azure DevOps Services or Azure DevOps Server

1.  Install the BMC AMI DevX Data Studio Extension according to the Azure DevOps instructions for installing extensions in pipeline.
2.  Install the Workbench CLI on the Azure Pipelines Agent that will execute the extension. The Workbench CLI is available on the **Workbench for Eclipse** installation package. If you do not have the installation package, please  visit [https://support.bmc.com](https://support.bmc.com/). For Workbench CLI installation instructions, please refer to the [Workbench for Eclipse Install Guide](https://docs.bmc.com/docs/x/YE6wR).

### Configuring Host Connections
	To use BMC AMI DevX Data Studio, you will need to point it to an installed Workbench Command Line Interface (CLI). The Workbench CLI will work with host connection(s) you also need to configure BMC AMI DevX Data Studio. For more information, see [Configuring for  Workbench CLI & Host Connections](https://github.com/bmc-compuware/common-configuration-azure-extension/blob/master/readme.md)
    
### Executing unit tests
1. When creating the new Azure pipeline, add a new task **BMC AMI DevX Data Studio** by clicking + sign on the Agent Job, and configure the parameters for the task.

2.  In **Windows Workbench CLI Home** or **Linux Workbench CLI Home**, enter the Windows and/or Linux installation location(s) of the CLI. If necessary, change the default values given to match the correct installation location(s) by using the BMC Common Configuration extension.

    **Note**: The Workbench CLI must be installed on the server that is configured to run the Azure Pipeline.

3.  Enter the name of the repository and the results repository if applicable. 

4.  Select the **Execution Type** and specify the required values in the subsequent fields.

6.  Provide the name or the path of the execution context (if applicable) on the server where the Workbench CLI is installed.

7.  Provide the communication manager, execution server, and execution host information in the appropriate sections. All of this can be provided via the execution context.

8.  Under Execution Host, in **Credentials**, enter the name of the key used to store Credentials in the Azure Key Vault, to connect to the selected host. (Credentials must be stored in the format username:password in Azure Key Vault).
      
10. Select the **Halt pipeline if errors occur** check box, if you want the Azure Pipeline to terminate when the specification execution encounters a failure. 

11. Enter JCL **Jobcard Preferences**, **Dataset Naming Preferences**, and **Data Privacy Overrides** if required for executing RDX specifications. 

12. Click **Save & queue**.

## Product Assistance

BMC provides assistance to customers with its documentation, the BMC Support website, and via telephone with the Customer Support team.

### BMC Support Center

You can access information for BMC products via our Support site, [https://support.bmc.com](https://support.bmc.com/). Support Central provides access to critical information about your BMC products. You can review frequently asked questions, read or download documentation, access product fixes, or e-mail your questions or comments. The first time you access Support Central, you must register and obtain a password. The registration is free.

### Contacting Customer Support

At BMC, we strive to make our products and documentation the best in the industry. Feedback from our customers helps us maintain our quality standards. If you need support services, please obtain the following information before calling BMC's 24-hour telephone support:

- The Azure pipeline job output that contains any error messages or pertinent information.

- The name, release number, and build number of your product. This information is displayed in the installed extensions page. Apply the filter, BMC, to display all the installed BMC extension.

- Environment information, such as the operating system and release on which the Workbench CLI is installed.

You can contact BMC in one of the following ways:

- **Web**: You can report issues via the BMC Support site: [https://support.bmc.com](https://support.bmc.com/).
  Note: Please report all high-priority issues by phone.

- **Corporate Website**: To access the BMC website, go to [https://www.bmc.com/](https://www.bmc.com/). The BMC site provides a variety of product and support information.