import { ArrowRight, CheckCircle2 } from 'lucide-react'
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
          <p className="page-eyebrow">Later approved product slice</p>
          <h1>{module.title}</h1>
          <p>{module.description}</p>
        </div>
        <Badge tone="neutral">Not implemented yet</Badge>
      </header>

      <section className="data-card later-slice-card" aria-labelledby="later-slice-heading">
        <div className="later-slice-card__icon" aria-hidden="true">
          <CheckCircle2 size={22} />
        </div>
        <div>
          <p className="card-eyebrow">Phase boundary preserved</p>
          <h2 id="later-slice-heading">Members is the current completed business slice.</h2>
          <p>
            Gridstone is being built vertically so each workflow is implemented, tested and verified
            before the next one begins. This page is intentionally not populated with simulated CRUD
            or operational totals.
          </p>
          <Link className="later-slice-link" to="/members">
            Explore Members <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  )
}
