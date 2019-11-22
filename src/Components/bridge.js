import CoolWalletEth from '@coolwallets/eth'

export default class CoolWalletBridge {
  constructor(appPrivateKey) {
    this.appPrivateKey = appPrivateKey
    this.bc = new BroadcastChannel('coolwallets')
    this.addEventListeners()
    console.log(`new CoolWalletBridge`)
    this.cleanTab()
  }

  addEventListeners() {
    const tabDomain = 'https://antoncoding.github.io'
    if (window.parent !== window) {
      onmessage = async ({ data, source, origin }) => {
        if (data.target === 'CWS-IFRAME') {
          if (source === window.parent) {
            // data from extension
            data.target = 'CWS-TAB'
            if (this.childTab === null) {
              this.childTab = window.open(tabDomain, 'tab')
              this.childTab.onbeforeunload = this.cleanTab()
            }

            while (this.blockOnFirstCall === true) {
              console.log(`blocking...`)
              await this.sleep(1000)
            }
            this.bc.postMessage(data, '*')

            this.childTab.focus()
          }
        }
      }

      this.bc.onmessage = ({ data, source }) => {
        if (data.target === 'connection-success') {
          console.log(`child tab connected!`)
          this.blockOnFirstCall = false
        } else {
          this.sendMessageToExtension(data)
        }
      }
    } else {
      this.bc.onmessage = ({ data }) => {
        if (data && data.target === 'CWS-TAB') {
          const { action, params } = data
          const replyAction = `${action}-reply`
          switch (action) {
            case 'coolwallet-unlock':
              this.unlock(replyAction, params.addrIndex)
              break
            case 'coolwallet-sign-transaction':
              this.signTransaction(replyAction, params.addrIndex, params.tx, params.publicKey)
              break
            case 'coolwallet-sign-personal-message':
              this.signPersonalMessage(replyAction, params.addrIndex, params.message, params.publicKey)
              break
            default:
              break
          }
        }
      }
    }
  }

  sendMessageToExtension(msg) {
    window.parent.postMessage(msg, '*')
  }

  sendMessageToIframe(msg) {
    this.bc.postMessage(msg)
    window.opener.focus()
  }

  async waitForConnection() {
    try {
      while (this.transport === null) {
        setTimeout(console.log('Waiting for connection'), 3000)
      }
      const appId = this.getAppId()
      this.app = new CoolWalletEth(this.transport, this.appPrivateKey, appId)
    } catch (e) {
      console.log('CWS:::CONNECTION ERROR', e)
    }
  }

  getAppId() {
    return localStorage.getItem('appId')
  }

  cleanUp() {
    this.app = null
  }

  cleanTab() {
    this.childTab = null
    this.blockOnFirstCall = true
  }

  async unlock(replyAction, addrIndex) {
    try {
      await this.waitForConnection()
      const res = await this.app.getPublicKey(addrIndex, true)
      this.sendMessageToIframe({
        action: replyAction,
        success: true,
        payload: res,
      })
    } catch (err) {
      this.sendMessageToIframe({
        action: replyAction,
        success: false,
        payload: { error: err.toString() },
      })
    } finally {
      this.cleanUp()
    }
  }

  async signTransaction(replyAction, addrIndex, tx, publicKey) {
    try {
      await this.waitForConnection()
      const res = await this.app.signTransaction(tx, addrIndex, publicKey)
      this.sendMessageToIframe({
        action: replyAction,
        success: true,
        payload: res,
      })
    } catch (err) {
      this.sendMessageToIframe({
        action: replyAction,
        success: false,
        payload: { error: err.toString() },
      })
    } finally {
      this.cleanUp()
    }
  }

  async signPersonalMessage(replyAction, addIndex, message) {
    try {
      await this.waitForConnection()
      const res = await this.app.signMessage(message, addIndex)

      this.sendMessageToIframe({
        action: replyAction,
        success: true,
        payload: res,
      })
    } catch (err) {
      this.sendMessageToIframe({
        action: replyAction,
        success: false,
        payload: { error: err.toString() },
      })
    } finally {
      this.cleanUp()
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
