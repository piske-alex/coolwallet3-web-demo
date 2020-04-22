import React, { useState } from 'react';
import { Container, Button, Row, Col, FormText, InputGroup, FormControl, ListGroup } from 'react-bootstrap';
import cwsBTC from '@coolwallets/btc';
import { getBTCBalance } from './utils'

function BitcoinTest({ transport, appPrivateKey, appId }) {
	let BTC;
	if (transport && appPrivateKey && appId)
		BTC = new cwsBTC(transport, appPrivateKey, appId);

  const [accounts, setAccounts] = useState([{ addressIndex: 0, address: '', balance: '' }]);
	const [isSigning, setIsSigning] = useState(false);

	const onIndexChange = (index, addressIndex) => {
		const copyAccounts = [...accounts];
		copyAccounts[index].addressIndex = addressIndex ? addressIndex : 0;
		setAccounts(copyAccounts);
	};

  const getAddress = async (id, e) => {
		console.log('id :', id);
		console.log('e :', e);
		//		try {
		//			const address = await BTC.getAddress(BTC.ScriptType.P2SH_P2WPKH, addressIndex);
		//			setAddress(address);
		//			const balance = await getBTCBalance(address);
		//			console.log(`Update BTC balance ${balance}`);
		//			setBalance(balance);
		//		} catch (error) {
		//			console.log('error :', error);
		//		}
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
			<ListGroup>
				{accounts.map((account, index) => Account(index, account, onIndexChange, getAddress))}
			</ListGroup>
			<br/>
      <h5>Sign Transaction</h5>
			<Row>
				<Button disabled={(!BTC || isSigning)} variant='outline-success' onClick={signTransaction}>
					{isSigning ? 'Signing ...' : 'Sign Transaction'}
				</Button>
			</Row>
    </Container>
  );
}

function Account(index, account, onIndexChange, onButtonClick) {
	return (
		<ListGroup.Item style={{ border: 'none', background: '#282c34', paddingTop: '4px', paddingBottom: '4px'}} key={index}>
			<Row>
				<Col md={3}>
					<InputGroup>
					  <FormControl
					    onChange={(event) => onIndexChange(index, parseInt(event.target.value))}
					    value={account.addressIndex}
					    placeholder={account.addressIndex}
					    aria-describedby='basic-addon2'
					  />
					  <InputGroup.Append>
					    <Button variant='outline-success' compact='true' onClick={onButtonClick}>
					      Get Address
					    </Button>
					  </InputGroup.Append>
					</InputGroup>
				</Col>
				<Col>
					<InputGroup.Text style={{ textAlign: 'left' }}>From: {account.address}</InputGroup.Text>
				</Col>
				<Col md={3}>
					<InputGroup.Text style={{ textAlign: 'left' }}>Balance: {account.balance}</InputGroup.Text>
				</Col>
			</Row>
		</ListGroup.Item>
	);
}

export default BitcoinTest;
