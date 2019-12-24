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
    sumOfSeed: 0
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

  createWallet = () => {
    this.props.wallet
      .createWallet(12)
  }

  sendCheckSum = () => {
    const sum = parseInt(this.state.sumOfSeed);
    console.log(`sum ${sum}, type ${typeof sum}`)
    this.props.wallet
    .sendCheckSum(sum).then(result => {
      console.log(`send checksum success`)
    }).catch(error=> {
      console.error(error)
    })
  }

  onchange = event => {
    const mnemonic = event.target.value
    this.setState({ mnemonic })
  }

  render() {
    return (
      <Container>
        <h4> About Wallet </h4>
        <Row>
          <InputGroup className='mb-3' style={{ margin: 20 }}>
            <FormControl
              onChange={this.onchange}
              value={this.state.mnemonic}
              placeholder='Mnemonic'
              aria-describedby='basic-addon2'
            />
            <InputGroup.Append>
              <Button variant="outline-light" mode='contained' compact='true' onClick={this.setMnemonic}>
                Set Seed
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Row>
        <Row>
          
          <InputGroup className='mb-3' style={{ margin: 20 }}>
          <Button variant="outline-light" mode='contained' compact='true' onClick={this.createWallet}>
                Create Wallet By Card
              </Button>
            <FormControl
              onChange={(event)=> {this.setState({sumOfSeed: event.target.value})}}
              value={this.state.sumOfSeed}
              placeholder='Sum Of Seed'
              aria-describedby='basic-addon2'
            />
            <InputGroup.Append>
              <Button variant="outline-light" mode='contained' compact='true' onClick={this.sendCheckSum}>
                Check Sum
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Row>
      </Container>
    )
  }
}

export default WalletTest
