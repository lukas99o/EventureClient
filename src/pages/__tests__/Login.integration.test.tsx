import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Login from '../Login'

const mockLogin = vi.fn()
const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    MemoryRouter: actual.MemoryRouter,
    Link: actual.Link,
  }
})

vi.mock('../../context/authContext', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}))

describe('Login integration', () => {
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.resetAllMocks()
    vi.unstubAllGlobals()
  })

  it('logs in and navigates on success', async () => {
    const user = userEvent.setup()

    fetchMock
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ token: 'jwt-token', username: 'TestUser', userId: 'user-1' }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      )

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText('Email'), 'test@test.com')
    await user.type(screen.getByLabelText('Password'), 'Secret123!')
    await user.click(screen.getByRole('button', { name: 'Log in' }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('jwt-token', 'TestUser', 'user-1')
      expect(mockNavigate).toHaveBeenCalledWith('/events')
    })
  })

  it('shows an error message for invalid credentials', async () => {
    const user = userEvent.setup()

    fetchMock
    .mockResolvedValueOnce(new Response('Felaktig e-post eller lösenord.', { status: 401 }))

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText('Email'), 'fel@test.com')
    await user.type(screen.getByLabelText('Password'), 'wrongpass')
    await user.click(screen.getByRole('button', { name: 'Log in' }))

    expect(await screen.findByText('Incorrect email or password.')).toBeInTheDocument()
    expect(mockLogin).not.toHaveBeenCalled()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('shows confirmation requirement when API responds with that text', async () => {
    const user = userEvent.setup()

    fetchMock
    .mockResolvedValueOnce(new Response('You must confirm your email first.', { status: 400 }))

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText('Email'), 'test@test.com')
    await user.type(screen.getByLabelText('Password'), 'Secret123!')
    await user.click(screen.getByRole('button', { name: 'Log in' }))

    expect(
      await screen.findByText('You need to confirm your email first.')
    ).toBeInTheDocument()
    expect(mockLogin).not.toHaveBeenCalled()
  })
})
