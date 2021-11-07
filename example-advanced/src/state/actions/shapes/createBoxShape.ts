import { TLBoundsCorner, TLPointerInfo } from '@tldraw/core'
import { shapeUtils } from 'shapes'
import type { Action } from 'state/constants'
import { getPagePoint } from 'state/helpers'
import { mutables } from 'state/mutables'

export const createBoxShape: Action = (data, payload: TLPointerInfo) => {
  // shapeUtils provides the abstraction for different shapes e.g., box or arrow
  // box => instance of BoxUtil knows how to create a Box, it can defaults some props
  const shape = shapeUtils.box.getShape({
    parentId: 'page1',
    // getPagePoint => returns correct point based on zoom level & panning
    point: getPagePoint(payload.point, data.pageState),
    size: [1, 1],
    childIndex: Object.values(data.page.shapes).length,
  })

  data.page.shapes[shape.id] = shape
  data.pageState.selectedIds = [shape.id]

  mutables.pointedBoundsHandleId = TLBoundsCorner.BottomRight
}
