/* @flow */
/* $FlowFixMe */
import { Worker } from 'worker_threads'
import { fromEventEmitter } from 'heliograph'
import relativeToProjectRoot from '../../relative-to-project-root.js'

export default function /*:: <Incoming, Outgoing> */ ( // eslint-disable-line
  modulePath /*: string */
) /*: AsyncIterator<Outgoing> & {
  send: (Incoming) => void,
  end: () => void
} */ {
  const workerModulePath = relativeToProjectRoot('lib/spawn-thread/worker.mjs')
  const worker = new Worker(workerModulePath, { workerData: modulePath })
  const iterator = fromEventEmitter(worker, 'message', 'exit', 'error')

  return {
    ...iterator,
    send: message => worker.postMessage({ type: 'message', message }),
    end: () => worker.postMessage({ type: 'end' })
  }
}
