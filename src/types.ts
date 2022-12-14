/**
 * Information about the Python package and VSCode configuration.
 */
export type PackageInfo = {
  packageName: string;
  packageDisplayName: string;
  extensionName: string;
  runCommandName: string;
  runForWorkspaceCommandName: string;
  packageConfigurationSection: string;
  useIntegratedTerminalConfigurationSectionFullName: string;
};
