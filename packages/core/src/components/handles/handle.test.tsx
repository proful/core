import * as React from 'react'
import { renderWithContext, screen } from '~test'
import { Handle } from './handle'

describe('handles', () => {
  test('mounts component without crashing', () => {
    renderWithContext(<Handle id="handle-1" point={[30, 40]} />)
  })
  test('validate attributes for handles component', () => {
    renderWithContext(<Handle id="handle-1" point={[30, 40]} />)
    const handle = screen.getByLabelText('handle')
    expect(handle.querySelectorAll('circle').length).toBe(2)
  })
})
