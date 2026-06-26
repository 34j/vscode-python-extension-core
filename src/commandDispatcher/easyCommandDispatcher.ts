import type { IOptionsBuilder, IPackageRunner } from '../packageRunner/types'
import type { PackageInfo } from '../types'
import * as vscode from 'vscode'
import { PackageRunner } from '../packageRunner/packageRunner'
import { HiddenTerminal } from '../pythonTerminal/pythonHiddenTerminal'
import { PythonVSCodeTerminal } from '../pythonTerminal/pythonVSCodeTerminal'
import { BasicCommandDispatcher } from './basicCommandDispatcher'

export class EasyCommandDispatcher extends BasicCommandDispatcher {
  private optionsBuilder: IOptionsBuilder
  constructor(
    context: vscode.ExtensionContext,
    packageInfo: PackageInfo,
    optionsBuilder: IOptionsBuilder,
  ) {
    super(
      context,
      packageInfo,
      EasyCommandDispatcher.createPackageRunner(packageInfo, optionsBuilder),
    )
    this.optionsBuilder = optionsBuilder
  }

  public override activate(): void {
    const disposable = vscode.workspace.onDidChangeConfiguration((e) => {
      if (
        e.affectsConfiguration(
          this.packageInfo.useIntegratedTerminalConfigurationSectionFullName
            .split('.')
            .slice(0, -1)
            .join('.'),
        )
      ) {
        this.packageRunner = EasyCommandDispatcher.createPackageRunner(
          this.packageInfo,
          this.optionsBuilder,
        )
      }
    })

    this.context.subscriptions.push(disposable)
    super.activate()
  }

  private static createPackageRunner(
    packageInfo: PackageInfo,
    optionsBuilder: IOptionsBuilder,
  ): IPackageRunner {
    const split
      = packageInfo.useIntegratedTerminalConfigurationSectionFullName.split('.')
    const splitLast = split[split.length - 1]
    const useIntegrated = splitLast
      ? (vscode.workspace
          .getConfiguration(split.slice(0, -1).join('.'))
          .get<boolean>(splitLast, false))
      : false

    console.warn(`useIntegratedTerminal changed to ${useIntegrated.toString()}`)

    return new PackageRunner(
      useIntegrated
        ? new PythonVSCodeTerminal()
        : new HiddenTerminal(undefined),
      optionsBuilder,
      packageInfo,
      () => Promise.resolve(new PythonVSCodeTerminal()),
    )
  }
}
