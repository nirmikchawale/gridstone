import { useMemo, useState } from 'react'
import { BadgeIndianRupee, CalendarDays, Search, ShieldCheck } from 'lucide-react'
import { Badge } from '../components/ui'
import { demoPlans, formatINR } from '../lib/demo-data'

type AvailabilityFilter = 'all' | 'active' | 'archived'

export function PlanPreviewPage() {
  const [query, setQuery] = useState('')
  const [availability, setAvailability] = useState<AvailabilityFilter>('all')
  const [selectedCode, setSelectedCode] = useState(demoPlans[0]?.code ?? '')

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return demoPlans.filter((plan) => {
      const availabilityMatch =
        availability === 'all' ||
        (availability === 'active' && plan.availability === 'Active') ||
        (availability === 'archived' && plan.availability === 'Archived')
      const queryMatch =
        normalized.length === 0 ||
        [plan.code, plan.name, plan.description, plan.duration]
          .join(' ')
          .toLowerCase()
          .includes(normalized)
      return availabilityMatch && queryMatch
    })
  }, [availability, query])

  const selected =
    demoPlans.find((plan) => plan.code === selectedCode) ?? filtered[0] ?? demoPlans[0] ?? null
  const activePlans = demoPlans.filter((plan) => plan.availability === 'Active').length
  const activeMembers = demoPlans.reduce((sum, plan) => sum + plan.activeMembers, 0)

  return (
    <div className="page-stack">
      <header className="page-heading preview-plans-heading">
        <div>
          <p className="page-eyebrow">Verified Membership Plans slice</p>
          <h1>Membership Plans</h1>
          <p>
            Explore Gridstone’s plan catalog with safe synthetic pricing and availability data. This
            Vercel surface is read-only; administrator create, edit and availability controls live in
            the secured FastAPI application.
          </p>
        </div>
        <Badge tone="accent">Read-only public preview</Badge>
      </header>

      <section className="preview-plan-metrics" aria-label="Membership plan demo summary">
        <article>
          <CalendarDays size={19} aria-hidden="true" />
          <span>Plan records</span>
          <strong>{demoPlans.length}</strong>
        </article>
        <article>
          <ShieldCheck size={19} aria-hidden="true" />
          <span>Active plans</span>
          <strong>{activePlans}</strong>
        </article>
        <article>
          <BadgeIndianRupee size={19} aria-hidden="true" />
          <span>Demo members assigned</span>
          <strong>{activeMembers}</strong>
        </article>
      </section>

      <aside className="demo-notice" aria-label="Plan history guarantee">
        <ShieldCheck size={18} aria-hidden="true" />
        <div>
          <strong>Historical pricing stays historical</strong>
          <p>
            In the authenticated product, editing catalog pricing affects future work only. Existing
            memberships retain the price and currency snapshot captured when they were created.
          </p>
        </div>
        <Badge tone="success">Snapshot-safe</Badge>
      </aside>

      <section className="preview-plan-workspace" aria-label="Membership plan preview workspace">
        <article className="data-card preview-plan-directory">
          <div className="data-card__header">
            <div>
              <p className="card-eyebrow">Plan catalog</p>
              <h2>Compare packages and pricing.</h2>
            </div>
            <Badge tone="neutral">{filtered.length} results</Badge>
          </div>

          <div className="data-toolbar preview-plan-toolbar">
            <label className="search-field">
              <Search size={17} aria-hidden="true" />
              <span className="sr-only">Search membership plans</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search code, name or description"
                autoComplete="off"
              />
            </label>
            <label className="filter-field">
              <span>Availability</span>
              <select
                value={availability}
                onChange={(event) => setAvailability(event.target.value as AvailabilityFilter)}
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </label>
          </div>

          <div className="data-table-wrap preview-plan-table-wrap">
            <table className="data-table preview-plan-table">
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Demo members</th>
                  <th>Status</th>
                  <th><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((plan) => (
                  <tr key={plan.code} className={selected?.code === plan.code ? 'preview-plan-row--selected' : undefined}>
                    <td data-label="Plan">
                      <span className="stacked-cell">
                        <strong>{plan.name}</strong>
                        <small>{plan.code}</small>
                      </span>
                    </td>
                    <td data-label="Duration">{plan.duration}</td>
                    <td data-label="Price"><strong>{formatINR(plan.price)}</strong></td>
                    <td data-label="Demo members">{plan.activeMembers}</td>
                    <td data-label="Status">
                      <Badge tone={plan.availability === 'Active' ? 'success' : 'neutral'}>
                        {plan.availability}
                      </Badge>
                    </td>
                    <td className="preview-plan-table__action">
                      <button
                        className="button button--ghost"
                        type="button"
                        onClick={() => setSelectedCode(plan.code)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="data-empty" role="status">
              No demo plans match that search and availability combination.
            </div>
          )}
        </article>

        <aside className="data-card preview-plan-detail" aria-live="polite">
          {selected ? (
            <>
              <div className="preview-plan-detail__heading">
                <div>
                  <p className="card-eyebrow">{selected.code}</p>
                  <h2>{selected.name}</h2>
                </div>
                <Badge tone={selected.availability === 'Active' ? 'success' : 'neutral'}>
                  {selected.availability}
                </Badge>
              </div>
              <p className="preview-plan-detail__description">{selected.description}</p>
              <dl className="preview-plan-detail__facts">
                <div><dt>Duration</dt><dd>{selected.duration}</dd></div>
                <div><dt>Price</dt><dd>{formatINR(selected.price)}</dd></div>
                <div><dt>Currency</dt><dd>INR</dd></div>
                <div><dt>Demo members</dt><dd>{selected.activeMembers}</dd></div>
              </dl>
              <p className="preview-plan-detail__note">
                Administrator mutations are intentionally unavailable in this public preview.
              </p>
            </>
          ) : (
            <div className="data-empty" role="status">No plan selected.</div>
          )}
        </aside>
      </section>
    </div>
  )
}
