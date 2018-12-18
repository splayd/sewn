# sewn
![npm](https://img.shields.io/npm/v/sewn.svg)
[![Build Status](https://travis-ci.org/vinsonchuong/sewn.svg?branch=master)](https://travis-ci.org/vinsonchuong/sewn)
[![dependencies Status](https://david-dm.org/vinsonchuong/sewn/status.svg)](https://david-dm.org/vinsonchuong/sewn)
[![devDependencies Status](https://david-dm.org/vinsonchuong/sewn/dev-status.svg)](https://david-dm.org/vinsonchuong/sewn?type=dev)

Sew threads of work together

## Usage
Install [sewn](https://yarnpkg.com/en/package/sewn)
by running:

```sh
yarn add sewn
```

### `spawnThread(modulePath)`
Spawn and communicate with a new thread

```js
/* parent.mjs */

import { spawnThread } from 'sewn'

async function run() {
  const thread = spawnThread('./thread.mjs')

  thread.send({ id: 1, action: 'add', args: [1, 2] })
  thread.send({ id: 2, action: 'subtract', args: [2, 1] })
  thread.send({ id: 3, action: 'multiply', args: [3, 3] })
  thread.send({ id: 4, action: 'divide', args: [4, 2] })
  thread.end()

  for await (const { id, result } of thread) {
    console.log(id, result)
  }
}

run()
```

```js
/* thread.mjs */

export default async function() {
  for await (const { id, action, args: [x, y] } of parent) {
    if (action === 'add') parent.send({ id, result: x + y })
    else if (action === 'subtract') parent.send({ id, result: x - y })
    else if (action === 'multiply') parent.send({ id, result: x * y })
    else if (action === 'divide') parent.send({ id, result: x / y })
  }
}
```

`spawnThread` takes the path to a module whose default export will be called
from the new thread. A message channel facilitates communication between the
main thread and the created thread; one side of the channel is returned by
`spawnThread`, and the other side is passed into the module.

Each side is an async iterator from which messages can be consumed, via
`for await` or the `.next()` method. Each side also has a `.send()` method for
producing messages.

The object returned by `spawnThread` also has a `.end()` method that when
called, closes the message queue, ends the async iterator, and allows the
thread to exit. Messages already in the message channel will be processed
before the channel closes.

### `spawnThreadPool(modulePath)`
Spawn and communicate with a pool of threads.

Messages produced by the parent are consumed round-robin by each thread in the
pool.

The interface is the same as
[`spawnThread(modulePath)`](#spawnthreadmodulepath).
