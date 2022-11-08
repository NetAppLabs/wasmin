import test from 'ava'

import { termGetRows } from '../index'

test('sync function from native code', (t) => {
  const prev = termGetRows()
  t.is(termGetRows(), prev)
})
