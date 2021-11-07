import type { Action } from 'state/constants'
import { TLPointerInfo, Utils } from '@tldraw/core'
import { mutables } from '../../mutables'
import { getPagePoint } from 'state/helpers'
import { getShapeUtils } from 'shapes'

// Draw a brush on the screen
// Change our selection based on what brush is touching
// collides, overlap or contain other shapes
// https://github.com/proful/tldraw-core-docs/blob/main/gif/02-brushing.gif
export const updateBrush: Action = (data, payload: TLPointerInfo) => {
  const { initialPoint, snapshot } = mutables

  // Draw a brush on the screen, calculate brush rectangle dimension
  const brushBounds = Utils.getBoundsFromPoints([
    // getPagePoint => converts screen point wrt world co-ordinates (Zoom & Pan)
    getPagePoint(payload.point, data.pageState), // pageState needs to pass for getting camera info
    initialPoint,
  ])

  data.pageState.brush = brushBounds

  const initialSelectedIds = snapshot.pageState.selectedIds

  const hits = Object.values(data.page.shapes)
    .filter((shape) => {
      const shapeBounds = getShapeUtils(shape).getBounds(shape)
      return (
        Utils.boundsContain(brushBounds, shapeBounds) ||
        (!payload.metaKey && Utils.boundsCollide(brushBounds, shapeBounds))
      )
    })
    .map((shape) => shape.id)

  if (payload.shiftKey) {
    data.pageState.selectedIds = Array.from(new Set([...initialSelectedIds, ...hits]).values())
  } else {
    data.pageState.selectedIds = hits
  }
}
