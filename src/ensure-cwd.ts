import { resolve } from "node:path"

import fse from "fs-extra"

import { log } from "./log"
import { LOG_TYPE } from "./const"

interface EnsureCwdOptions {
  createIfNotExist: boolean
}

/**
 * Ensures the current working directory exists.
 */
export async function ensureCwd(
  root?: string,
  options?: EnsureCwdOptions
): Promise<string> {
  const { createIfNotExist } = options || {}
  const cwd = root ? resolve(root) : process.cwd()

  // Ensure target directory exists.
  try {
    if (!(await fse.pathExists(cwd))) {
      if (createIfNotExist) await fse.ensureDir(cwd)
      else {
        log(LOG_TYPE.error, `Directory ${cwd} does not exist`)
        process.exit(1)
      }

      return cwd
    }
  } catch (error) {
    console.log(error)
    process.exit(1)
  }

  return cwd
}
