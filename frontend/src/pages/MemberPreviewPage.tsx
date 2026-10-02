import { useMemo, useState } from 'react'
import { Search, UserCheck, UserRound, UsersRound } from 'lucide-react'
import { Badge } from '../components/ui'
import { formatDate } from '../lib/demo-data'
import { registeredDemoMemberMetrics, registeredDemoMembers } from '../lib/registered-demo-members'

const PAGE_SIZE = 20

type StatusFilter = 'all' | 'active' | 'paused'

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function MemberPreviewPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return registeredDemoMembers.filter((member) => {
      const statusMatch =
        status === 'all' ||
        (status === 'active' && member.status === 'Active') ||
        (status === 'paused' && member.status === 'Paused')
      const queryMatch =
        normalized.length === 0 ||
        [member.name, member.code, member.email, member.phone, member.planCode]
          .join(' ')
          .toLowerCase()
          .includes(normalized)
      return statusMatch && queryMatch
    })
  }, [query, status])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  function updateQuery(value: string) {
    setQuery(value)
    setPage(1)
  }

  function updateStatus(value: StatusFilter) {
    setStatus(value)
    setPage(1)
  }

  return (
    <div className="page-stack">
      <header className="page-heading preview-members-heading">
        <div>
          <p className="page-eyebrow">Verified Members slice</p>
          <h1>Members</h1>
          <p>
            Explore the member-directory experience with 112 deterministic synthetic records. This
            Vercel surface is intentionally read-only; authenticated create, edit and status actions
            live in the secured FastAPI application.
          </p>
        </div>
        <Badge tone="accent">Read-only public preview</Badge>
      </header>

      <section className="preview-member-metrics" aria-label="Member demo summary">
        <article>
          <UsersRound size={19} aria-hidden="true" />
          <span>Total demo members</span>
          <strong>{registeredDemoMemberMetrics.total}</strong>
        </article>
        <article>
          <UserCheck size={19} aria-hidden="true" />
          <span>Active</span>
          <strong>{registeredDemoMemberMetrics.active}</strong>
        </article>
        <article>
          <UserRound size={19} aria-hidden="true" />
          <span>Paused</span>
          <strong>{registeredDemoMemberMetrics.paused}</strong>
        </article>
      </section>

      <aside className="demo-notice" aria-label="Synthetic demo data notice">
        <UserRound size={18} aria-hidden="true" />
        <div>
          <strong>Synthetic demonstration data</strong>
          <p>
            The original 12 records plus exactly 100 generated entries are fabricated for product
            evaluation. No customer dataset, payment credential or private gym record is published.
          </p>
        </div>
        <Badge tone="success">112 records</Badge>
      </aside>

      <section className="data-card preview-member-card" aria-labelledby="preview-member-directory">
        <div className="data-card__header">
          <div>
            <p className="card-eyebrow">Member directory</p>
            <h2 id="preview-member-directory">Find a member in seconds.</h2>
          </div>
          <Badge tone="neutral">{filtered.length} matches</Badge>
        </div>

        <div className="data-toolbar preview-member-toolbar">
          <label className="search-field">
            <Search size={17} aria-hidden="true" />
            <span className="sr-only">Search members</span>
            <input
              value={query}
              onChange={(event) => updateQuery(event.target.value)}
              placeholder="Search name, code, email, phone or plan"
              autoComplete="off"
            />
          </label>
          <label className="filter-field">
            <span>Status</span>
            <select
              value={status}
              onChange={(event) => updateStatus(event.target.value as StatusFilter)}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </select>
          </label>
        </div>

        <div className="data-table-wrap preview-member-table-wrap">
          <table className="data-table preview-member-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Contact</th>
                <th>Plan</th>
                <th>Membership ends</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((member) => (
                <tr key={member.code}>
                  <td data-label="Member">
                    <span className="member-cell">
                      <span className="member-cell__avatar" aria-hidden="true">
                        {initials(member.name)}
                      </span>
                      <span>
                        <strong>{member.name}</strong>
                        <small>{member.code}</small>
                      </span>
                    </span>
                  </td>
                  <td data-label="Contact">
                    <span className="stacked-cell">
                      <strong>{member.phone}</strong>
                      <small>{member.email}</small>
                    </span>
                  </td>
                  <td data-label="Plan">{member.planCode}</td>
                  <td data-label="Membership ends">{formatDate(member.membershipEnds)}</td>
                  <td data-label="Status">
                    <Badge tone={member.status === 'Active' ? 'success' : 'warning'}>
                      {member.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {visible.length === 0 ? (
          <div className="data-empty" role="status">
            No demo members match that search and status combination.
          </div>
        ) : (
          <nav className="preview-pagination" aria-label="Member result pages">
            <button
              type="button"
              className="button button--secondary"
              disabled={safePage <= 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              Previous
            </button>
            <span>
              Page {safePage} of {pageCount}
            </span>
            <button
              type="button"
              className="button button--secondary"
              disabled={safePage >= pageCount}
              onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
            >
              Next
            </button>
          </nav>
        )}
      </section>
    </div>
  )
}
