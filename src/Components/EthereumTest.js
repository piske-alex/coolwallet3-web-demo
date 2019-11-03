import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'

const bip39 = require('bip39')

class EthTest extends Component {
  state = {
    mnemonic: '',
  }
  setMnemonic = () => {
    const mnemonic = this.state.mnemonic
    const hex = bip39.mnemonicToSeedSync(mnemonic).toString('hex')
    console.log(`setting seed ${hex}`)
    this.props.wallet
      .setSeed(hex)
      .then(() => {
        console.log(`Set seed success!`)
      })
      .catch(error => {
        console.log(error)
      })
  }

  onchange = event => {
    const mnemonic = event.target.value
    this.setState({ mnemonic })
  }

  render() {
    console.log(this.state)
    return (
      <Container>
        <h3>Ethereum Test</h3>
        <Row>
          <Button
            onClick={() => {
              this.props.ETH.getAddress(0).then(addr => {
                console.log(`Got address => ${addr}`)
              })
            }}
          >
            getAddress
          </Button>
        </Row>
        <Row>
          <Button
            onClick={() => {
              const payload = 'eb81f884b2d05e00825208940644de2a0cf3f11ef6ad89c264585406ea346a96870107c0e2fc200080018080'
                // const publicKey = "033a057e1f19ea73423bd75f4d391dd28145636081bf0c2674f89fd6d04738f293";
              const addressIndex = 0
              this.props.ETH.signTransaction(payload, addressIndex).then(hex => {
                console.log(`signed Hex: ${hex}`)
              })
            }}
          > Sign Transfer!
          </Button>
        </Row>
      </Container>
    )
  }
}

export default EthTest
