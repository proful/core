import * as React from 'react'
import type { TLBounds } from '~types'
import { usePosition } from '~hooks'

interface ContainerProps {
  id?: string
  bounds: TLBounds
  isGhost?: boolean
  rotation?: number
  children: React.ReactNode
}

export const Container = React.memo(function Container({
  id,
  bounds,
  rotation = 0,
  isGhost = false,
  children,
}: ContainerProps) {
  const rPositioned = usePosition(bounds, rotation)

  return (
    <div
      id={id}
      ref={rPositioned}
      className={isGhost ? 'tl-positioned tl-ghost' : 'tl-positioned'}
      aria-label="container"
    >
      {children}
    </div>
  )
})
