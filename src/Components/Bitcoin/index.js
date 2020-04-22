import React, { useState } from 'react';
import { Container, Button, Row, Col, InputGroup, FormControl, ListGroup } from 'react-bootstrap';
import cwsBTC from '@coolwallets/btc';
import { getBTCBalance } from './utils'

function BitcoinTest({ transport, appPrivateKey, appId }) {
	console.log('transport :', transport);
	console.log('appPrivateKey :', appPrivateKey);
	console.log('appId :', appId);

	let BTC;
	if (transport && appPrivateKey && appId)
		BTC = new cwsBTC(transport, appPrivateKey, appId);

	const disabled = false; // !BTC;

  const [accounts, setAccounts] = useState([{ addressIndex: 0, address: '', balance: '' }]);
	const [toAddress, setToAddress] = useState('');
	const [isSigning, setIsSigning] = useState(false);

	const onIndexChange = (index, addressIndex) => {
		const copyAccounts = [...accounts];
		copyAccounts[index].addressIndex = addressIndex ? addressIndex : 0;
		setAccounts(copyAccounts);
	};

  const getAddress = async (index) => {
		try {
			const addressIndex = accounts[index].addressIndex;
			const address = await BTC.getAddress(BTC.ScriptType.P2SH_P2WPKH, addressIndex);
			const balance = await getBTCBalance(address);
			console.log(`Update BTC balance ${balance}`);

			const copyAccounts = [...accounts];
			copyAccounts[index].address = address;
			copyAccounts[index].balance = balance;
			setAccounts(copyAccounts);
		} catch (error) {
			console.log('error :', error);
		}
  };

	const onToAddressChange = (to) => {
		setToAddress(to);
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
				{accounts.map((account, index) => Account(disabled, index, account, onIndexChange, getAddress))}
			</ListGroup>
			<br/>
      <h5>Sign Transaction</h5>
			<Row style={{ padding: '16px', background: '#242030' }}>
				<Col md={6}>
					<InputGroup>
						<InputGroup.Prepend>
							<InputGroup.Text id="basic-addon1">To</InputGroup.Text>
						</InputGroup.Prepend>
					  <FormControl
							disabled={disabled}
					    onChange={(event) => onToAddressChange(event.target.value)}
					    value={toAddress}
					    placeholder='Recipient Address'
					    aria-describedby='basic-addon1'
					  />
					</InputGroup>
				</Col>
				<Button disabled={(disabled || isSigning)} variant='outline-success' onClick={signTransaction}>
					{isSigning ? 'Signing ...' : 'Sign Transaction'}
				</Button>
			</Row>
    </Container>
  );
}

function Account(disabled, index, account, onIndexChange, onButtonClick) {
	return (
		<ListGroup.Item style={{ border: 'none', background: '#242030', paddingTop: '6px', paddingBottom: '6px'}} key={index}>
			<Row>
				<Col md={3}>
					<InputGroup>
					  <FormControl
							disabled={disabled}
					    onChange={(event) => onIndexChange(index, parseInt(event.target.value))}
					    value={account.addressIndex}
					    placeholder={account.addressIndex}
					  />
					  <InputGroup.Append>
							<Button disabled={disabled} variant='outline-success' compact='true' onClick={() => onButtonClick(index)}>
					      Get Address
					    </Button>
					  </InputGroup.Append>
					</InputGroup>
				</Col>
				<Col md={6}>
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
