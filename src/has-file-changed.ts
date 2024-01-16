import type { Cache } from "./types"

export function hasFileChanged(cache: Cache, path: string, hash: string): boolean {
  // Not in cache
  if (!cache[path]) return true

  // Hash is different
  if (cache[path].hash !== hash) return true

  // Job didn't finish previously
  if (!cache[path].count || cache[path].count !== cache[path].generatedFiles.length)
    return true

  // Not changed
  return false
}
