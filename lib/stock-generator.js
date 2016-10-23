import {EventEmitter} from 'events'

export default class StockGenerator extends EventEmitter {
  constructor() {
    super()
    this._currentPrice = this._randomize(2, 0.9)
  }

  start() {
    this._loop()
  }

  stop() {
    this._stopped = true
    this.removeAllListeners()
  }

  get currentPrice() {
    return this._currentPrice.toFixed(4)
  }

  _loop() {
    setTimeout(() => {
      if (!this._stopped) {
        this._generate()
        this._loop()
      }
    }, 500)
  }

  _generate() {
    const priceChange = this._randomize(0.001, 0.0001) * (Math.random() < 0.5 ? -1 : 1)
    this._currentPrice += priceChange
    this.emit('change', {price: this._currentPrice.toFixed(4), change: priceChange.toFixed(4)})
  }

  _randomize(max, min) {
    return (Math.random() * (max - min)) + min
  }
}
