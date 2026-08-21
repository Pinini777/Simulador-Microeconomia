import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Costos from './Costos'
import FPP from './FPP'
import Mercado from './Mercado'
import Monopolio from './Monopolio'

describe('Costos integration', () => {
  it('resets controls to defaults', async () => {
    const user = userEvent.setup()
    render(<Costos />)
    const slider = screen.getByRole('slider')
    fireEvent.change(slider, { target: { value: '14' } })
    expect(screen.getByText('14.0')).toBeTruthy()

    await user.click(screen.getByLabelText(/Restablecer simulador de costos/))
    expect(screen.getByText('8.0')).toBeTruthy()
    expect(slider.value).toBe('8')
  })

  it('renders shutdown hatch and fixed-cost loss label when price is below minimum AVC', async () => {
    const user = userEvent.setup()
    render(<Costos />)
    const slider = screen.getByRole('slider')
    fireEvent.change(slider, { target: { value: '2' } })

    expect(screen.getByText('CIERRE DE EMPRESA')).toBeTruthy()
    expect(screen.getByText('-30')).toBeTruthy()
    expect(screen.getByText(/CF/)).toBeTruthy()
  })

  it('places the break-even label at the computed ATC minimum', () => {
    const { container } = render(<Costos />)
    const label = screen.getByText('P. NIVELACIÓN')
    expect(label).toBeTruthy()

    const circle = label.parentElement.querySelector('circle')
    expect(circle).toBeTruthy()

    const expectedCx = 60 + (9.62 / 16) * (650 - 60 - 30)
    const expectedCy = 450 - 50 - (7.38 / 18) * (450 - 50 - 30)
    expect(Number(circle.getAttribute('cx'))).toBeCloseTo(expectedCx, 0)
    expect(Number(circle.getAttribute('cy'))).toBeCloseTo(expectedCy, 0)
  })
})

describe('FPP integration', () => {
  it('resets controls to defaults', async () => {
    const user = userEvent.setup()
    render(<FPP />)
    const sliders = screen.getAllByRole('slider')
    fireEvent.change(sliders[0], { target: { value: '120' } })
    fireEvent.change(sliders[2], { target: { value: '80' } })
    expect(sliders[0].value).toBe('120')
    expect(sliders[2].value).toBe('80')

    await user.click(screen.getByLabelText(/Restablecer simulador de FPP/))
    expect(sliders[0].value).toBe('100')
    expect(sliders[1].value).toBe('100')
    expect(sliders[2].value).toBe('50')
    expect(sliders[3].value).toBe('50')
  })

  it('shows near-frontier halo without changing the strict status', async () => {
    render(<FPP />)
    const sliders = screen.getAllByRole('slider')
    fireEvent.change(sliders[0], { target: { value: '100' } })
    fireEvent.change(sliders[1], { target: { value: '100' } })
    fireEvent.change(sliders[2], { target: { value: '71' } })
    fireEvent.change(sliders[3], { target: { value: '70' } })

    expect(screen.getByText('ineficiente')).toBeTruthy()
    expect(screen.getByLabelText('Punto cercano a la frontera')).toBeTruthy()
  })
})

describe('Mercado integration', () => {
  it('resets controls to defaults', async () => {
    const user = userEvent.setup()
    render(<Mercado />)
    await user.click(screen.getByText('impuesto'))
    expect(screen.queryByText('Desplazamientos (Shocks)')).toBeFalsy()

    const impuestoSliders = screen.getAllByRole('slider')
    fireEvent.change(impuestoSliders[0], { target: { value: '6' } })

    await user.click(screen.getByText('Restablecer'))
    expect(screen.getByText('Desplazamientos (Shocks)')).toBeTruthy()
    const libreSliders = screen.getAllByRole('slider')
    expect(libreSliders[0].value).toBe('0')

    const toggleLabels = [/Mostrar Curvas/, /Punto de Equilibrio/, /Excedentes y PIE/]
    for (const label of toggleLabels) {
      const toggle = screen.getByLabelText(label)
      await user.click(toggle)
      expect(toggle.checked).toBe(false)
    }
    await user.click(screen.getByText('Restablecer'))
    for (const label of toggleLabels) {
      expect(screen.getByLabelText(label).checked).toBe(true)
    }
  })

  it('warns and explains a perfectly inelastic demand with a demand shock', async () => {
    const user = userEvent.setup()
    render(<Mercado />)
    const checkboxes = screen.getAllByLabelText(/Vertical \(Inelástica\)/)
    await user.click(checkboxes[0])

    const sliders = screen.getAllByRole('slider')
    fireEvent.change(sliders[0], { target: { value: '5' } })

    expect(screen.getByText(/Combinación inelástica con shock/)).toBeTruthy()
    expect(screen.getByText(/Demanda perfectamente inelástica/)).toBeTruthy()
  })
})

describe('Monopolio integration', () => {
  it('resets controls to defaults', async () => {
    const user = userEvent.setup()
    render(<Monopolio />)
    await user.click(screen.getByText('Natural'))
    await user.click(screen.getByText(/Regulación P=CMe/))

    await user.click(screen.getByLabelText(/Restablecer simulador de monopolio/))
    expect(screen.getByText('Maximización M. Tradicional')).toBeTruthy()
    expect(screen.getByRole('slider').value).toBe('20')
  })

  it('renders selected root and faded alternative for natural monopoly regulation', async () => {
    const user = userEvent.setup()
    render(<Monopolio />)
    await user.click(screen.getByText('Natural'))
    await user.click(screen.getByText(/Regulación P=CMe/))

    expect(screen.getByText(/Q\*/)).toBeTruthy()
    expect(screen.getByLabelText('Alternativa no seleccionada')).toBeTruthy()
    expect(screen.getByText(/maximiza la cantidad y minimiza el precio/)).toBeTruthy()
  })

  it('presents a reachable no-solution state for natural monopoly regulation', async () => {
    const user = userEvent.setup()
    render(<Monopolio naturalParams={{ cme_fixed: 300 }} />)
    await user.click(screen.getByText('Natural'))
    await user.click(screen.getByText(/Regulación P=CMe/))

    expect(screen.getByText(/No existe intersección/)).toBeTruthy()
  })
})
