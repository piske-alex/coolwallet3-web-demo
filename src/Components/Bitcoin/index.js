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

	const [isSigning, setIsSigning] = useState(false);

  const getAddress = async () => {
    const address = await BTC.getAddress(BTC.ScriptType.P2SH_P2WPKH, addressIndex);
    setAddress(address);
    const balance = await getBTCBalance(address);
    console.log(`Update BTC balance ${balance}`);
    setBalance(balance);
  };

	const signTransaction = async () => {
		setIsSigning(true);

		console.log('signing ...');

		const inputs = [{
			preTxHash: 'ce3e845aedad19ad8ece79964cf474a2588011c42cfdd8c32aafa6b8aafcd178',
			preIndex: 2,
			preValue: '17867',
			addressIndex: 0,
		}];
		const output = {
			value: '400',
			address: '36dNctMeLNp2TDC7pBx6GdXTLTVqy4oY92',
		};

		const transaction = await BTC.signTransaction(BTC.ScriptType.P2SH_P2WPKH, inputs, output);
		console.log('transaction :', transaction);

		setIsSigning(false);
	};

  return (
    <Container style={{ textAlign: 'left' }}>
      <h5> Get Address</h5>

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
          <FormText style={{ textAlign: 'left' }}>From: {address}</FormText>
        </Col>
        <Col>
          <FormText style={{ textAlign: 'left' }}>Balance: {balance}</FormText>
        </Col>
      </Row>
			<br/>

      <h5>Sign Transaction</h5>
			<Row>
				<Button disabled={isSigning} variant='outline-success' onClick={signTransaction}>
					{isSigning ? 'Signing ...' : 'Sign Transaction'}
				</Button>
			</Row>
      
    </Container>
  );
}

export default BitcoinTest;
