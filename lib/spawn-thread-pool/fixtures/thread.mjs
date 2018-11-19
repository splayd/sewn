/* @flow */
export default async function(
  parent /*: AsyncIterator<{ request: number }> & {
    send: ({ request: number, response: number }) => void
  } */
) {
  for await (const { request } of parent) {
    parent.send({ request, response: 2 * request })
  }
}
