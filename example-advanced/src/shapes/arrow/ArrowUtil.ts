import { Utils, TLBounds } from '@tldraw/core'
import Vec from '@tldraw/vec'
import { CustomShapeUtil } from 'shapes/CustomShapeUtil'
import { ArrowComponent } from './ArrowComponent'
import { ArrowIndicator } from './ArrowIndicator'
import type { ArrowShape } from './ArrowShape'

type T = ArrowShape
type E = SVGSVGElement

export class ArrowUtil extends CustomShapeUtil<T, E> {
  Component = ArrowComponent

  Indicator = ArrowIndicator

  getBounds = (shape: T) => {
    const bounds = Utils.getFromCache(this.boundsCache, shape, () => {
      const { start, end } = shape.handles
      return Utils.getBoundsFromPoints([start.point, end.point])
    })

    return Utils.translateBounds(bounds, shape.point)
  }

  /* ----------------- Custom Methods ----------------- */

  hideBounds = true

  getCenter = (shape: T) => {
    return Utils.getBoundsCenter(this.getBounds(shape))
  }

  transform = (shape: T, bounds: TLBounds, initialShape: T, scale: number[]) => {
    const { start, end } = initialShape.handles
    const initialBounds = this.getBounds(initialShape)
    const nStart = Vec.divV(start.point, [initialBounds.width, initialBounds.height])
    const nEnd = Vec.divV(end.point, [initialBounds.width, initialBounds.height])

    if (scale[0] < 0) {
      const t = nStart[0]
      nStart[0] = nEnd[0]
      nEnd[0] = t
    }

    if (scale[1] < 0) {
      const t = nStart[1]
      nStart[1] = nEnd[1]
      nEnd[1] = t
    }

    shape.point = [bounds.minX, bounds.minY]
    shape.handles.start.point = Vec.mulV([bounds.width, bounds.height], nStart)
    shape.handles.end.point = Vec.mulV([bounds.width, bounds.height], nEnd)
  }

  translateHandle = (shape: T, initialShape: T, handleId: keyof T['handles'], delta: number[]) => {
    const handlePoints = {
      start: [...initialShape.handles.start.point],
      end: [...initialShape.handles.end.point],
    }

    handlePoints[handleId] = Vec.add(handlePoints[handleId], delta)

    const offset = Utils.getCommonTopLeft([handlePoints.start, handlePoints.end])

    shape.handles.start.point = Vec.sub(handlePoints.start, offset)
    shape.handles.end.point = Vec.sub(handlePoints.end, offset)
    shape.point = Vec.add(initialShape.point, offset)
  }
}
