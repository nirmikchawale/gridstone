import { describe, expect, it } from 'vitest'
import {
  additionalRegisteredDemoMembers,
  registeredDemoMemberMetrics,
  registeredDemoMembers,
} from './registered-demo-members'

describe('registered demo members', () => {
  it('adds exactly 100 deterministic synthetic records to the original 12', () => {
    expect(additionalRegisteredDemoMembers).toHaveLength(100)
    expect(registeredDemoMembers).toHaveLength(112)
    expect(registeredDemoMemberMetrics.total).toBe(112)
    expect(new Set(registeredDemoMembers.map((member) => member.code)).size).toBe(112)
    expect(registeredDemoMembers.every((member) => member.email.endsWith('@example.com'))).toBe(
      true,
    )
  })
})
