# vscode-python-extension-core

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

Core package to create VSCode Python extension. Use [34j/vscode-python-extension-cookiecutter](https://github.com/34j/vscode-python-extension-cookiecutter) to create a new extension.

See the above package for usage.

## Install

```bash
npm install vscode-python-extension-core
```

## Usage

```ts
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as core from "vscode-python-extension-core";
import { PackageInfo } from "vscode-python-extension-core";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const packageInfo: PackageInfo = {
    packageName: "{{cookiecutter.module_name}}",
    packageDisplayName: "{{cookiecutter.module_name}}",
    extensionName: "{{cookiecutter.ext_name}}",
    runCommandName: "{{cookiecutter.ext_name}}.run",
    runForWorkspaceCommandName: "{{cookiecutter.ext_name}}.runForWorkspace",
    packageConfigurationSection: "{{cookiecutter.ext_name}}.settings",
    useIntegratedTerminalConfigurationSectionFullName:
      "{{cookiecutter.ext_name}}.useIntegratedTerminal",
  };
  const disp = new core.commandDispatcher.EasyCommandDispatcher(
    context,
    packageInfo,
    new core.packageRunner.EasyOptionsBuilder(
      packageInfo,
      [], [], [], []
    )
  );
  disp.activate();
}

// this method is called when your extension is deactivated
export function deactivate() {}
```

## API

### commandDispatcher

Helper class to dispatch VSCode commands.

### packageRunner

Helper class to run Python packages.

### pythonTerminal

Helper class to run Python commands in VSCode terminal or child_process.

### PackageInfo

Information about the Python package to run. This class is used everywhere.

[build-img]:https://github.com/34j/vscode-python-extension-core/actions/workflows/release.yml/badge.svg
[build-url]:https://github.com/34j/vscode-python-extension-core/actions/workflows/release.yml
[downloads-img]:https://img.shields.io/npm/dt/vscode-python-extension-core
[downloads-url]:https://www.npmtrends.com/vscode-python-extension-core
[npm-img]:https://img.shields.io/npm/v/vscode-python-extension-core
[npm-url]:https://www.npmjs.com/package/vscode-python-extension-core
[issues-img]:https://img.shields.io/github/issues/34j/vscode-python-extension-core
[issues-url]:https://github.com/34j/vscode-python-extension-core/issues
[codecov-img]:https://codecov.io/gh/34j/vscode-python-extension-core/branch/main/graph/badge.svg
[codecov-url]:https://codecov.io/gh/34j/vscode-python-extension-core
[semantic-release-img]:https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]:https://github.com/semantic-release/semantic-release
[commitizen-img]:https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]:http://commitizen.github.io/cz-cli/
