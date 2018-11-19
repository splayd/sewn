/* @flow */
/* $FlowFixMe */
import workerThreads, { parentPort } from 'worker_threads'
import { fromQueue } from 'heliograph'

async function run() {
  /* $FlowFixMe */
  const threadModule = await import(workerThreads.workerData)

  const messages = fromQueue()
  parentPort.on('message', message => {
    if (message.type === 'message') {
      messages.push(message.message)
    } else if (message.type === 'end') {
      messages.end()
    }
  })

  await threadModule.default({
    ...messages,
    send: message => parentPort.postMessage(message)
  })

  process.exit()
}

run().catch(error => {
  setImmediate(() => {
    throw error
  })
})
