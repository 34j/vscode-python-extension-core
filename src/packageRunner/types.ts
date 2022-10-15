import * as vscode from 'vscode';

export interface IPackageRunner {
  run(uris: vscode.Uri[]): Promise<void>;
}

export interface IOptionsBuilder {
  build(uris: vscode.Uri[]): Promise<string[]>;
}
