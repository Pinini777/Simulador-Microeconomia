import { describe, it, expect } from 'vitest'
import { calcularCostos } from './costos'

describe('calcularCostos', () => {
  it('derives the ATC minimum near (9.62, 7.38)', () => {
    const result = calcularCostos(7.5)
    expect(result.minCTM_Q).toBeCloseTo(9.62, 2)
    expect(result.minCTM_P).toBeCloseTo(7.38, 2)
  })

  it('returns shutdown profit equal to -fixedCost', () => {
    const result = calcularCostos(2)
    expect(result.status).toBe('cierre')
    expect(result.currentProfit).toBeCloseTo(-30, 2)
  })
})
