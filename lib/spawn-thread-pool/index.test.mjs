/* @flow */
import { example } from 'audition'
import assert from 'assert'
import spawnThreadPool from './'
import relativeToProjectRoot from '../../relative-to-project-root.js'

example('coordinating multiple threads', async () => {
  const threadModulePath = relativeToProjectRoot(
    'lib/spawn-thread-pool/fixtures/thread.mjs'
  )
  const pool = spawnThreadPool(threadModulePath)

  pool.send({ request: 1 })
  pool.send({ request: 2 })
  pool.send({ request: 3 })
  pool.send({ request: 4 })
  pool.send({ request: 5 })
  pool.send({ request: 6 })
  pool.send({ request: 7 })
  pool.send({ request: 8 })
  pool.send({ request: 9 })
  pool.end()

  const responses = new Map()
  for await (const { request, response } of pool) {
    responses.set(request, response)
  }

  assert.strictEqual(responses.get(1), 2)
  assert.strictEqual(responses.get(2), 4)
  assert.strictEqual(responses.get(3), 6)
  assert.strictEqual(responses.get(4), 8)
  assert.strictEqual(responses.get(5), 10)
  assert.strictEqual(responses.get(6), 12)
  assert.strictEqual(responses.get(7), 14)
  assert.strictEqual(responses.get(8), 16)
  assert.strictEqual(responses.get(9), 18)
})
