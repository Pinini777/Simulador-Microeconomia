import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App shell', () => {
  it('renders Mercado by default', () => {
    render(<App />)
    expect(screen.getByText('1. El Mercado')).toBeTruthy()
  })

  it('unmounts the active module when switching tabs and resets it on return', async () => {
    const user = userEvent.setup()
    render(<App />)

    const mercadoSliders = screen.getAllByRole('slider')
    fireEvent.change(mercadoSliders[0], { target: { value: '5' } })
    expect(mercadoSliders[0].value).toBe('5')

    await user.click(screen.getByText('2. Frontera P.P.'))
    expect(screen.queryByText('1. El Mercado')).toBeFalsy()
    expect(screen.getByText('Capacidad Tecnológica')).toBeTruthy()

    await user.click(screen.getByText('1. Mercado e Incidencia'))
    expect(screen.getByText('1. El Mercado')).toBeTruthy()

    const resetSliders = screen.getAllByRole('slider')
    expect(resetSliders[0].value).toBe('0')
  })
})
