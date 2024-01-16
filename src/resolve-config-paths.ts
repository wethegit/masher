import { resolve } from "node:path"

import type { Config } from "./types"

/**
 * Resolves the paths in the config with absolute paths so we can use them internally.
 */
export function resolveConfigPaths(cwd: string, config: Config): Config {
  let { inputPath, outputPath } = config

  inputPath = resolve(cwd, inputPath)
  outputPath = resolve(cwd, outputPath)

  return {
    ...config,
    inputPath,
    outputPath,
  }
}
