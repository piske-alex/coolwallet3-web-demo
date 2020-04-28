import React, { useState } from 'react';
import { Container, Button, Row, Col, InputGroup, FormControl, ListGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import cwsBTC from '@coolwallets/btc';
import { getFee, getAccounts, getUtxos } from './api'

let BTC;

function BitcoinTest({ transport, appPrivateKey, appId }) {
	if (!BTC && transport && appPrivateKey && appId) {
		console.log('transport :', transport);
		console.log('appPrivateKey :', appPrivateKey);
		console.log('appId :', appId);

		BTC = new cwsBTC(transport, appPrivateKey, appId);
		updateAccounts(10);
	}

	const disabled = false; // !BTC;

  const [accounts, setAccounts] = useState([{ address: '', balance: '' }]);
	const [utxos, setUtxos] = useState([]);

  const [fromAddressIndices, setFromAddressIndices] = useState([0]);
	const [changeAddressIndex, setChangeAddressIndex] = useState(0);
	const [toAddress, setToAddress] = useState('');
	const [isSigning, setIsSigning] = useState(false);

	const onFromIndexChange = (itemIndex, addressIndex) => {
		const copyIndices = [...fromAddressIndices];
		copyIndices[itemIndex] = addressIndex ? addressIndex : 0;
		setFromAddressIndices(copyIndices);
	};

	const onChangeIndexChange = (itemIndex, addressIndex) => {
		setChangeAddressIndex(addressIndex);
	};

  async function updateAccounts(maxAddrIndex) {
		try {
			const addresses = [];
			const outScripts = [];
			for (let index=0; index < maxAddrIndex; index++) {
				const { address, outScript } = await BTC.getAddressAndOutScript(BTC.ScriptType.P2SH_P2WPKH, index);
				addresses.push(address);
				outScripts.push(outScript.toString('hex'));
			}
			const newAccounts = await getAccounts(addresses);
			const newUtxos = await getUtxos(addresses, outScripts);
			setAccounts(newAccounts);
			setUtxos(newUtxos);

			setFromAddressIndices([0, 1, 2]);

			const fee = await getFee();
			console.log('fee :', fee);

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

      <h5>From Addresses</h5>
			<div style={{ background: '#242030' }}>
				<ListGroup>
					{fromAddressIndices.map((index, key) => showAccount(disabled, key, index, accounts, 'From', onFromIndexChange))}
				</ListGroup>
			</div>
			<br/>

      <h5>Sign Transaction</h5>
			<div style={{ background: '#242030' }}>
				<Row>
					<Col>

						<Row>
							<Col>
								<ListGroup>
									{showAccount(disabled, 0, changeAddressIndex, accounts, 'Change', onChangeIndexChange)}
								</ListGroup>
							</Col>
						</Row>
						<Row style={{ padding: '20px' }}>
							<Col md={8}>
								<InputGroup>
									<InputGroup.Prepend>
										<InputGroup.Text id="basic-addon1">To</InputGroup.Text>
									</InputGroup.Prepend>
								  <FormControl
										disabled={disabled}
								    onChange={(event) => onToAddressChange(event.target.value)}
								    value={toAddress}
								    placeholder="Recipient's Address"
								    aria-describedby='basic-addon1'
								  />
								</InputGroup>
							</Col>
							<Button disabled={(disabled || isSigning)} variant='outline-success' onClick={signTransaction}>
								{isSigning ? 'Signing ...' : 'Sign Transaction'}
							</Button>
						</Row>

					</Col>
				</Row>
			</div>
    </Container>
  );
}

function showAccount(disabled, itemKey, addressIndex, accounts, name, onIndexChange) {
	return (
		<ListGroup.Item style={{ border: 'none', background: '#242030' }} key={itemKey}>
			<Row>
				<Col md={4}>
					<InputGroup.Text style={{ textAlign: 'left' }}>Balance: {accounts[addressIndex].balance}</InputGroup.Text>
				</Col>
				<Col md={2}>
					<InputGroup.Text style={{ textAlign: 'left' }}>Index: {addressIndex}</InputGroup.Text>
				</Col>
				<Col md={6}>
					<DropdownButton disabled={disabled} variant='outline-success' title={`${name} : ${accounts[addressIndex].address}`} >
						{accounts.map((account, index) => <Dropdown.Item
							key={index}
							eventKey={index}
							onSelect={(eventKey) => onIndexChange(itemKey, eventKey)}>{account.address}</Dropdown.Item>)}
					</DropdownButton>
				</Col>
			</Row>
		</ListGroup.Item>
	);
}

export default BitcoinTest;
