import React, { Component } from 'react'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
// import View from 'react-bootstrap/View'

import Container from 'react-bootstrap/Container'

const bip39 = require('bip39')


class WalletTest extends Component {
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
        <h3> Wallet Utils </h3>
        <Row>
          <InputGroup className='mb-3'>
            <FormControl
              onChange={this.onchange}
              value={this.state.mnemonic}
              placeholder='Mnemonic'
              aria-describedby='basic-addon2'
            />
            <InputGroup.Append>
              <Button variant='outline-secondary' mode='contained' compact='true' onClick={this.setMnemonic}>
                Set Seed
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Row>
      </Container>
    )
  }
}

export default WalletTest
