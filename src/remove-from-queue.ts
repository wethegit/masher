import { QUEUE } from "./const"

export function removeFromQueue(path: string) {
  // remove from queue in place
  QUEUE.splice(
    QUEUE.findIndex((d) => d.path === path),
    1
  )
}
