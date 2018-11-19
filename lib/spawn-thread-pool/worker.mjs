/* @flow */
import { makeAsyncIterator, pipe, filter, map } from 'heliograph'

/*::
type IncomingAction =
  | { type: 'start', threadModulePath: string }
  | { type: 'message', message: mixed }
*/

/*::
type OutgoingAction =
  | { type: 'ready' }
  | { type: 'message', message: mixed }
*/

export default async function(
  parent /*: AsyncIterator<IncomingAction> & {
    send: (OutgoingAction) => void
  } */
) {
  const { value: firstAction } = await parent.next()
  if (!firstAction || firstAction.type !== 'start') {
    throw new Error('Expected first action to be of type "start"')
  }
  const { threadModulePath } = firstAction

  const messages = pipe(
    parent,
    filter(action => action.type === 'message'),
    map(messageAction => messageAction.message)
  )

  /* $FlowFixMe */
  const threadModule = await import(threadModulePath)
  await threadModule.default(
    makeAsyncIterator({
      next: () => {
        parent.send({ type: 'ready' })
        return messages.next()
      },
      send: message => {
        parent.send({ type: 'message', message })
      }
    })
  )
}
