import { IPackageInfo } from '../types';
import * as vscode from 'vscode';
import { OptionsBuilderBase } from './optionsBuilderBase';

export class EasyOptionsBuilder extends OptionsBuilderBase {
  private _flags: string[];
  private _parameters: string[];
  private _listParameters: string[];
  protected get flags(): string[] {
    return this._flags;
  }
  protected get parameters(): string[] {
    return this._parameters;
  }
  protected get listParameters(): string[] {
    return this._listParameters;
  }

  constructor(
    packageInfo: IPackageInfo,
    flags: string[],
    parameters: string[],
    listParameters: string[]
  ) {
    super(packageInfo);
    this._flags = flags;
    this._parameters = parameters;
    this._listParameters = listParameters;
  }

  public async build(uris: vscode.Uri[]): Promise<string[]> {
    return (await super.build(uris)).concat(
      this.optionsBuilderHelper.buildFlags(this._flags),
      this.optionsBuilderHelper.buildParameters(this._parameters),
      this.optionsBuilderHelper.buildListParameters(this._listParameters)
    );
  }
}
