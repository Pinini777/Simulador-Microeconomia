import { describe, it, expect } from 'vitest'
import { calcularMonopolio, calcularRegulacionNatural } from './monopolio'

describe('calcularMonopolio', () => {
  it('computes both P = ATC roots and selects the higher-Q outcome', () => {
    const result = calcularMonopolio(30, 'regulacion_cme')
    expect(result.regulation.status).toBe('dual_intersection')
    expect(result.regulation.intersections).toHaveLength(2)
    expect(result.regulation.selected.q).toBeCloseTo(28.94, 2)
    expect(result.regulation.selected.p).toBeCloseTo(9.53, 2)
    expect(result.regulation.alternative.q).toBeCloseTo(11.06, 2)
  })

  it('exposes a no-solution state when the curves do not intersect', () => {
    const result = calcularRegulacionNatural(24, 0.5, 4, 300)
    expect(result.status).toBe('no_solution')
    expect(result.intersections).toHaveLength(0)
    expect(result.selected).toBeNull()
  })
})
