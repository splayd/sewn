/* @flow */
import test from 'ava'
import greeting from 'sewn'

test('exporting "Hello World!"', t => {
  t.is(greeting, 'Hello World!')
})
