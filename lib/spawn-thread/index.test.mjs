/* @flow */
import { example } from 'audition'
import assert from 'assert'
import spawnThread from './'
import relativeToProjectRoot from '../../relative-to-project-root.js'

example('spawning and communicating with a thread', async () => {
  const threadModulePath = relativeToProjectRoot(
    'lib/spawn-thread/fixtures/thread.mjs'
  )
  const thread = spawnThread(threadModulePath)

  thread.send({ request: 2 })
  assert.deepStrictEqual(await thread.next(), {
    done: false,
    value: { request: 2, response: 4 }
  })

  thread.send({ request: 3 })
  assert.deepStrictEqual(await thread.next(), {
    done: false,
    value: { request: 3, response: 9 }
  })

  thread.end()
  assert.deepStrictEqual(await thread.next(), { done: true })
})

example('catching errors thrown by a thread', async () => {
  const threadModulePath = relativeToProjectRoot(
    'lib/spawn-thread/fixtures/error.mjs'
  )
  const thread = spawnThread(threadModulePath)

  try {
    await thread.next()
    throw new Error('Did not get expected error')
  } catch (error) {
    assert.strictEqual(error.message, 'Something went wrong.')
  }
})
