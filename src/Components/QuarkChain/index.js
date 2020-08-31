import React, { useState } from "react";
import {
  Row,
  Col,
  FormText,
  InputGroup,
  FormControl,
  Container,
  Form,
  Button,
} from "react-bootstrap";
import BigNumber from 'bignumber.js';
import GasMenu from "./GasMenu";
import cwsQKC from "@coolwallet/qkc";

// const testnet = 'http://jrpc.devnet.quarkchain.io:38391';
const mainnet = 'http://jrpc.mainnet.quarkchain.io:38391';
const usedNet = mainnet;

const request = async (method, params) => {
	const res = await fetch(usedNet, {
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		},
		method: 'POST',
		body: JSON.stringify({
			jsonrpc: '2.0',
			method,
			params,
			id: 1,
		}),
	});
	const response = await res.json();
	return response.result;
};

/**
 *
*/
async function getNetworkInfo() {
	const networkInfo = await request('networkInfo');
	console.log('networkInfo :', networkInfo);
	return networkInfo;
}

/**
 * @param {string} address
*/
async function getTransactionCount(address) {
	const nonce = await request('getTransactionCount', [address]);
	console.log('nonce :', nonce);
	return nonce;
}

/**
 * @param {string} address
*/
async function getBalance(address) {
	const result = await request('getBalances', [address]);
	// console.log('result :', result);
	for (let b of result.balances) {
		if (b.tokenId === '0x8bb0') {
			let balance = b.balance;
			balance = BigNumber(balance, 16).shiftedBy(-18).toFixed();
			console.log('balance :', balance, 'QKC');
			return balance;
		}
	}
}

/**
 * @param {string} address
*/
async function getAccountData(address) {
	const accountData = await request('getAccountData', [address, 'latest', true]);
	console.log('accountData :', accountData);
	return accountData;
}

/**
 * @param {string} from
 * @param {string} to
 * @param {string} value
 * @param {string} data
*/
async function estimateGas(from, to, value, data) {
	console.log('from :', from);
	console.log('to :', to);
	console.log('value :', value);
	console.log('data :', data);
	console.log('estimateGas start');
	if (!value) value = '0x';
	if (!data) data = '0x';
	const estimatedGas = await request('estimateGas', [{from, to, value, data}]);
	console.log('estimatedGas :', BigNumber(estimatedGas, 16).toFixed());
	return estimatedGas;
}

/**
 * @param {string} shardKey
*/
async function getGasPrice(shardKey) {
	return await request('gasPrice', [shardKey, '0x8bb0']);
}

