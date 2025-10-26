/**
 * Information about the Python package and VSCode configuration.
 */
export interface PackageInfo {
  packageName: string
  packageDisplayName: string
  extensionName: string
  runCommandName: string
  runForWorkspaceCommandName: string
  packageConfigurationSection: string
  useIntegratedTerminalConfigurationSectionFullName: string
}
