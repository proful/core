import { Action, FIT_TO_SCREEN_PADDING } from 'state/constants'
import { Utils } from '@tldraw/core'
import Vec from '@tldraw/vec'
import { mutables } from 'state/mutables'
import { getShapeUtils } from 'shapes'
import { getZoomFitCamera } from 'state/helpers'

export const zoomToFit: Action = (data) => {
  const { camera } = data.pageState
  const { rendererBounds } = mutables

  const shapes = Object.values(data.page.shapes)

  if (shapes.length === 0) return

  const commonBounds = Utils.getCommonBounds(
    shapes.map((shape) => getShapeUtils(shape).getBounds(shape))
  )

  let zoom = Math.min(
    (rendererBounds.width - FIT_TO_SCREEN_PADDING) / commonBounds.width,
    (rendererBounds.height - FIT_TO_SCREEN_PADDING) / commonBounds.height
  )

  zoom = camera.zoom === zoom || camera.zoom < 1 ? Math.min(1, zoom) : zoom

  const delta = [
    (rendererBounds.width - commonBounds.width * zoom) / 2 / zoom,
    (rendererBounds.height - commonBounds.height * zoom) / 2 / zoom,
  ]

  camera.zoom = zoom
  camera.point = Vec.add([-commonBounds.minX, -commonBounds.minY], delta)
}
