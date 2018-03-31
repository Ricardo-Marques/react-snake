// @flow

export type ErrorType =
  | 'TypeError'
  | 'RangeError'

export type Error = {|
  type: ErrorType,
  module: string,
  message: string
|}

export interface IDebugger {
  errorTypes: {
    [type: ErrorType]: ErrorType
  },
  throw ({| type: ErrorType, module: string, message: string, info: * |}): void,
  getErrorTypes (): $PropertyType<IDebugger, 'errorTypes'>
}

export default class Debugger implements IDebugger {
  errorTypes: {
    [type: ErrorType]: ErrorType
  }

  constructor () {
    this.errorTypes = this.getErrorTypes()
  }

  throw (opts: {| type: ErrorType, module: string, message: string, info: * |}) {
    const { type, module, message, info } = opts

    throw {
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
