import * as React from 'react'
import { renderWithSvg, screen } from '~test'
import { Brush } from './brush'

describe('brush', () => {
  test('mounts component without crashing', () => {
    renderWithSvg(
      <Brush
        brush={{
          minX: 0,
          maxX: 100,
          minY: 0,
          maxY: 100,
          width: 100,
          height: 100,
        }}
      />
    )
  })
  test('validate attributes for brush component', () => {
    renderWithSvg(
      <Brush
        brush={{
          minX: 0,
          maxX: 100,
          minY: 0,
          maxY: 100,
          width: 100,
          height: 100,
        }}
      />
    )
    screen.debug()
    const brush = screen.getByLabelText('brush')

    expect(brush).toHaveAttribute('x', '0')
    expect(brush).toHaveAttribute('y', '0')
    expect(brush).toHaveAttribute('opacity', '1')
    expect(brush).toHaveAttribute('width', '100')
    expect(brush).toHaveAttribute('height', '100')
  })
})
