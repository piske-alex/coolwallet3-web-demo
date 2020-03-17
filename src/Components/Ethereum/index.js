import React, { useState } from 'react';
import {
  Row,
  Col,
  FormText,
  InputGroup,
  FormControl,
  Container,
  Form,
  Button,
} from 'react-bootstrap';
import Web3 from 'web3';
import GasMenu from './GasMenu';
import cwsETH from '@coolwallets/eth';

const chainId = 1;
const web3 = new Web3('https://mainnet.infura.io/v3/44fd23cda65746a699a5d3c0e2fa45d5');

function EthTest({ transport, appPrivateKey, appId }) {
  const ETH = new cwsETH(transport, appPrivateKey, appId);

  const [addressIndex, setAddressIndex] = useState(0);
  const [gasPrice, setGasPrice] = useState(10);
  const [balance, setBalance] = useState(0);

  // sign transaction
  const [address, setAddress] = useState('');
  const [to, setTo] = useState('0xeb919ADce5908185A6F6C860Ab42812e83ED355A'); // dai
  const [value, setValue] = useState('0');
  const [data, setData] = useState('0x00');
  const [txHash, setHash] = useState('');

  // Sign Message
  const [message, setMessage] = useState('');
  const [messageSignature, setMessageSignature] = useState('');

  // Loading status
  const [isGettingAddress, setIsGettingAddress] = useState(false);
  const [isSigningTransaction, setIsSigningTx] = useState(false);
  const [isSigningMessage, setIsSigningMsg] = useState(false);

  const getAddress = async () => {
    setIsGettingAddress(true);
    const addressIdx = parseInt(addressIndex);
    try {
      const address = await ETH.getAddress(addressIdx); //.then((address) => {
      setAddress(address);
      web3.eth.getBalance(address, 'pending', (err, balance) => {
        setBalance(web3.utils.fromWei(balance));
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsGettingAddress(false);
    }
  };

  const gasHandler = (gasPrice) => {
    const gasPriceInGWei = gasPrice / 10;
    setGasPrice(gasPriceInGWei);
  };

  const signTx = async () => {
    setIsSigningTx(true);
    // transfer dai
    // const data = '0xa9059cbb000000000000000000000000c94f3bebddfc0fd7eac7badb149fad2171b94b6900000000000000000000000000000000000000000000000000000000000003e8'

    try {
      const nonce = await web3.eth.getTransactionCount(address, 'pending'); // .then((nonce) => {

      let gasLimit;
      try {
        gasLimit = await web3.eth.estimateGas({ to, data }); //, (err, gasLimit) => {
      } catch (error) {
        gasLimit = 21000;
      }

      const gasLimitHex = web3.utils.toHex(gasLimit);
      const gasPriceHex = web3.utils.toHex(web3.utils.toWei(gasPrice.toString(), 'Gwei'));
      const param = {
        chainId,
        nonce: web3.utils.toHex(nonce),
        gasPrice: gasPriceHex,
        gasLimit: gasLimitHex,
        to,
        value: web3.utils.toHex(web3.utils.toWei(value.toString(), 'ether')),
        data,
        // tokenInfo: {
        //   symbol: 'DAI',
        //   decimals: 18,
        // },
      };

      const signedTx = await ETH.signTransaction(param, addressIndex); //.then((signedTx) => {

      web3.eth.sendSignedTransaction(signedTx, (err, txHash) => {
        if (err) {
          console.error(err);
        } else setHash(txHash);
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSigningTx(false);
    }
  };

  const signMessage = async (message) => {
    setIsSigningMsg(true);
    try {
      const addrIndex = 0;
      const signature = await ETH.signMessage(message, addrIndex);
      console.log(`Full Message Signature: ${signature}`)
      setMessageSignature(signature);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSigningMsg(false);
    }
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
              <Button
                disabled={isGettingAddress}
                variant='outline-success'
                compact='true'
                onClick={getAddress}
              >
                {isGettingAddress ? 'Loading...' : 'Get Address'}
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
      {/* Sign Test Transfer */}
      <h5>Sign Transaction</h5>
      <Row>
        <Col>
          <Form>
            <Form.Row>
              <Form.Group xs={4} as={Col} controlId='formGridTo'>
                <Form.Label>To</Form.Label>
                <Form.Control
                  value={to}
                  onChange={(event) => {
                    setTo(event.target.value);
                  }}
                  placeholder='0x...'
                />
              </Form.Group>

              <Form.Group xs={4} md={2} as={Col} controlId='Amount'>
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type='value'
                  value={value}
                  onChange={(event) => {
                    setValue(event.target.value);
                  }}
                  placeholder='Amount in Eth'
                />
              </Form.Group>
              <Form.Group xs={4} as={Col}>
                <Form.Label> Gas (Gwei) </Form.Label>
                <GasMenu handler={gasHandler}></GasMenu>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} xs={10}>
                <Form.Label>Data</Form.Label>
                <Form.Control
                  value={data}
                  onChange={(event) => {
                    setData(event.target.value);
                    // this.setState({ data:  })
                  }}
                  placeholder='0x...'
                />
              </Form.Group>
              <Form.Group as={Col} xs={2}>
                <Form.Label> Send </Form.Label>
                <Button disabled={isSigningTransaction} variant='outline-success' onClick={signTx}>
                  {isSigningTransaction ? 'Signing Tx...' : 'Sign & Send'}
                </Button>
              </Form.Group>
            </Form.Row>
          </Form>
        </Col>
      </Row>
      <Row style={{ paddingTop: 20 }}>
        <Col ms={12}>
          <p style={{ textAlign: 'left', fontSize: 20 }}> {txHash} </p>
        </Col>
      </Row>
      <h5>Sign Message</h5>
      <Row>
        <Col xs={4}>
          <FormControl
            value={message}
            placeholder='Message to sign'
            onChange={(event) => {
              setMessage(event.target.value);
            }}
          ></FormControl>
        </Col>
        <Col>
          <Button
            disabled={isSigningMessage}
            variant='outline-success'
            onClick={() => signMessage(message)}
          >
            {isSigningMessage ? 'Signing...' : 'Sign Message'}
          </Button>
        </Col>
        <Col>
          <p style={{ textAlign: 'left', fontSize: 20 }}> {
            messageSignature ? messageSignature.slice(0, 20) + '...' : ''
          } </p>
        </Col>
      </Row>
    </Container>
  );
}

export default EthTest;
