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
import MegaWallet from './mega.json'
import MultiInput from './mi.json'
import ERC20Contract from './ERC20.json';
import BigNumber from 'bignumber.js'

const chainId = 1;
const web3 = new Web3('https://ropsten.infura.io/v3/dd7e77cc740a4a32ab3c94d9a08b90ae');

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
  const [contractERC, setContractERC] = useState('');
  const [contractMega, setContractMega] = useState('');
  const [contractMI, setContractMI] = useState('');
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

  const calculateInputs = async (amount) => {
    const mega = new web3.eth.Contract(MegaWallet, contractMega)
    const erc20 = new web3.eth.Contract(ERC20Contract, contractERC)
    const addresses = await mega.methods.getWallets().call()
    const inputsAddr = []
    const inputsBal = []
    const balances = {
      data: await Promise.all(addresses.map(async (address) => {
        const balance = (await erc20.methods.balanceOf(address).call()).toString()
        return {address, balance}
      }))
    }
    balances.data = balances.data.sort((a, b) => {
      if (new BigNumber(a.balance).gt(new BigNumber(b.balance))) return -1
      else if (new BigNumber(a.balance).lt(new BigNumber(b.balance))) return 1
      else if (new BigNumber(a.balance).eq(new BigNumber(b.balance))) return 0
    })
    if (balances.data.length === 0) {
      alert('balances not update')
      return
    }
    while (!new BigNumber(amount).lte(new BigNumber(0))) {
      let count = 0
      console.log(`amount now ${amount.toString()}`)
      for (const bal of balances.data) {
        // if(addresses.includes(bal.address)){
        if (new BigNumber(bal.balance).lte(new BigNumber(amount))) {
          inputsAddr.push(bal.address)
          inputsBal.push(bal.balance)
          amount = new BigNumber(amount).minus(new BigNumber(bal.balance))
          balances.data.splice(count, 1)
          console.log(JSON.stringify(balances.data))
          break
        } else if (count === balances.data.length - 1) {
          inputsAddr.push(balances.data[0].address)
          inputsBal.push(new BigNumber(amount).toString())
          amount = 0
        }
        count++
        if (count > 10000) throw 'I am wrong'
        // }
      }
    }

    console.log(inputsAddr)
    console.log(inputsBal)
    return { inputsAddr, inputsBal }
  }

  const signTx = async () => {
    setIsSigningTx(true);
    const mi = new web3.eth.Contract(MultiInput, contractMI)
    const preTx = await calculateInputs(value)
    const data = await mi.methods.legacyTransfer(contractMega, contractERC, preTx.inputsAddr, to, preTx.inputsBal).encodeAbi()

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
        contractMI,
        value: 0,
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
      const signature = await ETH.signMessage(message, addressIndex);
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
      <h4> Get Address</h4>
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
      <h4>Sign Transaction</h4>
      <Row>
        <Col>
          <Form>
            <Form.Row>
              <Form.Group xs={4} as={Col} controlId='formGridTo'>
                <Form.Label style={{fontSize: 20}}>To</Form.Label>
                <Form.Control
                  value={to}
                  onChange={(event) => {
                    setTo(event.target.value);
                  }}
                  placeholder='0x...'
                />
              </Form.Group>

              <Form.Group xs={4} md={2} as={Col} controlId='Amount'>
                <Form.Label style={{fontSize: 20}}>Amount</Form.Label>
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
                <Form.Label style={{fontSize: 20}}> Gas (Gwei) </Form.Label>
                <GasMenu handler={gasHandler}></GasMenu>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} xs={10}>
                <Form.Label style={{fontSize: 20}}>Data</Form.Label>
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
                <Form.Label style={{fontSize: 20}}> Send </Form.Label>
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
      <h4>Sign Message</h4>
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
