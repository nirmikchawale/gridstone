import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { App } from './App'

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

const authenticatedUser = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'admin@example.test',
  full_name: 'Gridstone Admin',
  role: 'admin',
}

function mockFetch(authenticated: boolean) {
  vi.stubGlobal(
    'fetch',
    vi.fn((input: RequestInfo | URL) => {
      const url = String(input)
      if (url.includes('/auth/me')) {
        return Promise.resolve(
          authenticated
            ? jsonResponse(authenticatedUser)
            : jsonResponse({ detail: 'Authentication required' }, 401),
        )
      }
      return Promise.resolve(
        jsonResponse({
          status: 'ok',
          database: 'ok',
          service: 'gridstone-api',
          version: '0.2.0',
        }),
      )
    }),
  )
}

describe('App', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    window.history.replaceState({}, '', '/')
  })

  it('shows the redesigned Gridstone sign-in experience for an anonymous session', async () => {
    mockFetch(false)
    render(<App />)

    expect(
      await screen.findByRole('heading', { name: /run the floor\. keep the business moving/i }),
    ).toBeVisible()
    expect(screen.getByRole('button', { name: /enter gridstone/i })).toBeVisible()
    expect(await screen.findByText(/API \+ PostgreSQL online/i)).toBeVisible()
  })

  it('shows the connected Gridstone workspace for an authenticated session', async () => {
    mockFetch(true)
    render(<App />)

    expect(
      await screen.findByRole('heading', { name: /the front desk, without the friction/i }),
    ).toBeVisible()
    expect(screen.getAllByText(/Gridstone Admin/i)).toHaveLength(2)
    expect(screen.getByRole('link', { name: /^members$/i })).toBeVisible()
    expect(screen.getByText(/Operational demo active/i)).toBeVisible()
    expect(screen.getByRole('link', { name: /open the member directory/i })).toBeVisible()
    expect(screen.queryByText(/not implemented yet/i)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign out/i })).toBeVisible()
  })

  it.each([
    ['/memberships', 'Memberships & renewals', /Lifecycle ledger/i],
    ['/attendance', 'Attendance', /Today’s check-ins/i],
    ['/reports', 'Reports', /Six-month demo trend/i],
  ])('renders completed module deep link %s as an interactive demo', async (path, heading, content) => {
    window.history.replaceState({}, '', path)
    mockFetch(true)
    render(<App />)

    expect(await screen.findByRole('heading', { name: heading, level: 1 })).toBeVisible()
    expect(screen.getByText(/Demo data live/i)).toBeVisible()
    expect(screen.getByText(content)).toBeVisible()
    expect(screen.queryByText(/not implemented yet/i)).not.toBeInTheDocument()
  })

  it('shows Payments as an explicit scope exclusion without unfinished-product copy', async () => {
    window.history.replaceState({}, '', '/payments')
    mockFetch(true)
    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Payments', level: 1 })).toBeVisible()
    expect(screen.getByText(/Excluded from project scope/i)).toBeVisible()
    expect(screen.getByText(/Payments are intentionally outside this project/i)).toBeVisible()
    expect(screen.queryByText(/not implemented yet/i)).not.toBeInTheDocument()
  })
})
