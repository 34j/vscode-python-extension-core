import { IPackageInfo } from '../types';
import { IOptionsBuilder } from './types';
import * as vscode from 'vscode';
import { OptionsBuilderHelper } from './optionsBuilder';

export class OptionsBuilderBase implements IOptionsBuilder {
  private _packageInfo: IPackageInfo;
  get packageInfo(): IPackageInfo {
    return this._packageInfo;
  }
  private _optionsBuilderHelper;
  protected get optionsBuilderHelper(): OptionsBuilderHelper {
    return this._optionsBuilderHelper;
  }

  constructor(packageInfo: IPackageInfo) {
    this._packageInfo = packageInfo;
    this._optionsBuilderHelper = new OptionsBuilderHelper(
      vscode.workspace.getConfiguration(this._packageInfo.extensionName)
    );
  }

  public async build(uris: vscode.Uri[]): Promise<string[]> {
    const options = ['-m', this._packageInfo.packageName];
    if (uris.length > 0) {
      options.push(...uris.map(uri => uri.fsPath));
    }
    return Promise.resolve(options);
  }
}
