// @flow

export type ErrorType =
  | 'TypeError'
  | 'RangeError'

export type Error = {|
  type: ErrorType,
  module: string,
  message: string,
  info: *
|}

export interface IDebugger {
  errorTypes: {
    [type: ErrorType]: ErrorType
  },
  getError (Error): Error,
  getErrorTypes (): $PropertyType<IDebugger, 'errorTypes'>
}

export default class Debugger implements IDebugger {
  errorTypes: {
    [type: ErrorType]: ErrorType
  }

  constructor () {
    this.errorTypes = this.getErrorTypes()
  }

  getError (opts: Error) {
    const { type, module, message, info } = opts

    return {
      type: this.errorTypes[type],
      module,
      message,
      info
    }
  }

  getErrorTypes ()  {
    return {
      TypeError: 'TypeError',
      RangeError: 'RangeError'
    }
  }
}
