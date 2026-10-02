import {
  ArrowUpRight,
  Database,
  KeyRound,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UsersRound,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import type { AuthUser } from '../lib/api'
import type { HealthState } from '../lib/app-state'
import { registeredDemoMemberMetrics, registeredDemoMembers } from '../lib/registered-demo-members'
import { moduleDefinitions } from '../lib/navigation'
import { Badge } from '../components/ui'

function databaseCopy(health: HealthState, publicPreview: boolean) {
  if (publicPreview) return 'Synthetic preview dataset active'
  if (health.kind === 'loaded') return 'PostgreSQL connected'
  if (health.kind === 'error') return 'Backend connection unavailable'
  return 'Verifying connection'
}

export function HomePage({ user, health }: { user: AuthUser; health: HealthState }) {
  const recentDemoMembers = registeredDemoMembers.slice(-4).reverse()
  const publicPreview = user.email === 'preview@gridstone.app'

  return (
    <div className="page-stack">
      <header className="page-heading">
        <div>
          <p className="page-eyebrow">Gridstone workspace</p>
          <h1>The front desk, without the friction.</h1>
          <p>
            Welcome, <strong>{user.full_name}</strong>. Explore the connected member, plan,
            membership, attendance and reporting workflows using safe synthetic demo data.
          </p>
        </div>
        <Badge tone="accent">
          <Sparkles size={13} aria-hidden="true" />
          Operational demo active
        </Badge>
      </header>

      <section className="hero-grid" aria-label="Gridstone operations overview">
        <article className="hero-panel">
          <div className="hero-panel__glow" aria-hidden="true" />
          <div className="hero-copy">
            <p className="hero-kicker">Connected workflows</p>
            <h2>Core gym operations are available across the demo.</h2>
            <p>
              Browse members and plans, review membership lifecycle records, inspect attendance,
              and open reports from one consistent workspace. The public preview uses deterministic
              synthetic records so the experience is useful without exposing real member data.
            </p>
            <Link className="text-link" to="/members">
              Open the member directory <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className="hero-metrics" aria-label="Gridstone member metrics">
            <div className="hero-metric">
              <strong>{registeredDemoMemberMetrics.total}</strong>
              <span>synthetic preview members</span>
            </div>
            <div className="hero-metric">
              <strong>{registeredDemoMemberMetrics.active}</strong>
              <span>active demo records</span>
            </div>
            <div className="hero-metric">
              <strong>{registeredDemoMemberMetrics.paused}</strong>
              <span>paused demo records</span>
            </div>
          </div>
        </article>

        <article className="signal-panel">
          <div className="signal-panel__header">
            <div>
              <p className="card-eyebrow">Workspace signal</p>
              <h2>System status</h2>
            </div>
            <span className={`signal-light signal-light--${health.kind}`} aria-hidden="true" />
          </div>
          <div className="signal-list">
            <div className="signal-row">
              <span className="signal-row__icon">
                <Database size={17} aria-hidden="true" />
              </span>
              <span>
                <strong>Data backbone</strong>
                <small>{databaseCopy(health, publicPreview)}</small>
              </span>
            </div>
            <div className="signal-row">
              <span className="signal-row__icon">
                <KeyRound size={17} aria-hidden="true" />
              </span>
              <span>
                <strong>Staff identity</strong>
                <small>Opaque sessions + CSRF protection</small>
              </span>
            </div>
            <div className="signal-row">
              <span className="signal-row__icon">
                <ShieldCheck size={17} aria-hidden="true" />
              </span>
              <span>
                <strong>Operational workflows</strong>
                <small>Members, plans, memberships, attendance and reports</small>
              </span>
            </div>
          </div>
        </article>
      </section>

      <section className="report-grid" aria-label="Gridstone preview summary">
        <article className="data-card">
          <div className="data-card__header">
            <div>
              <p className="card-eyebrow">Registered preview</p>
              <h2>Latest synthetic members</h2>
            </div>
            <Badge tone="success">{registeredDemoMemberMetrics.total} records</Badge>
          </div>
          <div className="compact-list">
            {recentDemoMembers.map((member) => (
              <div className="compact-list__row" key={member.code}>
                <span>
                  <strong>{member.name}</strong>
                  <small>{member.code}</small>
                </span>
                <span>
                  <strong>{member.planCode}</strong>
                  <small>{member.status}</small>
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="data-card">
          <div className="data-card__header">
            <div>
              <p className="card-eyebrow">Operational modules</p>
              <h2>Available across the public demo</h2>
            </div>
            <Badge tone="accent">Interactive</Badge>
          </div>
          <div className="compact-list">
            {moduleDefinitions
              .filter(
                (module) => module.path !== '/members' && module.path !== '/payments',
              )
              .slice(0, 4)
              .map((module) => (
                <div className="compact-list__row" key={module.path}>
                  <span>
                    <strong>{module.label}</strong>
                    <small>{module.eyebrow}</small>
                  </span>
                  <span>
                    <strong>Available</strong>
                    <small>open from navigation</small>
                  </span>
                </div>
              ))}
          </div>
        </article>
      </section>

      <section className="principle-grid" aria-label="Gridstone demo principles">
        <article className="principle-card">
          <span>
            <UsersRound size={19} aria-hidden="true" />
          </span>
          <div>
            <strong>112-record public dataset</strong>
            <p>All preview member identities and contacts are synthetic and deterministic.</p>
          </div>
        </article>
        <article className="principle-card">
          <span>
            <Smartphone size={19} aria-hidden="true" />
          </span>
          <div>
            <strong>Desktop and mobile</strong>
            <p>
              The directory changes from a table to touch-friendly member cards at narrow widths.
            </p>
          </div>
        </article>
        <article className="principle-card">
          <span>
            <Sparkles size={19} aria-hidden="true" />
          </span>
          <div>
            <strong>Light and dark themes</strong>
            <p>The user can switch modes at any time; the preference persists on the device.</p>
          </div>
        </article>
      </section>
    </div>
  )
}
