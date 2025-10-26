import type * as vscode from 'vscode'

/**
 * Runs a Python package.
 */
export interface IPackageRunner {
  /**
   * Run package for the uris based on the configuration.
   * @param uris File paths and folder paths to run package for.
   */
  run: (uris: vscode.Uri[]) => Promise<void>
}

/**
 * Build the options depending on the package configuration and uris.
 */
export interface IOptionsBuilder {
  /**
   * Build the options depending on the package configuration and uris.
   * @param uris File paths and folder paths to run package for.
   */
  build: (uris: vscode.Uri[]) => Promise<string[]>
}
