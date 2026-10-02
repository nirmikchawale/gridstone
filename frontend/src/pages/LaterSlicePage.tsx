import { ArrowRight, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ModuleDefinition } from '../lib/navigation'
import { Badge } from '../components/ui'

export function LaterSlicePage({ module }: { module: ModuleDefinition }) {
  const Icon = module.icon

  return (
    <div className="page-stack">
      <header className="module-hero">
        <div className="module-hero__icon" aria-hidden="true">
          <Icon size={28} strokeWidth={1.7} />
        </div>
        <div className="module-hero__copy">
          <p className="page-eyebrow">Project scope boundary</p>
          <h1>{module.title}</h1>
          <p>{module.description}</p>
        </div>
        <Badge tone="neutral">Excluded from project scope</Badge>
      </header>

      <section className="data-card later-slice-card" aria-labelledby="scope-boundary-heading">
        <div className="later-slice-card__icon" aria-hidden="true">
          <ShieldCheck size={22} />
        </div>
        <div>
          <p className="card-eyebrow">Scope decision</p>
          <h2 id="scope-boundary-heading">Payments are intentionally outside this project.</h2>
          <p>
            Gridstone currently focuses on member records, membership plans, memberships and
            renewals, attendance, dashboard operations and reporting. Payment collection, receipts,
            revenue accounting and payment-provider integrations are deliberately excluded.
          </p>
          <Link className="later-slice-link" to="/memberships">
            Open memberships & renewals <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  )
}
