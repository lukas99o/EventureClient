import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Navbar from '../Navbar'
import * as authContext from '../../context/authContext'

vi.mock('../../context/authContext', () => ({
  useAuth: vi.fn(),
}))

describe('Navbar', () => {
  it('renders navbar component', () => {
    vi.mocked(authContext.useAuth).mockReturnValue({
      isLoggedIn: false,
      login: vi.fn(),
      logout: vi.fn(),
      username: undefined,
      userId: undefined,
    })

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    )

    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
  })

  it('shows login link when user is logged out', () => {
    vi.mocked(authContext.useAuth).mockReturnValue({
      isLoggedIn: false,
      login: vi.fn(),
      logout: vi.fn(),
      username: undefined,
      userId: undefined,
    })

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    )

    expect(screen.getByText('Log in')).toBeInTheDocument()
  })

  it('shows user menu when user is logged in', () => {
    vi.mocked(authContext.useAuth).mockReturnValue({
      isLoggedIn: true,
      login: vi.fn(),
      logout: vi.fn(),
      username: 'TestUser',
      userId: 'string123',
    })

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    )

    expect(screen.getByText('Log out')).toBeInTheDocument()
  })

  it('shows logo', () => {
    vi.mocked(authContext.useAuth).mockReturnValue({
      isLoggedIn: false,
      login: vi.fn(),
      logout: vi.fn(),
      username: undefined,
      userId: undefined,
    })

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    )

    const logo = screen.getByAltText('Eventure')
    expect(logo).toBeInTheDocument()
  })
})
