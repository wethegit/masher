import { resolve } from "node:path"

import fse from "fs-extra"
import chalk from "chalk"

import type { Config } from "./types"
import { DEFAULT_CONFIG_FILE_NAME, DEFAULT_CONFIG_VALUES, LOG_TYPE } from "./const"
import { ensureCwd } from "./ensure-cwd"
import { log } from "./log"
import { resolveConfigPaths } from "./resolve-config-paths"

interface BuildAndParseConfigOptions {
  errorIfNotFound?: boolean
}

/**
 * Builds and parses the config file.
 * If a config file is found, it will be merged with the default config.
 * If no config file is found, it will prompt the user for config options.
 */
export async function buildAndParseConfig(
  root: string,
  options?: BuildAndParseConfigOptions
): Promise<Config> {
  const { errorIfNotFound = false } = options || {}

  log(LOG_TYPE.message, "Determining config options...")

  const cwd = root || (await ensureCwd(root))

  let config: Config = DEFAULT_CONFIG_VALUES

  const localConfigFile = resolve(cwd, DEFAULT_CONFIG_FILE_NAME)

  const doesConfigFileExist = await fse.pathExists(localConfigFile)

  if (!doesConfigFileExist && errorIfNotFound) {
    log(
      LOG_TYPE.error,
      `No ${chalk.red.bold(DEFAULT_CONFIG_FILE_NAME)} file found. Run ${chalk.red.bold(
        "init"
      )} first before adding components.`
    )

    process.exit(1)
  }

  if (doesConfigFileExist) {
    try {
      // if we found a local config file, we want to merge it with the default config
      const localConfig = (await fse.readJson(localConfigFile)) as Config

      config = {
        ...config,
        ...localConfig,
      }
    } catch (e) {
      log(LOG_TYPE.error, "Error parsing local config file")
      process.exit(1)
    }
  }

  // Resolve paths so we can work with them internally
  const resolvedConfig = resolveConfigPaths(cwd, config)

  // Write to file.
  const targetPath = resolve(cwd, DEFAULT_CONFIG_FILE_NAME)

  try {
    await fse.outputJson(targetPath, config, { spaces: 2 })
  } catch (error) {
    log(LOG_TYPE.error, `Failed to write ${targetPath}.`)
    console.log(error)
    process.exit(1)
  }

  return resolvedConfig
}
