import { describe, it, expect } from 'vitest'
import { calcularMercado } from './mercado'

describe('calcularMercado', () => {
  it('resets shifts when leaving the free-market scenario', () => {
    const result = calcularMercado(100, 1, 20, 1, 'impuesto', 5, 10, 8, false, false)
    expect(result.dInt).toBe(100)
    expect(result.sInt).toBe(20)
    expect(result.Qe).toBe(result.Qe_orig)
    expect(result.warningKey).toBeNull()
  })

  it('warns when a demand shock hits a perfectly inelastic demand', () => {
    const result = calcularMercado(100, 1, 20, 1, 'libre', 0, 5, 0, true, false)
    expect(result.warningKey).toBe('perfectly_inelastic_with_shock')
    expect(result.explanationKey).toBe('inelastic_demand_quantity_fixed')
  })

  it('lets price absorb a perfectly inelastic demand shock while quantity stays fixed', () => {
    const result = calcularMercado(100, 1, 20, 1, 'libre', 0, 5, 0, true, false)
    expect(result.Qe).toBe(result.Qe_orig)
    expect(result.Pe).toBeCloseTo(65, 2)
  })

  it('lets price absorb a perfectly inelastic supply shock while quantity stays fixed', () => {
    const result = calcularMercado(100, 1, 20, 1, 'libre', 0, 0, 5, false, true)
    expect(result.Qe).toBe(result.Qe_orig)
    expect(result.Pe).toBeCloseTo(55, 2)
    expect(result.warningKey).toBe('perfectly_inelastic_with_shock')
    expect(result.explanationKey).toBe('inelastic_supply_quantity_fixed')
  })

  it('warns and explains a shock when both curves are perfectly inelastic', () => {
    const result = calcularMercado(100, 1, 20, 1, 'libre', 0, 0, 5, true, true)
    expect(result.warningKey).toBe('perfectly_inelastic_with_shock')
    expect(result.explanationKey).toBe('perfectly_inelastic_quantity_fixed')
    expect(result.Qe).toBe(result.Qe_orig)
  })
})
