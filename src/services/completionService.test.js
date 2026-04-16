// ═══════════════════════════════════════════════════════
//  completionService tests — executable contract for the
//  two-phase completion lifecycle.
//
//  These tests describe the behavior the future backend
//  MUST preserve. When VITE_API_URL flips on, POST
//  /api/completions (with and without { submit: true })
//  has to produce records with the same shape and the
//  same idempotency guarantees that these tests pin down.
// ═══════════════════════════════════════════════════════

import { describe, it, expect, beforeEach } from 'vitest'
import {
  getCompletionStatus,
  markModuleComplete,
  recordModuleCompletion,
} from './completionService'

const USER = 'learner@example.com'
const KEY = `bm-lms-completions-${USER}`

function readRaw() {
  return JSON.parse(localStorage.getItem(KEY) || '{}')
}

describe('markModuleComplete', () => {
  it('writes a record shaped { ...data, recordedAt } on first call', async () => {
    await markModuleComplete(USER, 'module-2', { score: 5, total: 5 })
    const map = readRaw()
    expect(map['module-2']).toBeDefined()
    expect(map['module-2'].score).toBe(5)
    expect(map['module-2'].total).toBe(5)
    expect(map['module-2'].recordedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    // No submittedAt yet — that's Phase 2.
    expect(map['module-2'].submittedAt).toBeUndefined()
  })

  it('preserves recordedAt across repeated calls (idempotent)', async () => {
    await markModuleComplete(USER, 'module-2', { score: 3 })
    const first = readRaw()['module-2'].recordedAt

    // Give the clock a nudge so a naive "always overwrite" bug would show.
    await new Promise((r) => setTimeout(r, 5))

    await markModuleComplete(USER, 'module-2', { score: 5 })
    const second = readRaw()['module-2'].recordedAt

    expect(second).toBe(first)
  })

  it('refreshes the metrics payload on re-call (latest attempt wins)', async () => {
    await markModuleComplete(USER, 'module-2', { score: 3, tries: 2 })
    await markModuleComplete(USER, 'module-2', { score: 5, tries: 1 })
    const rec = readRaw()['module-2']
    expect(rec.score).toBe(5)
    expect(rec.tries).toBe(1)
  })

  it('never downgrades a submitted record back to recorded-only', async () => {
    await recordModuleCompletion(USER, 'module-2', { score: 5 })
    const beforeSubmittedAt = readRaw()['module-2'].submittedAt
    expect(beforeSubmittedAt).toBeDefined()

    // Learner revisits CompletionCard — markComplete re-fires.
    await markModuleComplete(USER, 'module-2', { score: 5 })

    const rec = readRaw()['module-2']
    expect(rec.submittedAt).toBe(beforeSubmittedAt)
    expect(rec.recordedAt).toBeDefined()
  })
})

describe('recordModuleCompletion', () => {
  it('stamps both recordedAt and submittedAt when no webhook is configured', async () => {
    const result = await recordModuleCompletion(USER, 'module-2', { score: 5 })
    expect(result.success).toBe(true)

    const rec = readRaw()['module-2']
    expect(rec.recordedAt).toBeDefined()
    expect(rec.submittedAt).toBeDefined()
  })

  it('keeps the original recordedAt even when called after markModuleComplete', async () => {
    await markModuleComplete(USER, 'module-2', { score: 5 })
    const recordedAt = readRaw()['module-2'].recordedAt

    await new Promise((r) => setTimeout(r, 5))
    await recordModuleCompletion(USER, 'module-2', { score: 5 })

    const rec = readRaw()['module-2']
    expect(rec.recordedAt).toBe(recordedAt)
    expect(rec.submittedAt).toBeDefined()
    // Webhook-phase stamp should be strictly later than the recorded-phase one.
    expect(Date.parse(rec.submittedAt)).toBeGreaterThanOrEqual(Date.parse(rec.recordedAt))
  })
})

describe('getCompletionStatus', () => {
  it('returns {} for a user with no history', async () => {
    const map = await getCompletionStatus(USER)
    expect(map).toEqual({})
  })

  it('returns the full completion map for a user', async () => {
    await markModuleComplete(USER, 'module-2', { score: 5 })
    await markModuleComplete(USER, 'module-3', { score: 4 })
    const map = await getCompletionStatus(USER)
    expect(Object.keys(map).sort()).toEqual(['module-2', 'module-3'])
  })

  it('isolates completions by userId', async () => {
    await markModuleComplete('alice@example.com', 'module-2', { score: 5 })
    await markModuleComplete('bob@example.com', 'module-2', { score: 3 })

    const alice = await getCompletionStatus('alice@example.com')
    const bob = await getCompletionStatus('bob@example.com')
    expect(alice['module-2'].score).toBe(5)
    expect(bob['module-2'].score).toBe(3)
  })
})
