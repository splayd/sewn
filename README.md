# sewn
![npm](https://img.shields.io/npm/v/sewn.svg)
[![Build Status](https://travis-ci.org/splayd/sewn.svg?branch=master)](https://travis-ci.org/splayd/sewn)
[![dependencies Status](https://david-dm.org/splayd/sewn/status.svg)](https://david-dm.org/splayd/sewn)
[![devDependencies Status](https://david-dm.org/splayd/sewn/dev-status.svg)](https://david-dm.org/splayd/sewn?type=dev)

Sew threads of work together

## Usage
Install [sewn](https://yarnpkg.com/en/package/sewn)
by running:

```sh
yarn add sewn
```

### `spawnThread(modulePath)`
```js
/* parent.mjs */

import { spawnThread } from 'sewn'

async function run() {
  const thread = spawnThread('./thread.mjs')

  thread.send({ id: 1, action: 'add', args: [1, 2] })
  thread.send({ id: 2, action: 'subtract', args: [2, 1] })
  thread.send({ id: 3, action: 'multiply', args: [3, 3] })
  thread.send({ id: 4, action: 'divide', args: [4, 2] })

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
