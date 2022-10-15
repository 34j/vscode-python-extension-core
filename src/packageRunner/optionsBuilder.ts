import * as vscode from 'vscode';

export class OptionsBuilderHelper {
  private _config: vscode.WorkspaceConfiguration;
  get config(): vscode.WorkspaceConfiguration {
    return this._config;
  }
  private _flagPrefix: string;
  constructor(config: vscode.WorkspaceConfiguration, flagPrefix = '--') {
    this._config = config;
    this._flagPrefix = flagPrefix;
  }

  public buildFlags(flags: string[]): string[] {
    return flags
      .filter(flag => this.config.get<boolean>(flag, false))
      .map(flag => this.buildParameterExpression(flag));
  }

  public buildParameters(parameters: string[]): string[] {
    return parameters
      .map(parameter => {
        const value = this.config.get<string | number>(parameter);
        return value
          ? [this.buildParameterExpression(parameter), value.toString()]
          : [];
      })
      .reduce((previous, current) => previous.concat(current), []);
  }

  public buildListParameters(listParameters: string[]): string[] {
    return listParameters
      .map(listParameter => {
        const list = this.config.get<string[]>(listParameter, []);
        if (list.length > 0) {
          return [this.buildParameterExpression(listParameter), ...list];
        }
        return [];
      })
      .reduce((previous, current) => previous.concat(current), []);
  }

  public buildParameterExpression(name: string): string {
    return this._flagPrefix + name;
  }
}
