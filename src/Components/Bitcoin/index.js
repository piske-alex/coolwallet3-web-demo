import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormText from 'react-bootstrap/FormText';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Container from 'react-bootstrap/Container';
import cwsBTC from '@coolwallets/btc';

import { getBTCBalance } from './utils'


function BitcoinTest({ transport, appPrivateKey, appId }) {
  const BTC = new cwsBTC(transport, appPrivateKey, appId);

  const [addressIndex, setAddressIndex] = useState(0);
  const [balance, setBalance] = useState(0);

  const [address, setAddress] = useState('');

  const getAddress = () => {
    const addressIdx = parseInt(addressIndex);
    BTC.getSegwitAddress(addressIdx).then((address) => {
      setAddress(address);
      getBTCBalance(address).then((balance) => {
        console.log(`Update BTC balance ${balance}`);
        setBalance(balance);
      });
    });
  };

  return (
    <Container style={{ textAlign: 'left' }}>
      <h5> Get Address</h5>
      {/* Get Address from Card */}
      <Row>
        <Col xs={3}>
          <InputGroup className='mb-3'>
            <FormControl
              onChange={(event) => {
                setAddressIndex(parseInt(event.target.value));
              }}
              value={addressIndex}
              placeholder='Index'
              aria-describedby='basic-addon2'
            />
            <InputGroup.Append>
              <Button variant='outline-success' compact='true' onClick={getAddress}>
                Get Address
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Col>
        <Col>
          <FormText style={{ textAlign: 'left' }}> From {address} </FormText>
          <FormText style={{ textAlign: 'left' }}> Balance: {balance} </FormText>
        </Col>
      </Row>
      <br></br>
      
    </Container>
  );
}

export default BitcoinTest;
