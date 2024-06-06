import { expect, it } from "vitest"

import noSegmentlessSlices from "./index.js"
import { parseIntoFsdRoot } from "../_lib/prepare-test.js"

it('reports no errors on a project where every slice has at least one segment', () => {
  const root = parseIntoFsdRoot(`
    📂 shared
      📂 ui
        📄 index.ts
      📂 i18n
        📄 index.ts
    📂 entities
      📂 user
        📂 ui
        📂 model
        📄 index.ts
    📂 pages
      📂 home
        📂 ui
        📄 index.ts
  `)

  expect(noSegmentlessSlices.check(root)).toEqual({ diagnostics: [] })
})

it('reports errors on a project where some slices have no segments', () => {
  const root = parseIntoFsdRoot(`
    📂 shared
      📂 ui
        📄 index.ts
      📂 i18n
        📄 index.ts
    📂 entities
      📂 user
    📂 pages
      📂 home
        📂 ui
        📄 index.ts
      📂 settings
        📂 profile
          📄 index.ts
  `)

  const diagnostics = noSegmentlessSlices.check(root).diagnostics
  expect(diagnostics).toEqual([
    { message: 'Slice "user" on layer "entities" has no segments' },
    { message: 'Slice "settings/profile" on layer "pages" has no segments' },
  ])
})
