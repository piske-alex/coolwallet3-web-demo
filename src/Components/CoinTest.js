import React, { Component } from 'react'

import IconService from 'icon-sdk-js';
// import IconService from 'icon-sdk-js/build/icon-sdk-js.web.min.js';

import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import FormText from 'react-bootstrap/FormText'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'

const {
  IconBuilder,
  IconAmount,
  IconConverter
} = IconService;
const version = 3;
const network = 'https://wallet.icon.foundation/api/v3'
const nid = 1

const httpProvider = new IconService.HttpProvider(network);
const iconService = new IconService(httpProvider);

class CoinTest extends Component {
  constructor(props) {
    super(props)
  }

  state = {
    addressIndex: 0,
    gasLimit: 21000,
    gasPrice: 10,
    nonce: 0,
    balance: 0,
    address: '',
    to: '',
    value: '0',
    txHash: '',
  }

  getAddress = () => {
    const addressIdx = parseInt(this.state.addressIndex)
    this.props.Coin.getAddress(addressIdx).then(address => {
      this.setState({ address })
      iconService.getBalance(address).execute().then(loopValue => {
        const balance = IconAmount.of(loopValue, IconAmount.Unit.LOOP)
        .convertUnit(IconAmount.Unit.ICX)
        this.setState({balance})
      });

      
      // web3.eth.getBalance(address, "pending", (err, balance)=>{
      //   console.log(`Update balance ${balance}`)
      //   this.setState({balance: web3.utils.fromWei(balance)})
      // })
    })
  }

  signTx = () => {
    const { addressIndex, to, value, address } = this.state
    const txObj = new IconBuilder.IcxTransactionBuilder()
      .from(address)
      .to(to)
      .value(IconAmount.of(value, IconAmount.Unit.ICX).toLoop())
      .stepLimit(IconConverter.toBigNumber(100000))
      .nid(IconConverter.toBigNumber(nid))
      //   .nonce(IconConverter.toBigNumber(nonce))
      .version(IconConverter.toBigNumber(version))
      .timestamp(0)
      .build();
    // Returns raw transaction object
    const rawTx = IconConverter.toRawTransaction(txObj);
    // this.props.Coin.signTransaction(transaction, addressIndex, publicKey)
    
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

export default CoinTest
