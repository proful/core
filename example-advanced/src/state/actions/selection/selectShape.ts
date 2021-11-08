import type { TLPointerInfo } from '@tldraw/core'
import type { Action } from 'state/constants'
import { mutables } from 'state/mutables'

// https://github.com/proful/tldraw-core-docs/blob/main/gif/03-select.gif
export const selectShape: Action = (data, payload: TLPointerInfo) => {
  const { selectedIds } = data.pageState

  if (payload.shiftKey) {
    if (selectedIds.includes(payload.target) && mutables.pointedShapeId !== payload.target) {
      // if you want to de select something
      selectedIds.splice(selectedIds.indexOf(payload.target), 1)
    } else {
      mutables.pointedShapeId = payload.target
      // if second element selected
      selectedIds.push(payload.target)
    }
  } else {
    // if only one shape is selected, deselecct others if anything already selected
    data.pageState.selectedIds = [payload.target]
  }
}
