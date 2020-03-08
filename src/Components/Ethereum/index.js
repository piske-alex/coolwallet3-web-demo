import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormText from 'react-bootstrap/FormText';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Web3 from 'web3';
import GasMenu from './GasMenu';
import cwsETH from '@coolwallets/eth';

const chainId = 1;
const web3 = new Web3('https://mainnet.infura.io/v3/44fd23cda65746a699a5d3c0e2fa45d5');

function EthTest({ transport, appPrivateKey, appId }) {
  const ETH = new cwsETH(transport, appPrivateKey, appId);

  const [addressIndex, setAddressIndex] = useState(0);
  // const [gasLimit, setGasLimit] = useState(21000)
  const [gasPrice, setGasPrice] = useState(10);
  // const [nonce, setNonce] = useState(0)
  const [balance, setBalance] = useState(0);

  const [address, setAddress] = useState('');
  const [to, setTo] = useState('0x6b175474e89094c44da98b954eedeac495271d0f'); // dai
  const [value, setValue] = useState('0');
  const [data, setData] = useState('0x00');
  const [txHash, setHash] = useState('');

  const getAddress = () => {
    const addressIdx = parseInt(addressIndex);
    ETH.getAddress(addressIdx).then((address) => {
      setAddress(address);
      web3.eth.getBalance(address, 'pending', (err, balance) => {
        setBalance(web3.utils.fromWei(balance));
      });
    });
  };

  const gasHandler = (gasPrice) => {
    const gasPriceInGWei = gasPrice / 10;
    setGasPrice(gasPriceInGWei);
  };

  const signTx = () => {
    // transfer dai
    // const data = '0xa9059cbb000000000000000000000000c94f3bebddfc0fd7eac7badb149fad2171b94b6900000000000000000000000000000000000000000000000000000000000003e8'
    web3.eth.getTransactionCount(address, 'pending').then((nonce) => {
      // Get latest nonce
      web3.eth.estimateGas({ to, data }, (err, gasLimit) => {
        // Get gasLimit
        if (err) {
          console.error(`estimate gas failed`, err);
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
          tokenInfo: {
            symbol: 'DAI',
            decimals: 18,
          },
        };
        console.log(param);
        ETH.signTransaction(param, addressIndex).then((signedTx) => {
          console.log(signedTx);
          web3.eth.sendSignedTransaction(signedTx, (err, txHash) => {
            if (err) {
              console.error(err);
            } else setHash(txHash);
          });
        });
      });
    });
  };

  return (
    <Container style={{ textAlign: 'left' }}>
      <h4> Get Address</h4>
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
      {/* Sign Test Transfer */}
      <h4>Sign Transaction</h4>
      <Row>
        <Col>
          <Form>
            <Form.Row>
              <Form.Group as={Col} controlId='formGridTo'>
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
              <Form.Group as={Col}>
                <Form.Label> Gas (Gwei) </Form.Label>
                <GasMenu handler={gasHandler}></GasMenu>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col}>
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
            </Form.Row>

            <Button variant='outline-success' onClick={signTx}>
              Sign & Send
            </Button>
          </Form>
        </Col>
      </Row>
      <Row style={{ paddingTop: 20 }}>
        <Col ms={12}>
          <p style={{ textAlign: 'left', fontSize: 20 }}> Result: {txHash} </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            variant='outline-success'
            onClick={() => {
              const addrIndex = 0;
              const message = '436f6f6c57616c6c65744973436f6f6c';
              const publicKey =
                '033a057e1f19ea73423bd75f4d391dd28145636081bf0c2674f89fd6d04738f293';
              ETH.signMessage(message, addrIndex, publicKey).then((signature) => {
                console.log(`signature`, signature);
              });
            }}
          >
            {' '}
            SignMessage{' '}
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default EthTest;
