import BigNumber from 'bignumber.js';
import React, { useState } from 'react';
import { Container, Button, Row, Col, InputGroup, FormControl, ListGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import cwsBTC from '@coolwallets/btc';
import { getFeeRate, getBalances, getUtxos, sendTx } from './api';
import { coinSelect } from './utils';

let BTC;
let ScriptType;

function BitcoinTest({ transport, appPrivateKey, appId }) {
	if (!BTC && transport && appPrivateKey && appId) {
		console.log('transport :', transport);
		console.log('appPrivateKey :', appPrivateKey);
		console.log('appId :', appId);

		BTC = new cwsBTC(transport, appPrivateKey, appId);
		ScriptType = BTC.ScriptType.P2SH_P2WPKH;
		updateAccounts(10);
	}

	const disabled = !BTC;

  const [accounts, setAccounts] = useState([{ address: '', balance: '', utxos: [] }]);
  const [fromAddressIndices, setFromAddressIndices] = useState([0]);
	const [changeAddressIndex, setChangeAddressIndex] = useState(0);
	const [toAddress, setToAddress] = useState('');
	const [value, setValue] = useState('');
	const [feeRate, setFeeRate] = useState(0);
	const [isSigning, setIsSigning] = useState(false);
	const [tx, setTx] = useState('');
	const [isSending, setIsSending] = useState(false);

  async function updateAccounts(maxAddrIndex) {
		try {
			const addresses = [];
			const outScripts = [];
			for (let index=0; index < maxAddrIndex; index++) {
				const { address, outScript } = await BTC.getAddressAndOutScript(ScriptType, index);
				addresses.push(address);
				outScripts.push(outScript.toString('hex'));
			}
			const balances = await getBalances(addresses);
			const allUtxos = await getUtxos(addresses, outScripts);
			const newAccounts = addresses.map((address, i) => {
				const balance = balances[i];
				const utxos = allUtxos[i] ? allUtxos[i] : [];
				return { address, balance, utxos };
			});
			setAccounts(newAccounts);
			console.log('newAccounts :', newAccounts);

			setFromAddressIndices([0, 1, 2]);

			const feeRate = await getFeeRate();
			console.log('feeRate :', feeRate, typeof feeRate);
			setFeeRate(feeRate);

		} catch (error) {
			console.log('error :', error);
		}
  };

	const onFromIndexChange = (itemIndex, addressIndex) => {
		const copyIndices = [...fromAddressIndices];
		copyIndices[itemIndex] = addressIndex ? addressIndex : 0;
		setFromAddressIndices(copyIndices);
	};

	const onChangeIndexChange = (itemIndex, addressIndex) => {
		setChangeAddressIndex(addressIndex);
	};

	const onToAddressChange = (to) => {
		setToAddress(to);
	};

	const onValueChange = (v) => {
		setValue(v);
	};

	const onFeeRateChange = (rate) => {
		setFeeRate(rate);
	};

	const onTxChange = (tx) => {
		setTx(tx);
	};

	const signTransaction = async () => {
		console.log('fromAddressIndices :', fromAddressIndices);
		console.log('changeAddressIndex :', changeAddressIndex);

		setIsSigning(true);
		console.log('signing ...');
		try {
			if (isNaN(parseFloat(value))) throw new Error('value should be number');

			const fromIndices = new Set(fromAddressIndices);
			let utxos = [];
			for (let fromIndex of fromIndices) {
				utxos = utxos.concat(accounts[fromIndex].utxos);
			}
			console.log('utxos :', utxos);

			const output = {
				value: (new BigNumber(value)).shiftedBy(8).toFixed(),
				address: toAddress,
			};
			console.log('output :', output);
			const outputScriptType = BTC.addressToOutScript(toAddress).scriptType;

			const { inputs, change, fee } = coinSelect(utxos, ScriptType, output, outputScriptType, changeAddressIndex, feeRate);
			console.log('inputs :', inputs);
			console.log('change :', change);
			console.log('fee :', fee);

			const transaction = await BTC.signTransaction(ScriptType, inputs, output, change);
			console.log('transaction :', transaction);

			setTx(transaction);

		} catch (error) {
			console.log('error :', error);
		}
		setIsSigning(false);
	};

	const sendTransaction = async () => {
		console.log('sending tx :', tx);

		setIsSending(true);
		console.log('sending ...');
		const result = await sendTx(tx);
		console.log('result :', result);
		setIsSending(false);
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
							<Col md={6}>
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
							<Col md={2}>
								<InputGroup>
									<InputGroup.Prepend>
										<InputGroup.Text id="basic-addon1">Value</InputGroup.Text>
									</InputGroup.Prepend>
								  <FormControl
										disabled={disabled}
								    onChange={(event) => onValueChange(event.target.value)}
								    value={value}
								    placeholder="0"
								    aria-describedby='basic-addon1'
								  />
								</InputGroup>
							</Col>
							<Col md={2}>
								<InputGroup>
									<InputGroup.Prepend>
										<InputGroup.Text id="basic-addon1">FeeRate</InputGroup.Text>
									</InputGroup.Prepend>
								  <FormControl
										disabled={disabled}
								    onChange={(event) => onFeeRateChange(event.target.value)}
								    value={feeRate}
								    placeholder="0"
								    aria-describedby='basic-addon1'
								  />
								</InputGroup>
							</Col>
							<Col md={2}>
								<Button disabled={(disabled || isSigning)} variant='outline-success' onClick={signTransaction}>
									{isSigning ? 'Signing ...' : 'Sign Transaction'}
								</Button>
							</Col>
						</Row>

					</Col>
				</Row>
			</div>
			<br/>

      <h5>Send Transaction</h5>
			<div style={{ background: '#242030' }}>
				<Row style={{ padding: '20px' }}>
					<Col md={10}>
						<InputGroup>
							<InputGroup.Prepend>
								<InputGroup.Text id="basic-addon1">To</InputGroup.Text>
							</InputGroup.Prepend>
						  <FormControl
								disabled={disabled}
						    onChange={(event) => onTxChange(event.target.value)}
						    value={tx}
						    placeholder="Signed Transaction"
						    aria-describedby='basic-addon1'
						  />
						</InputGroup>
					</Col>
					<Col md={2}>
						<Button disabled={(disabled || isSending)} variant='outline-success' onClick={sendTransaction}>
							{isSending ? 'Sending ...' : 'Send Transaction'}
						</Button>
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
							onSelect={(eventKey) => onIndexChange(itemKey, parseInt(eventKey))}>{account.address}</Dropdown.Item>)}
					</DropdownButton>
				</Col>
			</Row>
		</ListGroup.Item>
	);
}

export default BitcoinTest;
