/* @flow */
import { example } from 'audition'
import assert from 'assert'
import greeting from './'

example('exporting "Hello World!"', () => {
  assert(greeting === 'Hello World!')
})
