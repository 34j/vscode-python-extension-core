import { IPackageInfo } from '../types';
import { IOptionsBuilder } from './types';
import * as vscode from 'vscode';

export class OptionsBuilder implements IOptionsBuilder {
  private _packageInfo: IPackageInfo;
  get packageInfo(): IPackageInfo {
    return this._packageInfo;
  }

  constructor(packageInfo: IPackageInfo) {
    this._packageInfo = packageInfo;
  }

  public async build(uris: vscode.Uri[]): Promise<string[]> {
    const options = ['-m', this._packageInfo.packageName];
    if (uris.length > 0) {
      options.push(...uris.map(uri => uri.fsPath));
    }
    return Promise.resolve(options);
  }
}
