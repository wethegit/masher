import type { QueueItem } from "./types"
import { QUEUE } from "./const"

export function addToQueue(queueItem: QueueItem) {
  return QUEUE.push(queueItem)
}
