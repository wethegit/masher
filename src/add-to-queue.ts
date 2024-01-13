import type { Queue, QueueItem } from "./types"

export function addToQueue(queueItem: QueueItem, queue: Queue) {
  return queue.concat([queueItem])
}
