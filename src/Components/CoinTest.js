import React, { Component } from 'react'

import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import FormText from 'react-bootstrap/FormText'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'

import { getBalance, getRawTransaction, sendTransaction } from './coinUtil'

class CoinTest extends Component {

  state = {
    addressIndex: 0,
    balance: 0,
    address: '',
    to: '',
    value: '0',
    txHash: '',
  }

  getAddress = () => {
    const addressIdx = parseInt(this.state.addressIndex)
    this.props.Coin.getAccount(addressIdx).then(address => {
      this.setState({ address })
      getBalance(address).then(balance => {
        this.setState({balance})
      })
    })
  }

  signTx = async () => {
    const { addressIndex, to, value, address } = this.state
    const sigbase = await getRawTransaction(address, to, value)
    const signature = await this.props.Coin.signTransaction(sigbase, addressIndex)
    const message = await sendTransaction(address, signature)
    this.setState({txHash: message})

  }

  render() {
    return (
      <Container style={{ textAlign: 'left' }}>
        <h4 style={{ margin: 20 }}>Stellar Tx</h4>
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
              <FormText style={{ textAlign: 'left' }}> Balance: {this.state.balance} </FormText>
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
                      placeholder='hx...'
                    />
                  </Form.Group>

                  <Form.Group xs={4} md={2} as={Col} controlId='Amount'>
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                      type='value'
                      onChange={event => {
                        this.setState({ value: event.target.value })
                      }}
                      placeholder='Amount in ICX'
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

export default CoinTest