function QKCTest({ transport, appPrivateKey, appId }) {
  const QKC = new cwsQKC();

  const [addressIndex, setAddressIndex] = useState(0);
  const [gasPrice, setGasPrice] = useState(0);
  const [balance, setBalance] = useState(0);

  // sign transaction
  const [address, setAddress] = useState("");
  const [to, setTo] = useState("0x6f25509095c18cfa232027e8d9f06bf4444b878100000000");
  const [amount, setAmount] = useState("0");
  const [data, setData] = useState("0x");
  const [txHash, setHash] = useState("");

  // Sign Message
  const [message, setMessage] = useState("");
  const [messageSignature, setMessageSignature] = useState("");

  // Loading status
  const [isGettingAddress, setIsGettingAddress] = useState(false);
  const [isSigningTransaction, setIsSigningTx] = useState(false);
  const [isSigningMessage, setIsSigningMsg] = useState(false);

  const getAddress = async () => {
    setIsGettingAddress(true);
    const addressIdx = parseInt(addressIndex);
    try {
			console.log('transport :', transport);
			console.log('appPrivateKey :', appPrivateKey, typeof appPrivateKey);
			console.log('appId :', appId, typeof appId);
      let address = await QKC.getAddress(transport, appPrivateKey, appId, addressIdx);
			address = address + '00000000';
      setAddress(address);
      const balance = await getBalance(address);
      setBalance(balance);

    } catch (error) {
      console.error(error);
    } finally {
      setIsGettingAddress(false);
    }
  };

  const signTx = async () => {
    setIsSigningTx(true);
    // transfer dai
    // const data = '0xa9059cbb000000000000000000000000c94f3bebddfc0fd7eac7badb149fad2171b94b6900000000000000000000000000000000000000000000000000000000000003e8'

    try {
			const fromFullShardKey 	= `0x${address.slice(-8)}`;
      const nonce = await getTransactionCount(address, "pending");
			const value = '0x' + BigNumber(amount, 10).shiftedBy(18).toString(16);
      const gasLimit = await estimateGas(address, to, value, data);
      const gasPrice = await getGasPrice(fromFullShardKey);
			setGasPrice(gasPrice);

      const param = {
        chainId: '',
        nonce,
        gasPrice,
        gasLimit,
        to: to.slice(0, -8),
        value,
        data,
				fromFullShardKey,
				toFullShardKey: `0x${to.slice(-8)}`,
      };
      const signedTx = await QKC.signTransaction(transport, appPrivateKey, appId, param, addressIndex);
      console.log("signedTx: " + signedTx)

    } catch (error) {
      console.error(error);
    } finally {
      setIsSigningTx(false);
    }
  };

  return (
    <Container style={{ textAlign: "left" }}>
      <h4> Get Address</h4>
      <Row>
        <Col xs={3}>
          <InputGroup className="mb-3">
            <FormControl
              onChange={(event) => {
                setAddressIndex(parseInt(event.target.value));
              }}
              value={addressIndex}
              placeholder="Index"
              aria-describedby="basic-addon2"
            />
            <InputGroup.Append>
              <Button
                disabled={isGettingAddress}
                variant="outline-success"
                compact="true"
                onClick={getAddress}
              >
                {isGettingAddress ? "Loading..." : "Get Address"}
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Col>
        <Col>
          <FormText style={{ textAlign: "left" }}> From {address} </FormText>
          <FormText style={{ textAlign: "left" }}>
            {" "}
            Balance: {balance}{" "}
          </FormText>
        </Col>
      </Row>
      <br></br>
      {/* Sign Test Transfer */}
      <h4>Sign Transaction</h4>
      <Row>
        <Col>
          <Form>
            <Form.Row>
              <Form.Group xs={4} as={Col} controlId="formGridTo">
                <Form.Label style={{ fontSize: 20 }}>To</Form.Label>
                <Form.Control
                  value={to}
                  onChange={(event) => {
                    setTo(event.target.value);
                  }}
                  placeholder="0x..."
                />
              </Form.Group>

              <Form.Group xs={4} md={2} as={Col} controlId="Amount">
                <Form.Label style={{ fontSize: 20 }}>Amount</Form.Label>
                <Form.Control
                  type="value"
                  value={amount}
                  onChange={(event) => {
                    setAmount(event.target.value);
                  }}
                  placeholder="Amount in Eth"
                />
              </Form.Group>
              <Form.Group xs={4} as={Col}>
                <Form.Label style={{ fontSize: 20 }}> Gas (Gwei) </Form.Label>
			          <FormText style={{ textAlign: "left" }}> {`${BigNumber(gasPrice, 16).shiftedBy(-18).toFixed()} QKC`} </FormText>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} xs={10}>
                <Form.Label style={{ fontSize: 20 }}>Data</Form.Label>
                <Form.Control
                  value={data}
                  onChange={(event) => {
                    setData(event.target.value);
                  }}
                  placeholder="0x..."
                />
              </Form.Group>
              <Form.Group as={Col} xs={2}>
                <Form.Label style={{ fontSize: 20 }}> Send </Form.Label>
                <Button
                  disabled={isSigningTransaction}
                  variant="outline-success"
                  onClick={signTx}
                >
                  {isSigningTransaction ? "Signing Tx..." : "Sign & Send"}
                </Button>
              </Form.Group>
            </Form.Row>
          </Form>
        </Col>
      </Row>
      <Row style={{ paddingTop: 20 }}>
        <Col ms={12}>
          <p style={{ textAlign: "left", fontSize: 20 }}> {txHash} </p>
        </Col>
      </Row>
    </Container>
  );
}

export default QKCTest;