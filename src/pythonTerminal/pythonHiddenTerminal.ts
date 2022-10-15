/* eslint-disable @typescript-eslint/restrict-template-expressions */
import * as vscode from 'vscode';
import { IExtensionApi, getExtensionApi } from '../msPythonApi';
import * as child_process from 'child_process';
import { IPythonTerminal } from './types';

/**
 * Provides a properly configured hidden terminal (child_process) for executing Python commands.
 */
export class PythonHiddenTerminal implements IPythonTerminal {
  private uri: vscode.Uri | undefined;
  private execCommand: string[] = [];
  private isInitialized = false;

  /**
   * @param uri Uri to get execution details for. (e.g. workspace folder)
   */
  constructor(uri: vscode.Uri | undefined) {
    this.uri = uri;
  }

  private async init() {
    const api: IExtensionApi = await getExtensionApi();
    if (api) {
      const execCommand = api.settings.getExecutionDetails(
        this.uri
      ).execCommand;
      if (execCommand) {
        this.execCommand = execCommand;
      } else {
        throw new Error('Python interpreter is not configured.');
      }
    } else {
      throw new Error('Could not get python extension api.');
    }
  }

  public async send(options: string[], addNewLine?: boolean): Promise<void> {
    if (addNewLine) {
      throw new Error('addNewLine is not supported for hidden terminal.');
    }

    if (!this.isInitialized) {
      await this.init();
      this.isInitialized = true;
    }
    const command = this.execCommand.concat(options);

    //Create child_process
    console.log('Running command: ' + command.join(' '));
    try {
      await new Promise((resolve, reject) => {
        const child = child_process.spawn(command[0], command.slice(1), {
          shell: true,
        });
        child.stdout.on('data', data => {
          console.log(`Stdout: ${data}`);
        });
        child.stderr.on('data', data => {
          console.error(`Stderr: ${data}`);
          reject(`Stderr: ${data}`);
        });
        child.on('close', code => {
          console.log(`Child process exited with code ${code}.`);
          resolve('Done');
        });
      });
    } catch (e) {
      throw new Error(`${e}`);
    }
  }
}
