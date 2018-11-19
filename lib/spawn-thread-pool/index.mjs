/* @flow */
import * as os from 'os'
import relativeToProjectRoot from '../../relative-to-project-root.js'
import { spawnThread } from '../../'
import {
  fromQueue,
  merge,
  zip,
  pipe,
  map,
  filter,
  observe,
  consume
} from 'heliograph'

export default function(
  threadModulePath /*: string */
) /*: AsyncIterator<any> & {
  send: any => void,
  end: () => void
} */ {
  const workerModulePath = relativeToProjectRoot(
    'lib/spawn-thread-pool/worker.mjs'
  )
  const threads = os.cpus().map(() => spawnThread(workerModulePath))

  threads.forEach(thread => thread.send({ type: 'start', threadModulePath }))

  const idleThreads = fromQueue()
  threads.forEach(thread => idleThreads.push(thread))

  const outgoingMessageIterators = threads.map(thread =>
    pipe(
      thread,
      observe(action => {
        if (action.type === 'ready') {
          idleThreads.push(thread)
        }
      }),
      filter(action => action.type === 'message'),
      map(action => action.message)
    )
  )

  const incomingActions = fromQueue()
  pipe(
    zip(incomingActions, idleThreads),
    consume(([incomingAction, thread]) => thread.send(incomingAction))
  ).then(() => threads.forEach(thread => thread.end()))

  return {
    ...merge(...outgoingMessageIterators),
    send: message => incomingActions.push({ type: 'message', message }),
    end: () => incomingActions.end()
  }
}
