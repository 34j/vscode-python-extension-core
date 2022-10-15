// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { PackageInfo } from '../types';
import { IPackageRunner } from '../packageRunner/types';
import { ICommandDispatcher } from './types';

export class BasicCommandDispatcher implements ICommandDispatcher {
  private _packageInfo;
  private _packageRunner;
  private _context;
  get packageInfo(): PackageInfo {
    return this._packageInfo;
  }
  protected get packageRunner(): IPackageRunner {
    return this._packageRunner;
  }
  protected set packageRunner(value: IPackageRunner) {
    this._packageRunner = value;
  }
  protected get context(): vscode.ExtensionContext {
    return this._context;
  }
  protected set context(value: vscode.ExtensionContext) {
    this._context = value;
  }

  constructor(
    context: vscode.ExtensionContext,
    packageInfo: PackageInfo,
    packageRunner: IPackageRunner
  ) {
    this._context = context;
    this._packageInfo = packageInfo;
    this._packageRunner = packageRunner;
  }

  public activate(): void {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log(`Activating ${this._packageInfo.packageDisplayName} ...`);
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand(
      this._packageInfo.runCommandName,
      async (uri: vscode.Uri, uris: vscode.Uri[]) => {
        // The code you place here will be executed every time your command is executed

        // if the command is called from Command Palette, uri and uris are undefined
        // we use the current file

        // To support calling the command from other scripts, we check both uris and uri.
        // Uris take precedence over uri.
        if (uris === undefined) {
          if (uri === undefined) {
            const activeTextEditor = vscode.window.activeTextEditor;
            if (activeTextEditor === undefined) {
              await vscode.window.showErrorMessage('No file to process.');
              return;
            } else {
              uri = activeTextEditor.document.uri;
            }
          }
          uris = [uri];
        }

        try {
          await this._packageRunner.run(uris);
        } catch (e) {
          // print error message
          await vscode.window.showErrorMessage((e as Error).message);
        }
      }
    );

    this._context.subscriptions.push(disposable);

    // For running autoflake for workspace folders
    disposable = vscode.commands.registerCommand(
      this._packageInfo.runForWorkspaceCommandName,
      async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders === undefined) {
          await vscode.window.showErrorMessage('No workspace has been opened.');
          return;
        }
        await vscode.commands.executeCommand(
          this._packageInfo.runCommandName,
          undefined,
          workspaceFolders.map(folder => folder.uri)
        );
      }
    );

    this._context.subscriptions.push(disposable);

    const runCommandName = this._packageInfo.runCommandName;
    // Register as a formatter
    disposable = vscode.languages.registerDocumentFormattingEditProvider(
      { language: 'python' },
      {
        async provideDocumentFormattingEdits(
          document: vscode.TextDocument
        ): Promise<vscode.TextEdit[]> {
          await vscode.commands.executeCommand(
            runCommandName,
            document.uri,
            undefined
          );
          return [];
        },
      }
    );

    this._context.subscriptions.push(disposable);

    console.log(`${this._packageInfo.packageDisplayName} activated.`);
  }
}
