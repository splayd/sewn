/* @flow */
/* $FlowFixMe */
import workerThreads, { parentPort } from 'worker_threads'
import { fromQueue } from 'heliograph'

async function run() {
  /* $FlowFixMe */
  const actor = (await import(workerThreads.workerData)).default

  const messages = fromQueue()
  parentPort.on('message', message => {
    if (message.type === 'message') {
      messages.push(message.message)
    } else if (message.type === 'end') {
      messages.end()
    }
  })

  await actor({
    ...messages,
    send: message => parentPort.postMessage(message)
  })

  process.exit()
}

run()
