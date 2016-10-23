export default class StockSocket {
  constructor(ws, supportedCodes = []) {
    this._ws = ws
    this._supportedCodes = supportedCodes
    this.registeredCodes = []

    ws.on('message', ::this._onMessage)
    this.send({type: 'supported-codes', value: supportedCodes})
  }

  send(data) {
    this._ws.send(JSON.stringify(data))
  }

  _onMessage(data) {
    const {type, value} = JSON.parse(data)
    if (type === 'register') {
      this._onRegister(value)
    }
  }

  _onRegister(code) {
    if (this._supportedCodes.includes(code)) {
      this.registeredCodes.push(code)
    }
    else {
      this.send({type: 'error', value: 'Stock code not available'})
    }
  }
}
