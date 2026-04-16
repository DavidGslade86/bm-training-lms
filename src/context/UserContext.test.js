// ═══════════════════════════════════════════════════════
//  UserContext helper tests — data-integrity contracts for
//  the anonymous→signed-in migration and the two-record
//  merge rules.
//
//  These helpers run at sign-in time. If they're wrong,
//  learners lose their guest-review progress silently — a
//  class of bug that's hard to notice and painful to recover
//  from once the backend is writing.
// ═══════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest'
import {
  mergeCompletionRecords,
  migrateAnonymousCompletions,
} from './UserContext'

describe('mergeCompletionRecords', () => {
  it('returns the defined record when the other is null', () => {
    const rec = { recordedAt: '2026-01-01T00:00:00.000Z' }
    expect(mergeCompletionRecords(null, rec)).toBe(rec)
    expect(mergeCompletionRecords(rec, null)).toBe(rec)
  })

  it('prefers the submitted record over a recorded-only one (no downgrade)', () => {
    const submitted = {
      recordedAt: '2026-01-01T00:00:00.000Z',
      submittedAt: '2026-01-02T00:00:00.000Z',
      score: 5,
    }
    const recordedOnly = {
      recordedAt: '2026-02-01T00:00:00.000Z', // more recent, but not submitted
      score: 3,
    }
    const merged = mergeCompletionRecords(submitted, recordedOnly)
    expect(merged.submittedAt).toBe('2026-01-02T00:00:00.000Z')
    expect(merged.score).toBe(5) // the submitted record wins
  })

  it('picks the more recent recordedAt when neither is submitted', () => {
    const older = { recordedAt: '2026-01-01T00:00:00.000Z', score: 3 }
    const newer = { recordedAt: '2026-02-01T00:00:00.000Z', score: 5 }
    const merged = mergeCompletionRecords(older, newer)
    expect(merged.score).toBe(5)
  })
})

describe('migrateAnonymousCompletions', () => {
  const USER = 'learner@example.com'
  const ANON_KEY = 'bm-lms-completions-anonymous'
  const USER_KEY = `bm-lms-completions-${USER}`

  it('is a no-op when the anonymous bucket is empty', () => {
    migrateAnonymousCompletions(USER)
    expect(localStorage.getItem(ANON_KEY)).toBeNull()
    expect(localStorage.getItem(USER_KEY)).toBeNull()
  })

  it('moves anonymous completions into the learner bucket and deletes the source', () => {
    const record = { recordedAt: '2026-01-01T00:00:00.000Z', score: 5 }
    localStorage.setItem(ANON_KEY, JSON.stringify({ 'module-2': record }))

    migrateAnonymousCompletions(USER)

    const mine = JSON.parse(localStorage.getItem(USER_KEY))
    expect(mine['module-2']).toMatchObject({ score: 5 })
    expect(localStorage.getItem(ANON_KEY)).toBeNull()
  })

  it('merges per-module using mergeCompletionRecords semantics', () => {
    // Existing signed-in record is the submitted one.
    const mine = {
      'module-2': {
        recordedAt: '2026-01-01T00:00:00.000Z',
        submittedAt: '2026-01-02T00:00:00.000Z',
        score: 5,
      },
    }
    // Anonymous has a more recent recorded-only attempt.
    const anon = {
      'module-2': { recordedAt: '2026-03-01T00:00:00.000Z', score: 3 },
      'module-3': { recordedAt: '2026-03-02T00:00:00.000Z', score: 4 },
    }
    localStorage.setItem(USER_KEY, JSON.stringify(mine))
    localStorage.setItem(ANON_KEY, JSON.stringify(anon))

    migrateAnonymousCompletions(USER)

    const merged = JSON.parse(localStorage.getItem(USER_KEY))
    // Submitted record wins — anonymous attempt does NOT downgrade it.
    expect(merged['module-2'].submittedAt).toBe('2026-01-02T00:00:00.000Z')
    expect(merged['module-2'].score).toBe(5)
    // Anonymous-only modules make it across clean.
    expect(merged['module-3'].score).toBe(4)
  })

  it('is safe to call without a user email', () => {
    expect(() => migrateAnonymousCompletions(undefined)).not.toThrow()
    expect(() => migrateAnonymousCompletions('')).not.toThrow()
  })
})
