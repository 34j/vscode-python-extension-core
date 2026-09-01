import type { IPythonTerminal } from '../pythonTerminal'
import type { PackageInfo } from '../types'
import type { IOptionsBuilder, IPackageRunner } from './types'
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'

/**
 * Runs Python package.
 */
export class PackageRunner implements IPackageRunner {
  private terminal: IPythonTerminal
  private installationTerminalProvider: () => Promise<IPythonTerminal>
  private optionsBuilder: IOptionsBuilder
  private packageInfo: PackageInfo

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
    installationTerminalProvider?: () => Promise<IPythonTerminal>,
  ) {
    if (installationTerminalProvider === undefined) {
      installationTerminalProvider = () => {
        return Promise.resolve(terminal)
      }
    }
    this.terminal = terminal
    this.optionsBuilder = optionsBuilder
    this.packageInfo = packageInfo
    this.installationTerminalProvider = installationTerminalProvider
  }

  // https://github.com/microsoft/vscode-python/blob/3698950c97982f31bb9dbfc19c4cd8308acda284/src/client/common/process/proc.ts
  // Using child_process
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
      async (progress) => {
        progress.report({ increment: 0 })
        try {
          const command = await this.optionsBuilder.build(uris)
          await this.terminal.send(command)
        }
        catch (e) {
          if (e instanceof Error && e.message.includes('No module named')) {
            await vscode.window
              .showWarningMessage(
                `${this.packageInfo.packageDisplayName} is not installed. Install?`,
                'pip',
                'poetry',
                'uv',
                'pipx',
                'uvx',
                'No',
              )
              .then(async (selection) => {
                if (selection === undefined || selection === 'No') {
                  return
                }
                if (selection === 'pip') {
                  command.push('pip', 'install', '-U')
                }
                else if (selection === 'poetry') {
                  command.push('poetry', 'add')
                }
                else if (selection === 'uv') {
                  command.push('uv', 'add')
                }
                else if (selection === 'pipx') {
                  command.push('pipx', 'install')
                }
                else if (selection === 'uvx') {
                  command.push('uvx', 'tool', 'install')
                }
                command.push(this.packageInfo.packageName)
                await (
                  await this.installationTerminalProvider()
                ).send(command)
              })
          }
          else {
            await vscode.window.showErrorMessage(
              `Failed to run ${this.packageInfo.packageDisplayName}.\n${e}`,
            )
          }
        }
      },
    )
  }
}
