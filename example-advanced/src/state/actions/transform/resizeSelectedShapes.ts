import { TLBoundsCorner, TLBoundsEdge, TLPointerInfo, Utils } from '@tldraw/core'
import Vec from '@tldraw/vec'
import { getShapeUtils } from 'shapes'
import type { Action } from 'state/constants'
import { getPagePoint } from 'state/helpers'
import { mutables } from 'state/mutables'

// Scenario 1:
// After creating box by clicking on canvas & stretching around to see the shape size
// Simple case: first point is the top left & drag till bottom right
// But it can get complicated there will be various direction you can stretch
// https://github.com/proful/tldraw-core-docs/blob/main/gif/01-create-box.gif
export const resizeSelectedShapes: Action = (data, payload: TLPointerInfo) => {
  const { pointedBoundsHandleId, initialPoint, snapshot } = mutables
  const { selectedIds } = data.pageState

  const initialCommonBounds = Utils.getCommonBounds(
    selectedIds
      .map((id) => snapshot.page.shapes[id])
      .map((shape) => getShapeUtils(shape).getBounds(shape))
  )

  const point = getPagePoint(payload.point, data.pageState)

  let rotation = 0
  let delta = Vec.sub(point, initialPoint)

  if (selectedIds.length === 1) {
    rotation = snapshot.page.shapes[selectedIds[0]].rotation || 0
  }

  let nextCommonBounds = Utils.getTransformedBoundingBox(
    initialCommonBounds,
    pointedBoundsHandleId as TLBoundsCorner | TLBoundsEdge,
    delta,
    rotation,
    payload.shiftKey
  )

  const { scaleX, scaleY } = nextCommonBounds

  selectedIds.forEach((id) => {
    const initialShape = snapshot.page.shapes[id]
    const shape = data.page.shapes[id]

    const relativeBoundingBox = Utils.getRelativeTransformedBoundingBox(
      nextCommonBounds,
      initialCommonBounds,
      getShapeUtils(initialShape).getBounds(initialShape),
      scaleX < 0,
      scaleY < 0
    )

    // Based on updated relativeBoundingBox, calculate box's point & size
    getShapeUtils(shape).transform(shape, relativeBoundingBox, initialShape, [scaleX, scaleY])
  })
}
