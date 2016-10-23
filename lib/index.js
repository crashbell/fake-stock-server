import WebSocket from 'ws'
import StockGenerator from './stock-generator'
import StockSocket from './stock-socket'

const {Server} = WebSocket

export default class StockServer {
  constructor(port, stockCodes = ['EURUSD']) {
    this._port = port
    this._stockCodes = stockCodes
    this._stockGenerators = []
    this._stockSockets = []
  }

  start() {
    this._wss = new Server({port: this._port})
    for (const code of this._stockCodes) {
      const stockGen = this._stockGenerators[code] = new StockGenerator()
      stockGen.start()
      stockGen.on('change', (value) => {
        for (const stockSocket of this._stockSockets) {
          if (stockSocket) {
            if (stockSocket.registeredCodes.includes(code)) {
              stockSocket.send({type: 'change', code, value})
            }
          }
        }
      })
    }
    
    this._wss.on('connection', ::this._onConnection)
  }

  stop() {
    this._wss.close()
    for (const code of this._stockCodes) {
      const stockGen = this._stockGenerators[code]
      if (stockGen) {
        stockGen.stop()
      }
    }
  }

  getPrice(code) {
    const stockGen = this._stockGenerators[code]
    if (stockGen) {
      return stockGen.currentPrice
    }
  }

  _onConnection(ws) {
    const stockSocket = new StockSocket(ws, this._stockCodes)
    this._stockSockets.push(stockSocket)
    ws.on('close', () => {
      delete this._stockSockets[this._stockSockets.indexOf(stockSocket)]
    })
  }
}
