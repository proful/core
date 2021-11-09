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

  // snapshot => another copy of page & pageState
  const initialSelectedIds = snapshot.pageState.selectedIds

  const hits = Object.values(data.page.shapes)
    .filter((shape) => {
      // Different shape (box, arrow, ecllipse) has different bounding box
      // getShapeUtils(shape) returns BoxUtil or ArrowUtil this needs to be implemented
      const shapeBounds = getShapeUtils(shape).getBounds(shape)

      // boundsContain => shape contained inside brush selection
      // boundsCollide => brush selection just touching or intersecting with shape
      // if you press cmd + brush it only select contained not collision
      return (
        Utils.boundsContain(brushBounds, shapeBounds) ||
        (!payload.metaKey && Utils.boundsCollide(brushBounds, shapeBounds))
      )
    })
    .map((shape) => shape.id)

  if (payload.shiftKey) {
    // Add more shapes to selection if dragging brush by pressing shift
    // unique ids between initialSelectedIds & hits
    data.pageState.selectedIds = Array.from(new Set([...initialSelectedIds, ...hits]).values())
  } else {
    //
    data.pageState.selectedIds = hits
  }
}
