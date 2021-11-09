import { current } from 'immer'
import type { Action } from 'state/constants'
import { mutables } from 'state/mutables'

export const setSnapshot: Action = (data) => {
  // current => Takes a snapshot of the current state of a draft and finalizes it
  // this can be used to save it to file
  // slightly expensive
  mutables.snapshot = current(data)
}
