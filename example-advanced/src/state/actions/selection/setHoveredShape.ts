import type { TLPointerInfo } from '@tldraw/core'
import type { Action } from 'state/constants'

// Provides the action needs to happen when we hover any shape
// payload data is passed from app.tsx as info via state machine
export const setHoveredShape: Action = (data, payload: TLPointerInfo) => {
  data.pageState.hoveredId = payload.target
}
