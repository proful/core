import * as React from 'react'
import { renderWithContext, screen } from '~test'
import { Handles } from './handles'
import { boxShape } from '~shape-utils/TLShapeUtil.spec'

describe('handles', () => {
  test('mounts component without crashing', () => {
    renderWithContext(<Handles shape={boxShape} zoom={1} />)
  })
  test('validate attributes for handles component', () => {
    const boxShapeWithHandles = {
      ...boxShape,
      handles: {
        'handle-1': {
          id: 'handle-1',
          index: 0,
          point: [10, 10],
        },
        'handle-2': {
          id: 'handle-2',
          index: 1,
          point: [200, 200],
        },
      },
    }

    renderWithContext(<Handles shape={boxShapeWithHandles} zoom={1} />)
  })
})
