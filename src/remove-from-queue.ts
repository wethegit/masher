import type { Queue } from "./types"

export function removeFromQueue(path: string, queue: Queue) {
  return queue.filter((d) => d.path !== path)
}
