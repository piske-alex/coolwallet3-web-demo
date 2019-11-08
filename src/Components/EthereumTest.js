import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import FormText from 'react-bootstrap/FormText'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Web3 from 'web3'
import GasMenu from './GasMenu'

const web3 = new Web3('https://ropsten.infura.io/v3/44fd23cda65746a699a5d3c0e2fa45d5')

class EthTest extends Component {
  constructor(props) {
    super(props)
    this.gasHandler = this.gasHandler.bind(this)
  }

  state = {
    addressIndex: 0,
    gasLimit: 21000,
    gasPrice: 10,
    nonce: 0,
    address: '',
    to: '',
    value: '0',
    data: '0x00',
    txHash: '',
  }

  getAddress = () => {
    const addressIdx = parseInt(this.state.addressIndex)
    this.props.ETH.getAddress(addressIdx).then(address => {
      this.setState({ address })
    })
  }

  gasHandler = gasPrice => {
    const gasPriceInGWei = gasPrice / 10
    this.setState({
      gasPrice: gasPriceInGWei,
    })
  }

  signTx = () => {
    const { addressIndex, to, value, data, gasPrice, address } = this.state
    web3.eth.getTransactionCount(address, 'pending').then(nonce => { // Get latest nonce
      web3.eth.estimateGas({ to, data }, (_, gasLimit) => {         // Get gasLimit
        const gasLimitHex = web3.utils.toHex(gasLimit)
        const gasPriceHex = web3.utils.toHex(web3.utils.toWei(gasPrice.toString(), 'Gwei'))
        const param = {
          nonce: web3.utils.toHex(nonce),
          gasPrice: gasPriceHex,
          gasLimit: gasLimitHex,
          to,
          value: web3.utils.toHex(web3.utils.toWei(value.toString(), 'ether')),
          data,
        }
        this.props.ETH.signTransaction(param, addressIndex).then(signedTx => {
          web3.eth.sendSignedTransaction(signedTx, (err, txHash) => {
            if (err) { console.error(err) }
            this.setState({ txHash })
          })
        })
      })
    })
    
  }

  render() {
    return (
      <Container style={{ textAlign: 'left' }}>
        <h4 style={{ margin: 20 }}>Ethereum Tx</h4>
        <Container>
          {/* Get Address from Card */}
          <Row>
            <Col xs={3}>
              <InputGroup className='mb-3'>
                <FormControl
                  onChange={event => {
                    this.setState({ addressIndex: parseInt(event.target.value) })
                  }}
                  value={this.state.addressIndex}
                  placeholder='Index'
                  aria-describedby='basic-addon2'
                />
                <InputGroup.Append>
                  <Button variant='outline-success' compact='true' onClick={this.getAddress}>
                    Get Address
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </Col>
            <Col>
              <FormText style={{ textAlign: 'left' }}> From {this.state.address} </FormText>
            </Col>
          </Row>
          {/* Sign Test Transfer */}
          <Row>
            <Col>
              <Form>
                <Form.Row>
                  <Form.Group as={Col} controlId='formGridTo'>
                    <Form.Label>To</Form.Label>
                    <Form.Control
                      onChange={event => {
                        this.setState({ to: event.target.value })
                      }}
                      placeholder='0x...'
                    />
                  </Form.Group>

                  <Form.Group xs={4} md={2} as={Col} controlId='Amount'>
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                      type='value'
                      onChange={event => {
                        this.setState({ value: event.target.value })
                      }}
                      placeholder='Amount in Eth'
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label> Gas (Gwei) </Form.Label>
                    <GasMenu handler={this.gasHandler}></GasMenu>
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col}>
                    <Form.Label>Data</Form.Label>
                    <Form.Control
                      onChange={event => {
                        this.setState({ data: event.target.value })
                      }}
                      placeholder='0x...'
                    />
                  </Form.Group>
                </Form.Row>

                <Button variant='outline-success' onClick={this.signTx} disabled={this.isSigning}>
                  Sign & Send
                </Button>
              </Form>
            </Col>
          </Row>
          <Row style={{ paddingTop: 20 }}>
            <Col ms={12}>
              <p style={{ textAlign: 'left', fontSize: 20 }}> Result: {this.state.txHash} </p>
            </Col>
          </Row>
        </Container>
      </Container>
    )
  }
}

export default EthTest
