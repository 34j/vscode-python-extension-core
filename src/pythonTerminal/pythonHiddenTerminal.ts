import type { IPythonTerminal } from './types'
import * as child_process from 'node:child_process'

/**
 * Provides a properly configured hidden terminal (child_process) for executing Python commands.
 */
export class PythonHiddenTerminal implements IPythonTerminal {
  public async send(command: string[], addNewLine?: boolean): Promise<void> {
    if (addNewLine) {
      throw new Error('addNewLine is not supported for hidden terminal.')
    }

    // Create child_process
    console.warn(`Running command: ${command.join(' ')}`)
    try {
      await new Promise((resolve, reject) => {
        if (command[0] === undefined) {
          reject(new Error('No command to run.'))
          return
        }
        const child = child_process.spawn(command[0], command.slice(1), {
          shell: true,
        })
        child.stdout.on('data', (data) => {
          console.warn(`Stdout: ${data}`)
        })
        child.stderr.on('data', (data) => {
          console.error(`Stderr: ${data}`)
          reject(new Error(`Stderr: ${data}`))
        })
        child.on('close', (code) => {
          console.warn(`Child process exited with code ${code}.`)
          resolve('Done')
        })
      })
    }
    catch (e) {
      throw new Error(`${e}`)
    }
  }
}
