import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Costos from './Costos'
import FPP from './FPP'
import Mercado from './Mercado'
import Monopolio from './Monopolio'
import SimulatorLayout from './SimulatorLayout'

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

  it('renders shutdown hatch and fixed-cost loss label when price is below minimum AVC', () => {
    render(<Costos />)
    const slider = screen.getByRole('slider')
    fireEvent.change(slider, { target: { value: '2' } })

    expect(screen.getByText('CIERRE DE EMPRESA')).toBeTruthy()
    expect(screen.getByText('-30')).toBeTruthy()
    expect(screen.getByText(/CF/)).toBeTruthy()
  })

  it('places the break-even label at the computed ATC minimum', () => {
    render(<Costos />)
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

  it('moves visual legend toggles into the results region and preserves toggle behavior', async () => {
    const user = userEvent.setup()
    render(<FPP />)

    const results = screen.getByRole('region', { name: 'Resultados' })
    const controls = screen.getByRole('region', { name: 'Controles' })

    expect(within(results).getByText('Leyenda Visual')).toBeTruthy()
    expect(within(controls).queryByText('Leyenda Visual')).toBeFalsy()

    const frontierToggle = within(results).getByLabelText(/Mostrar Frontera/)
    const guidesToggle = within(results).getByLabelText(/Mostrar Guías/)

    expect(frontierToggle.checked).toBe(true)
    expect(guidesToggle.checked).toBe(true)

    await user.click(frontierToggle)
    expect(frontierToggle.checked).toBe(false)

    await user.click(guidesToggle)
    expect(guidesToggle.checked).toBe(false)

    await user.click(screen.getByLabelText(/Restablecer simulador de FPP/))
    expect(frontierToggle.checked).toBe(true)
    expect(guidesToggle.checked).toBe(true)
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

  it('anchors inelastic demand curve at computed equilibrium quantity Qe within 1 px', async () => {
    const user = userEvent.setup()
    render(<Mercado />)
    const checkboxes = screen.getAllByLabelText(/Vertical \(Inelástica\)/)
    await user.click(checkboxes[0])

    const sliders = screen.getAllByRole('slider')
    fireEvent.change(sliders[0], { target: { value: '4' } })

    const line = screen.getByLabelText('Demanda inelástica')
    const x1 = Number(line.getAttribute('x1'))
    const x2 = Number(line.getAttribute('x2'))

    const gw = 650, pL = 60, pR = 30, maxX = 20
    const mapX = (x) => pL + (x / maxX) * (gw - pL - pR)
    const expectedQe = (16 - 2) / (1 + 1)
    const expectedX = mapX(expectedQe)

    expect(x1).toBeCloseTo(expectedX, 0)
    expect(x2).toBeCloseTo(expectedX, 0)
  })

  it('renders price-absorption cue for inelastic demand with a shock', async () => {
    const user = userEvent.setup()
    render(<Mercado />)
    const checkboxes = screen.getAllByLabelText(/Vertical \(Inelástica\)/)
    await user.click(checkboxes[0])

    const sliders = screen.getAllByRole('slider')
    fireEvent.change(sliders[0], { target: { value: '4' } })

    expect(screen.getByLabelText('Absorción de precio')).toBeTruthy()
    expect(screen.getByText(/Demanda perfectamente inelástica.*la cantidad permanece fija/i)).toBeTruthy()
  })
})

describe('Monopolio integration', () => {
  it('draws natural CTMe path from active naturalParams within 0.01', async () => {
    const user = userEvent.setup()
    const { container } = render(<Monopolio naturalParams={{ cme_base: 4, cme_fixed: 160 }} />)
    await user.click(screen.getByText('Natural'))

    const path = container.querySelector('[aria-label="Curva CTMe natural"]')
    expect(path).toBeTruthy()

    const gw = 650, gh = 450, pL = 60, pB = 50, pT = 30, pR = 30
    const mapX_nat = (x) => pL + (x / 50) * (gw - pL - pR)
    const mapY_nat = (y) => gh - pB - (y / 26) * (gh - pB - pT)

    const commands = path.getAttribute('d').trim().split(/\s+/)
    let idx = 0
    expect(commands[idx++]).toBe('M')
    const startX = Number(commands[idx++])
    const startY = Number(commands[idx++])
    expect(startX).toBeCloseTo(mapX_nat(2), 2)
    expect(startY).toBeCloseTo(mapY_nat(4 + 160 / 2), 2)

    for (let q = 3; q <= 50; q++) {
      expect(commands[idx++]).toBe('L')
      const x = Number(commands[idx++])
      const y = Number(commands[idx++])
      expect(x).toBeCloseTo(mapX_nat(q), 2)
      expect(y).toBeCloseTo(mapY_nat(4 + 160 / q), 2)
    }
  })

  it('updates natural CTMe path when naturalParams change', async () => {
    const user = userEvent.setup()
    const { container, rerender } = render(<Monopolio naturalParams={{ cme_base: 4, cme_fixed: 160 }} />)
    await user.click(screen.getByText('Natural'))

    const pathBefore = container.querySelector('[aria-label="Curva CTMe natural"]')
    expect(pathBefore).toBeTruthy()
    const dBefore = pathBefore.getAttribute('d')

    rerender(<Monopolio naturalParams={{ cme_base: 6, cme_fixed: 240 }} />)
    const pathAfter = container.querySelector('[aria-label="Curva CTMe natural"]')
    const dAfter = pathAfter.getAttribute('d')
    expect(dAfter).not.toBe(dBefore)

    const gh = 450, pB = 50, pT = 30
    const mapY_nat = (y) => gh - pB - (y / 26) * (gh - pB - pT)
    const commands = dAfter.trim().split(/\s+/)
    const startY = Number(commands[2])
    expect(startY).toBeCloseTo(mapY_nat(6 + 240 / 2), 2)
  })

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

describe('SimulatorLayout zones', () => {
  it('renders controls, chart, and results in DOM order for FPP', () => {
    render(<FPP />)

    const controls = screen.getByRole('region', { name: 'Controles' })
    const chart = screen.getByRole('region', { name: 'Gráfico' })
    const results = screen.getByRole('region', { name: 'Resultados' })

    expect(controls).toBeTruthy()
    expect(chart).toBeTruthy()
    expect(results).toBeTruthy()

    expect(controls.compareDocumentPosition(chart) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    expect(chart.compareDocumentPosition(results) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })

  it('renders controls, chart, and results in DOM order for Mercado', () => {
    render(<Mercado />)

    const controls = screen.getByRole('region', { name: 'Controles' })
    const chart = screen.getByRole('region', { name: 'Gráfico' })
    const results = screen.getByRole('region', { name: 'Resultados' })

    expect(controls.compareDocumentPosition(chart) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    expect(chart.compareDocumentPosition(results) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })

  it('uses the shared reset button in the controls header', async () => {
    const user = userEvent.setup()
    render(<FPP />)

    const sliders = screen.getAllByRole('slider')
    fireEvent.change(sliders[0], { target: { value: '120' } })
    expect(sliders[0].value).toBe('120')

    await user.click(screen.getByLabelText(/Restablecer simulador de FPP/))
    expect(screen.getAllByRole('slider')[0].value).toBe('100')
  })

  it('omits the empty results region for Monopolio', () => {
    render(<Monopolio />)
    expect(screen.getByRole('region', { name: 'Controles' })).toBeTruthy()
    expect(screen.getByRole('region', { name: 'Gráfico' })).toBeTruthy()
    expect(screen.queryByRole('region', { name: 'Resultados' })).toBeFalsy()
  })

  it('conditionally renders the results region based on the results prop', () => {
    const { rerender } = render(
      <SimulatorLayout
        title="Layout test"
        controls={<div>controls</div>}
        chart={<div>chart</div>}
        results={<div>results</div>}
      />
    )
    expect(screen.getByRole('region', { name: 'Resultados' })).toBeTruthy()

    rerender(
      <SimulatorLayout
        title="Layout test"
        controls={<div>controls</div>}
        chart={<div>chart</div>}
        results={null}
      />
    )
    expect(screen.queryByRole('region', { name: 'Resultados' })).toBeFalsy()
  })
})
