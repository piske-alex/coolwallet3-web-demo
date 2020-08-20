import React, { Component } from 'react';

import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormText from 'react-bootstrap/FormText';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

import { getTxObject } from './coinUtil';

class CoinTest extends Component {
  state = {
    publicKey: '',
    addressIndex: 0,
    address: '',
    to: 'bnb1uzsh50kfmh73m8ytfcta7p3zceull2ycnttw5s',
    amount: 100000,

    signature: '',
  };

  getPublicKey = async () => {
    const addressIdx = parseInt(this.state.addressIndex);
    const publicKey = await this.props.Coin.getPublicKey(addressIdx);
    this.setState({ publicKey });
  };

  getAddress = () => {
    const addressIdx = parseInt(this.state.addressIndex);
    this.props.Coin.getAddress(addressIdx).then((address) => {
      this.setState({ address: address });
    });
  };

  signTx = async () => {
    const { address, to, amount, addressIndex } = this.state;
    const tx = getTxObject(address, to, amount);
    const signature = await this.props.Coin.signTransfer(tx, addressIndex);
    this.setState({ signature });
  };

  signPlaceOrder = async () => {
    const { address, addressIndex } = this.state;
    const tx = {
      account_number: '39',
      chain_id: 'Binance-Chain-Tigris',
      data: null,
      memo: '',
      msgs: [
        {
          id: 'D1A42A815FC6A339ECD8BFCD093DD1A835F40E13-505',
          ordertype: 2,
          price: 29333,
          quantity: 1000000000,
          sender: address,
          side: 1,
          symbol: 'PYN-C37_BNB',
          timeinforce: 1,
        },
      ],
      sequence: '504',
      source: '1',
    };
    const signature = await this.props.Coin.placeOrder(tx, addressIndex);

    this.setState({ signature });
  };

  signCancelOrder = async () => {
    const { address, addressIndex } = this.state;
    const tx = {
      account_number: '39',
      chain_id: 'Binance-Chain-Tigris',
      data: null,
      memo: '',
      msgs: [
        {
          refid: 'D1A42A815FC6A339ECD8BFCD093DD1A835F40E13-506',
          sender: address,
          symbol: 'PYN-C37_BNB',
        },
      ],
      sequence: '506',
      source: '1',
    };
    const signature = await this.props.Coin.cancelOrder(tx, addressIndex);

    this.setState({ signature });
  };

  render() {
    return (
      <Container style={{ textAlign: 'left' }}>
        <h4 style={{ margin: 20 }}> Binance Dex Tx</h4>
        <Container>
          {/* Get Address from Card */}
          <Row>
            <Col xs={3}>
              <InputGroup className='mb-3'>
                <FormControl
                  onChange={(event) => {
                    this.setState({ addressIndex: parseInt(event.target.value) });
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
                  <Form.Group as={Col}>
                    <Form.Label> Transfer To </Form.Label>
                    <Form.Control
                      value={this.state.to}
                      onChange={(event) => {
                        this.setState({ to: event.target.value });
                      }}
                      placeholder='bnb...'
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                      type='value'
                      value={this.state.amount}
                      onChange={(event) => {
                        this.setState({ amount: event.target.value });
                      }}
                      placeholder='Amount in BNB'
                    />
                  </Form.Group>
                </Form.Row>
                <Button variant='outline-success' onClick={this.signTx} disabled={this.isSigning}>
                  Sign Transfer
                </Button>
                <br />
                <br />
                <Button
                  variant='outline-success'
                  onClick={this.signPlaceOrder}
                  disabled={this.isSigning}
                >
                  Demo Place Order
                </Button>
                <Button
                  variant='outline-success'
                  onClick={this.signCancelOrder}
                  disabled={this.isSigning}
                >
                  Demo Cancel Order
                </Button>
              </Form>
            </Col>
          </Row>
          <Row style={{ paddingTop: 20 }}>
            <Col ms={12}>
              <p style={{ textAlign: 'left', fontSize: 20 }}> Signature: {this.state.signature} </p>
            </Col>
          </Row>
        </Container>
      </Container>
    );
  }
}

export default CoinTest;
