// ═══════════════════════════════════════════════════════
//  contentService tests — journey/module lookup contract.
//
//  The interesting surface here is getNextStep(): a learner
//  finishing a module needs to know what's next inside their
//  journey. The lookup has to tolerate the long-slug / short-id
//  mismatch between Ctx (e.g. "module-2-foundational-concepts")
//  and journeys.js (e.g. "module-2").
// ═══════════════════════════════════════════════════════

import { describe, it, expect, beforeEach } from 'vitest'
import {
  getJourneys,
  getAllModules,
  getParentJourneyId,
  getNextStep,
  getModule,
  getModuleEdits,
  clearModuleEdits,
  resetContentCache,
} from './contentService'

beforeEach(() => {
  resetContentCache()
})

describe('getJourneys / getAllModules', () => {
  it('returns the journey list', async () => {
    const journeys = await getJourneys()
    expect(Array.isArray(journeys)).toBe(true)
    expect(journeys.find((j) => j.id === 'new-hire')).toBeDefined()
  })

  it('dedupes concurrent calls (one promise, multiple awaiters)', async () => {
    const [a, b, c] = await Promise.all([getJourneys(), getJourneys(), getJourneys()])
    // Cache hands back the same promise, so the resolved value is the
    // same object reference on every caller.
    expect(a).toBe(b)
    expect(b).toBe(c)
  })

  it('returns module metadata', async () => {
    const modules = await getAllModules()
    expect(modules.find((m) => m.id === 'module-2')).toBeDefined()
  })
})

describe('getModule', () => {
  it('resolves the full module data for a known id', async () => {
    const m = await getModule('module-2')
    expect(m.cards).toBeDefined()
    expect(Array.isArray(m.cards)).toBe(true)
  })

  it('throws on unknown moduleId', async () => {
    await expect(getModule('module-999')).rejects.toThrow(/unknown module/i)
  })
})

describe('getParentJourneyId', () => {
  it('finds the journey by short-form module id', async () => {
    const id = await getParentJourneyId('module-2')
    expect(id).toBe('new-hire')
  })

  it('finds the journey by long-form module id (Ctx slug)', async () => {
    // This is the shape threaded through Ctx in Module2.jsx etc.
    const id = await getParentJourneyId('module-2-foundational-concepts')
    expect(id).toBe('new-hire')
  })

  it('returns null for a module not in any journey', async () => {
    const id = await getParentJourneyId('module-999')
    expect(id).toBeNull()
  })
})

describe('getNextStep', () => {
  it('returns the next module when one follows', async () => {
    const step = await getNextStep('module-2')
    expect(step).toMatchObject({
      kind: 'module',
      path: '/modules/module-3',
      journeyId: 'new-hire',
    })
    expect(step.label).toContain('Module 3')
  })

  it('tolerates the long-form slug (Module2 Ctx passes this form)', async () => {
    const step = await getNextStep('module-2-foundational-concepts')
    expect(step.kind).toBe('module')
    expect(step.path).toBe('/modules/module-3')
  })

  it('routes to the capstone when the learner finishes the last module', async () => {
    const step = await getNextStep('module-6')
    expect(step).toMatchObject({
      kind: 'assessment',
      path: '/journeys/new-hire/assessment',
      journeyId: 'new-hire',
    })
  })

  it('returns null when the module has no parent journey', async () => {
    const step = await getNextStep('module-999')
    expect(step).toBeNull()
  })
})

describe('getModuleEdits / clearModuleEdits', () => {
  it('returns {} when no edits exist', async () => {
    const edits = await getModuleEdits('module-2')
    expect(edits).toEqual({})
  })

  it('reads the localStorage edit blob', async () => {
    localStorage.setItem(
      'bm-lms-edits-module-2',
      JSON.stringify({ 'm2-card': { title: 'Overridden title' } })
    )
    const edits = await getModuleEdits('module-2')
    expect(edits['m2-card'].title).toBe('Overridden title')
  })

  it('clearModuleEdits drops the localStorage blob', async () => {
    localStorage.setItem('bm-lms-edits-module-2', JSON.stringify({ a: 1 }))
    const result = await clearModuleEdits('module-2')
    expect(result.success).toBe(true)
    expect(localStorage.getItem('bm-lms-edits-module-2')).toBeNull()
  })
})
