import React, { Component } from 'react';

import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormText from 'react-bootstrap/FormText';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

import { getRawTransaction, sendTransaction } from './coinUtil';

class CoinTest extends Component {
  state = {

    publicKey: '',
    addressIndex: 0,
    address: '',
    to: 'rp6ENYKqYfT5qJqQiN2Y9AnZmFEWv9hRpq',
    destinationTag: 1882298635,
    sequence: 1566719,
    lastsequence: 47914574,
    fee: '0',
    amount: '0',

    txHash: '',
  };

  getPublicKey = async () => {
    const addressIdx = parseInt(this.state.addressIndex);
    const publicKey = await this.props.Coin.getPublicKey(addressIdx)
    this.setState({ publicKey });
  };

  getAddress = () => {
    const addressIdx = parseInt(this.state.addressIndex);
    this.props.Coin.getAddress(addressIdx).then((address) => {
      this.setState({ address: address });
    });
  };

  signTx = async () => {
    const payment = {
      TransactionType: 'Payment',
      Flags: '2147483648',
      Sequence: this.state.sequence,
      DestinationTag: this.state.destinationTag,
      LastLedgerSequence: this.state.lastsequence,
      Amount: this.state.amount,
      Fee: this.state.fee,
      Account: this.state.address,
      Destination: this.state.to
    }
    console.log(payment)
  
    const signedTx = await this.props.Coin.signPayment(payment, this.state.addressIndex);
    console.log(signedTx)
    // const message = await sendTransaction(address, signature);
    // this.setState({ txHash: message });
  };

  render() {
    return (
      <Container style={{ textAlign: 'left' }}>
        <h4 style={{ margin: 20 }}>Ripple Tx</h4>
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
                    <Form.Label>Destination</Form.Label>
                    <Form.Control
                      value = {this.state.to}
                      onChange={(event) => {
                        this.setState({ to: event.target.value });
                      }}
                      placeholder='rXp...'
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                      type='value'
                      value = {this.state.amount}
                      onChange={(event) => {
                        this.setState({ amount: event.target.value });
                      }}
                      placeholder='Amount in XRP'
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Fee</Form.Label>
                    <Form.Control
                      type='value'
                      value = {this.state.fee}
                      onChange={(event) => {
                        this.setState({ fee: event.target.value });
                      }}
                      placeholder='Amount in XRP'
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col}>
                    <Form.Label>Sequence</Form.Label>
                    <Form.Control 
                    value = {this.state.sequence}
                      onChange={(event) => {
                        this.setState({ sequence: event.target.value });
                      }}
                      type='value'
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>DestinationTag</Form.Label>
                    <Form.Control
                    value = {this.state.destinationTag}
                      onChange={(event) => {
                        this.setState({ destinationTag: event.target.value });
                      }}
                      type='value'
                    />
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>LastLedgerSequence</Form.Label>
                    <Form.Control
                    value = {this.state.lastsequence}
                      type='value'
                      onChange={(event) => {
                        this.setState({ lastsequence: event.target.value });
                      }}
                    />
                  </Form.Group>
                </Form.Row>

                <Button variant='outline-success' onClick={this.signTx} disabled={this.isSigning}>
                  Sign Payment
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
    );
  }
}

export default CoinTest;
