import _Scene from './index'
import sinon, { assert } from 'sinon'

import Debugger from '../Debugger'

describe('Scene', () => {
  const basicSceneOpts = {
    rows: 2,
    columns: 2,
    backgroundColor: 'aqua',
    onParticleColorChange: () => {},
    Debugger: new Debugger()
  }

  describe('on construct', () => {
    let sandbox = sinon.sandbox.create()

    afterEach(() => {
      sandbox.restore()
    })

    it('caches scene config', () => {
      const Scene = new _Scene(basicSceneOpts)

      Object.keys(basicSceneOpts).forEach(opt => {
        if (Scene[opt] !== basicSceneOpts[opt]) {
          throw Error(`${opt} didn't get cached`)
        }
      })
    })

    it('creates an initial state', () => {
      const intialState = {}
      sandbox.stub(_Scene.prototype, 'getInitialSceneState').returns(intialState)

      const Scene = new _Scene(basicSceneOpts)
      expect(Scene.state).toEqual(intialState)
    })
  })

  describe('methods', () => {
    let sandbox = sinon.sandbox.create()


    describe('getInitialSceneState', () => {
      afterEach(() => {
        sandbox.restore()
      })

      it('retuns an initial scene state by repeating the backgroundColor over all row-column coordinates', () => {
        expect(_Scene.prototype.getInitialSceneState({ rows: 2, columns: 2, backgroundColor: 'aqua' })).toEqual({
          1: {
            1: 'aqua',
            2: 'aqua'
          },
          2: {
            1: 'aqua',
            2: 'aqua'
          }
        })
      })
    })

    describe('addParticle', () => {
      afterEach(() => {
        sandbox.restore()
      })

      it('adds a new particle to the scene', () => {
        const Scene = new _Scene(basicSceneOpts)

        Scene.addParticle({ row: 1, column: 2, color: 'red' })
        expect(Scene.state[1][2]).toEqual('red')
      })

      it('calls onParticleColorChange if the particle color has changed', () => {
        const Scene = new _Scene(basicSceneOpts)
        sandbox.spy(Scene, 'onParticleColorChange')

        const newParticle = { row: 1, column: 2, color: 'red' }
        Scene.addParticle(newParticle)

        assert.calledOnce(Scene.onParticleColorChange)
        assert.calledWith(Scene.onParticleColorChange, newParticle)
      })

      it('throws a scene error if given a particle out of bounds', () => {
        const Scene = new _Scene(basicSceneOpts)
        const error = {}
        sandbox.stub(Scene, '_throwSceneError').returns(error)

        expect(Scene.addParticle({ row: 0, column: 2, color: 'red' })).toEqual(error)
        assert.calledOnce(Scene._throwSceneError)
        assert.calledWith(Scene._throwSceneError, {
          type: Scene.Debugger.errorTypes.RangeError,
          message: '(addParticle) row: 0 column: 2 is out of bounds'
        })
      })
    })

    describe('resetParticle', () => {
      afterEach(() => {
        sandbox.restore()
      })

      it('calls Scene.addParticle with the particles row and column, with color set to the backgroundColor', () => {
        const Scene = new _Scene(basicSceneOpts)
        sandbox.stub(Scene, 'addParticle')
        Scene.resetParticle({ row: 1, column: 1 })

        assert.calledOnce(Scene.addParticle)
        assert.calledWith(Scene.addParticle, {
          row: 1,
          column: 1,
          color: basicSceneOpts.backgroundColor
        })
      })
    })

    describe('_throwSceneError', () => {
      afterEach(() => {
        sandbox.restore()
      })

      it(`calls Scene.Debugger.throw with module set to 'Scene'`, () => {
        const Scene = new _Scene(basicSceneOpts)
        sandbox.stub(Scene.Debugger, 'throw')

        const error = { type: '', message: '', info: '' }
        Scene._throwSceneError(error)
        assert.calledOnce(Scene.Debugger.throw)
        assert.calledWith(Scene.Debugger.throw, {
          ...error,
          module: 'Scene'
        })
      })
    })
  })
})
