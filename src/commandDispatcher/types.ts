import type * as vscode from 'vscode'

export interface ICommandDispatcher {
  activate: (context: vscode.ExtensionContext) => void
}
