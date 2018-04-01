// @flow
import type { IDebugger, ErrorType } from '../Debugger'

export type Particle = {|
  row: number,
  column: number,
  color: string
|}

type ParticleColor = string // simply holds the color of the particle

type SceneConstructorOpts = {|
  rows: number,
  columns: number,
  backgroundColor: string,
  onParticleColorChange: (Particle) => void,
  Debugger: IDebugger
|}

type SceneState = {
  [row: number]: {
    [column: number]: $PropertyType<Particle, 'color'>
  }
}

export interface IScene {
  getInitialSceneState ({| rows: number, columns: number, backgroundColor: string |}): SceneState;
  addParticle (Particle): Particle,
  resetParticle ({| row: number, column: number |}): void
}

export default class Scene implements IScene {
  state: SceneState
  rows: $PropertyType<SceneConstructorOpts, 'rows'>
  columns: $PropertyType<SceneConstructorOpts, 'columns'>
  backgroundColor: $PropertyType<SceneConstructorOpts, 'backgroundColor'>
  onParticleColorChange: $PropertyType<SceneConstructorOpts, 'onParticleColorChange'>
  Debugger: $PropertyType<SceneConstructorOpts, 'Debugger'>

  constructor ({ rows, columns, backgroundColor, onParticleColorChange, Debugger }: SceneConstructorOpts) {
    this.rows = rows
    this.columns = columns
    this.backgroundColor = backgroundColor
    this.onParticleColorChange = onParticleColorChange
    this.Debugger = Debugger

    this.state = this.getInitialSceneState({ rows, columns, backgroundColor })
  }

  getInitialSceneState (opts: { rows: number, columns: number, backgroundColor: string }) {
    const { rows, columns, backgroundColor } = opts

    let state = {}
    for (let row = 1; row <= rows; row++) {
      state[row] = {}
      for (let column = 1; column <= columns; column++) {
        state[row][column] = backgroundColor
      }
    }

    return state
  }

  addParticle (particle: Particle) {
    const { row, column, color } = particle
    if (row > this.rows || column > this.columns || row < 1 || column < 1) {
      throw this._getSceneError({
        type: this.Debugger.errorTypes.RangeError,
        message: `(addParticle) row: ${row} column: ${column} is out of bounds`
      })
    }

    const currentColor = this.state[row][column]
    if (currentColor !== color) {
      this.state[row][column] = color
      this.onParticleColorChange(particle)
    }
    return particle
  }

  resetParticle ({ row, column }: { row: number, column: number }) {
    this.addParticle({
      row,
      column,
      color: this.backgroundColor
    })
  }

  _getSceneError (opts: {| type: ErrorType, message: string, info?: * |}) {
    const { type, message, info } = opts

    return this.Debugger.getError({ module: 'Scene', type, message, info })
  }
}
