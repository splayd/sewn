/* @flow */

export default async function(
  parent /*: AsyncIterator<{ request: number }>  & {
    send: ({ response: number }) => void
  } */
) {
  for await (const { request } of parent) {
    parent.send({ request, response: request ** 2 })
  }
}
