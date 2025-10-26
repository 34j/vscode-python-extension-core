import type * as vscode from 'vscode'

/**
 * Helper class to create command line arguments from vscode Workspace Configuration.
 */
export class OptionsBuilderHelper {
  private _config: vscode.WorkspaceConfiguration
  get config(): vscode.WorkspaceConfiguration {
    return this._config
  }

  private _flagPrefix: string
  /**
   * @param config Workspace Configuration.
   * @param flagPrefix Prefix of the command line arguments. e.g. '--', sometimes '-'.
   */
  constructor(config: vscode.WorkspaceConfiguration, flagPrefix = '--') {
    this._config = config
    this._flagPrefix = flagPrefix
  }

  /**
   * Build command line arguments from a list of flags.
   * @param flags Array of flag names. Each flag name must not contain the flag prefix, e.g. '--'. e.g. 'verbose' is a valid flag name, '--verbose' is not.
   * @returns Array of command line arguments.
   */
  public buildFlags(flags: string[]): string[] {
    return flags
      .filter(flag => this.config.get<boolean>(flag, false))
      .map(flag => this.buildParameterExpression(flag))
  }

  /**
   * Build command line arguments from a list of parameters.
   * @param parameters Array of parameter names. Each parameter name must not contain the flag prefix, e.g. '--'. e.g. 'verbose' is a valid parameter name, '--verbose' is not.
   * @returns Array of command line arguments.
   */
  public buildParameters(parameters: string[]): string[] {
    return parameters
      .map((parameter) => {
        const value = this.config.get<string | number>(parameter)
        return value
          ? [this.buildParameterExpression(parameter), value.toString()]
          : []
      })
      .reduce((previous, current) => previous.concat(current), [])
  }

  /**
   * Build command line arguments from a list of list parameters.
   * @param listParameters Array of parameter names. Each parameter name must not contain the flag prefix, e.g. '--'. e.g. 'verbose' is a valid parameter name, '--verbose' is not.
   * @returns Array of command line arguments.
   */
  public buildListParameters(listParameters: string[]): string[] {
    return listParameters
      .map((listParameter) => {
        const list = this.config.get<string[]>(listParameter, [])
        if (list.length > 0) {
          return [this.buildParameterExpression(listParameter), list.join(',')]
        }
        return []
      })
      .reduce((previous, current) => previous.concat(current), [])
  }

  /**
   * Convert a parameter name to a command line argument. (e.g. 'verbose' to '--verbose')
   * @param name Name of the parameter. Must not contain the flag prefix, e.g. '--'. e.g. 'verbose' is a valid parameter name, '--verbose' is not.
   * @returns Expression of the parameter, e.g. '--verbose'.
   */
  public buildParameterExpression(name: string): string {
    return this._flagPrefix + name
  }
}
