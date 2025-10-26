import type * as vscode from 'vscode'
import type { PackageInfo } from '../types'
import { OptionsBuilderBase } from './optionsBuilderBase'

/**
 * Class to build options more easily than inheriting from OptionsBuilderBase.
 */
export class EasyOptionsBuilder extends OptionsBuilderBase {
  private _flags: string[]
  private _parameters: string[]
  private _listParameters: string[]
  private _additionalOptions: string[]
  /**
   * Flag options for the package.
   */
  protected get flags(): string[] {
    return this._flags
  }

  /**
   * Parameter options for the package.
   */
  protected get parameters(): string[] {
    return this._parameters
  }

  /**
   * List parameter options for the package.
   */
  protected get listParameters(): string[] {
    return this._listParameters
  }

  /**
   * Additional options for the package.
   */
  protected get additionalOptions(): string[] {
    return this._additionalOptions
  }

  /**
   * @param packageInfo Information about the package.
   * @param flags Flag options for the package.
   * @param parameters Parameter options for the package.
   * @param listParameters List parameter options for the package.
   * @param additionalOptions Additional options for the package.
   */
  constructor(
    packageInfo: PackageInfo,
    flags: string[],
    parameters: string[],
    listParameters: string[],
    additionalOptions?: string[],
  ) {
    super(packageInfo)
    this._flags = flags
    this._parameters = parameters
    this._listParameters = listParameters
    this._additionalOptions = additionalOptions || []
  }

  public async build(uris: vscode.Uri[]): Promise<string[]> {
    return (await super.build(uris)).concat(
      this.optionsBuilderHelper.buildFlags(this._flags),
      this.optionsBuilderHelper.buildParameters(this._parameters),
      this.optionsBuilderHelper.buildListParameters(this._listParameters),
      this._additionalOptions,
    )
  }
}
