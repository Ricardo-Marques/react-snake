// @flow
import type { IScene, Particle } from '../Scene'

type Direction = 'up' | 'right' | 'down' | 'left'

type SnakePiece = Particle

type SnakeConstructorOpts = {|
  row: number,
  column: number,
  initialDirection: Direction,
  bodyColor: string,
  headColor: string,
  Scene: IScene,
|}

interface ISnake {
  pieces: Array<SnakePiece>,
  direction: Direction,
  bodyColor: string,
  headColor: string,
  Scene: IScene,
  getNewSnakePiece (row: number, column: number, color: string): SnakePiece
}

class Snake implements ISnake {
  pieces: $PropertyType<ISnake, 'pieces'>
  direction: $PropertyType<SnakeConstructorOpts, 'initialDirection'>
  bodyColor: $PropertyType<SnakeConstructorOpts, 'bodyColor'>
  headColor: $PropertyType<SnakeConstructorOpts, 'headColor'>
  Scene: $PropertyType<SnakeConstructorOpts, 'Scene'>

  constructor (opts: SnakeConstructorOpts) {
    this.direction = opts.initialDirection
    this.bodyColor = opts.bodyColor
    this.headColor = opts.headColor
    this.Scene = opts.Scene

    this.pieces = [
      this.getNewSnakePiece(opts.row, opts.column, this.headColor)
    ]
  }

  moveInDirection (direction) {
    this.removeTailTip()
    if (direction === this.direction) {

    }
  }

  _getNewSnakePiece (row, column, color) {
    return this.Scene.addParticle({ row, column, color })
  }

  _moveSnakePiece (piece, row, y) {
    piece.row = row
    piece.y = y
  }

  get head (): SnakePiece {
    return this.pieces[0]
  }

  _removeTailTip () {
    this.pieces
  }
}
