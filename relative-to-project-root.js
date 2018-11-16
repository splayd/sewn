/* @flow */
const path = require('path')

module.exports = function(...args /*: Array<string> */) /*: string */ {
  return path.resolve(__dirname, ...args)
}
