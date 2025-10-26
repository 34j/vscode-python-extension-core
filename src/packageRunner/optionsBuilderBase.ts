import type { PackageInfo } from '../types'
import type { IOptionsBuilder } from './types'
import * as vscode from 'vscode'
import { OptionsBuilderHelper } from './optionsBuilderHelper'

/**
 * Base class to build options for a Python package. Inherit from this class to build options for a specific package.
 */
export class OptionsBuilderBase implements IOptionsBuilder {
  private _packageInfo: PackageInfo
  /**
   * Information about the package.
   */
  get packageInfo(): PackageInfo {
    return this._packageInfo
  }

  private _optionsBuilderHelper
  /**
   * Helper to build options.
   */
  protected get optionsBuilderHelper(): OptionsBuilderHelper {
    return this._optionsBuilderHelper
  }

  /**
   * @param packageInfo Information about the package.
   */
  constructor(packageInfo: PackageInfo) {
    this._packageInfo = packageInfo
    this._optionsBuilderHelper = new OptionsBuilderHelper(
      vscode.workspace.getConfiguration(
        this._packageInfo.packageConfigurationSection,
      ),
    )
  }

  /**
   * Base implementation of build. Override this method to build options for a specific package.
   * @param uris File paths and folder paths to run package for.
   * @returns Options for the package.
   */
  public async build(uris: vscode.Uri[]): Promise<string[]> {
    this._optionsBuilderHelper = new OptionsBuilderHelper(
      vscode.workspace.getConfiguration(
        this._packageInfo.packageConfigurationSection,
        uris[0],
      ),
    )
    const options = ['-m', this._packageInfo.packageName]
    if (uris.length > 0) {
      options.push(...uris.map(uri => `"${uri.fsPath.replace(/\\/g, '/')}"`))
    }
    return Promise.resolve(options)
  }
}
