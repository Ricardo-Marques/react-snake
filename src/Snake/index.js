// @flow
import type { IScene, Particle } from '../Scene'

type Direction =
  | 'UP'
  | 'RIGHT'
  | 'DOWN'
  | 'LEFT'

type SnakePiece = Particle

type SnakeCallbacks = {
  onSwitchDirectionsIntoBody?: Function
}

type SnakeConstructorOpts = {|
  row: number,
  column: number,
  initialDirection: Direction,
  tailColor: string,
  headColor: string,
  Scene: IScene,
  snakeCallbacks?: SnakeCallbacks
|}

type SnakePieceType = 'HEAD' | 'TAIL'

interface ISnake {
  pieces: Array<SnakePiece>,
  direction: $PropertyType<SnakeConstructorOpts, 'initialDirection'>,
  tailColor: $PropertyType<SnakeConstructorOpts, 'tailColor'>,
  headColor: $PropertyType<SnakeConstructorOpts, 'headColor'>,
  snakeCallbacks: SnakeCallbacks,

  Scene: $PropertyType<SnakeConstructorOpts, 'Scene'>,

  moveInDirection (Direction): void,

  _snakeParticleMap: {|
    [row: number]: {
      [column: number]: SnakePieceType
    }
  |},
  _getNewSnakePiece (row: number, column: number, type: SnakePieceType): SnakePiece,
  _removeTailTip (): void
}

class Snake implements ISnake {
  pieces: $PropertyType<ISnake, 'pieces'>
  direction: $PropertyType<ISnake, 'direction'>
  tailColor: $PropertyType<ISnake, 'tailColor'>
  headColor: $PropertyType<ISnake, 'headColor'>
  snakeCallbacks: $PropertyType<ISnake, 'snakeCallbacks'>

  Scene: $PropertyType<ISnake, 'Scene'>

  _snakeParticleMap: $PropertyType<ISnake, '_snakeParticleMap'>

  constructor (opts: SnakeConstructorOpts) {
    this.direction = opts.initialDirection
    this.tailColor = opts.tailColor
    this.headColor = opts.headColor
    this.Scene = opts.Scene
    this.snakeCallbacks = opts.snakeCallbacks || {}

    this.pieces = [
      this._getNewSnakePiece(opts.row, opts.column, 'HEAD')
    ]
  }

  moveInDirection (direction) {
    this._removeTailTip()
    const head = this._head

    if (
      direction === 'UP'    && this.direction === 'DOWN' ||
      direction === 'DOWN'  && this.direction === 'UP'   ||
      direction === 'RIGHT' && this.direction === 'LEFT' ||
      direction === 'LEFT'  && this.direction === 'RIGHT'
    ) {
      this.snakeCallbacks.onSwitchDirectionsIntoBody && this.snakeCallbacks.onSwitchDirectionsIntoBody()
      return
    }

    if (direction === 'UP') {
      this._moveHeadTo(head.row - 1, head.column)
    } else if (direction === 'DOWN') {
      this._moveHeadTo(head.row + 1, head.column)
    } else if (direction === 'LEFT') {
      this._moveHeadTo(head.row, head.column - 1)
    } else if (direction === 'LEFT') {
      this._moveHeadTo(head.row, head.column + 1)
    }
  }

  _getNewSnakePiece (row: number, column: number, type: SnakePieceType) {
    this._snakeParticleMap[row] = this._snakeParticleMap[row] || {}
    this._snakeParticleMap[row][column] = type
    return this.Scene.addParticle({
      row,
      column,
      color: type === 'HEAD' ? this.headColor : this.tailColor
    })
  }

  _removeSnakePiece (row: number, column: number) {
    const snakeParticle = this._snakeParticleMap[row][column]
    return this.Scene.resetParticle({ row, column })
  }

  get _head (): SnakePiece {
    return this.pieces[0]
  }

  _moveHeadTo (row: number, column: number) {
    const head = this._head
    const newHead = this._getNewSnakePiece(row, column, 'HEAD')
    this.pieces.unshift(newHead)
    this._getNewSnakePiece(head.row, head.column, 'TAIL')
  }

  _removeTailTip () {
    const tailTip = this.pieces.pop()
    this._removeSnakePiece(tailTip.row, tailTip.column)
  }
}
