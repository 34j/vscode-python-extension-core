import { PackageInfo } from '../types';
import { IOptionsBuilder } from './types';
import * as vscode from 'vscode';
import { OptionsBuilderHelper } from './optionsBuilder';

export class OptionsBuilderBase implements IOptionsBuilder {
  private _packageInfo: PackageInfo;
  get packageInfo(): PackageInfo {
    return this._packageInfo;
  }
  private _optionsBuilderHelper;
  protected get optionsBuilderHelper(): OptionsBuilderHelper {
    return this._optionsBuilderHelper;
  }

  constructor(packageInfo: PackageInfo) {
    this._packageInfo = packageInfo;
    this._optionsBuilderHelper = new OptionsBuilderHelper(
      vscode.workspace.getConfiguration(
        this._packageInfo.packageConfigurationSection
      )
    );
  }

  public async build(uris: vscode.Uri[]): Promise<string[]> {
    this._optionsBuilderHelper = new OptionsBuilderHelper(
      vscode.workspace.getConfiguration(
        this._packageInfo.packageConfigurationSection,
        uris[0]
      )
    );
    const options = ['-m', this._packageInfo.packageName];
    if (uris.length > 0) {
      options.push(...uris.map(uri => uri.fsPath));
    }
    return Promise.resolve(options);
  }
}
