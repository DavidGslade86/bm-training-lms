// Global test setup. Runs once before each test file.
//
// jsdom provides a localStorage implementation per test file, but it
// doesn't clear between tests within a file. Wipe it before every test
// so persistence assertions don't leak into each other.

import { beforeEach } from 'vitest'

beforeEach(() => {
  localStorage.clear()
})
