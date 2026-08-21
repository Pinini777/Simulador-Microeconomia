import { describe, it, expect } from 'vitest'
import { calcularFPP } from './fpp'

describe('calcularFPP', () => {
  it('classifies frontier points as efficient', () => {
    const result = calcularFPP(10, 10, 0, 10)
    expect(result.status).toBe('eficiente')
    expect(result.nearFrontier).toBe(true)
  })

  it('classifies inside points as inefficient', () => {
    const result = calcularFPP(10, 10, 0, 5)
    expect(result.status).toBe('ineficiente')
    expect(result.nearFrontier).toBe(false)
  })

  it('classifies outside points as unattainable', () => {
    const result = calcularFPP(10, 10, 0, 15)
    expect(result.status).toBe('inalcanzable')
  })

  it('keeps nearFrontier independent of status', () => {
    const result = calcularFPP(10, 10, 0, 9.6)
    expect(result.status).toBe('ineficiente')
    expect(result.nearFrontier).toBe(true)
  })
})
