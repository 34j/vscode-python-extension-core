import * as vscode from 'vscode';

export function getCurrentWorkspaceFolder(): vscode.Uri | undefined {
  const uri = vscode.window.activeTextEditor?.document.uri;
  const currentWorkspaceFolder = uri
    ? vscode.workspace.getWorkspaceFolder(uri)?.uri
    : undefined;
  return currentWorkspaceFolder;
}
