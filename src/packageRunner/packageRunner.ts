// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { IPythonTerminal } from '../pythonTerminal/types';
import { IOptionsBuilder, IPackageRunner } from './types';
import { PackageInfo } from '../types';

/**
 * Runs Python package.
 */
export class PackageRunner implements IPackageRunner {
  private terminal: IPythonTerminal;
  private installationTerminalProvider: () => Promise<IPythonTerminal>;
  private optionsBuilder: IOptionsBuilder;
  private packageInfo: PackageInfo;

  /**
   * @param terminal Terminal to run package in.
   * @param optionsBuilder Options builder to build options for the package.
   * @param packageInfo Package information.
   * @param installationTerminalProvider Function to get a terminal to install the package in if it is not installed.
   */
  constructor(
    terminal: IPythonTerminal,
    optionsBuilder: IOptionsBuilder,
    packageInfo: PackageInfo,
    installationTerminalProvider?: () => Promise<IPythonTerminal>
  ) {
    if (installationTerminalProvider === undefined) {
      installationTerminalProvider = () => {
        return Promise.resolve(terminal);
      };
    }
    this.terminal = terminal;
    this.optionsBuilder = optionsBuilder;
    this.packageInfo = packageInfo;
    this.installationTerminalProvider = installationTerminalProvider;
  }

  //https://github.com/microsoft/vscode-python/blob/3698950c97982f31bb9dbfc19c4cd8308acda284/src/client/common/process/proc.ts
  //Using child_process
  /**
   * Run package for the uris based on the configuration. If package is not installed, show a prompt to install.
   * @param uris File paths and folder paths to run package for.
   */
  public async run(uris: vscode.Uri[]): Promise<void> {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Window,
        title: `Running ${this.packageInfo.packageDisplayName}`,
      },
      async progress => {
        progress.report({ increment: 0 });
        try {
          const command = await this.optionsBuilder.build(uris);
          await this.terminal.send(command);
        } catch (e) {
          if (e instanceof Error && e.message.includes('No module named')) {
            await vscode.window
              .showWarningMessage(
                `${this.packageInfo.packageDisplayName} is not installed. Install?`,
                'Yes',
                'No'
              )
              .then(async selection => {
                if (selection === 'Yes') {
                  await (
                    await this.installationTerminalProvider()
                  ).send([
                    '-m',
                    'pip',
                    'install',
                    '-U',
                    this.packageInfo.packageName,
                  ]);
                }
              });
          } else {
            await vscode.window.showErrorMessage(
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              `Failed to run ${this.packageInfo.packageDisplayName}.\n${e}`
            );
          }
        }
      }
    );
  }
}
