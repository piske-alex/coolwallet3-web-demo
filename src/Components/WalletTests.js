import React, { useState } from 'react';
import { InputGroup, FormControl, Button, Row, Container, Col } from 'react-bootstrap';
import CoolWallet from '@coolwallets/wallet';

import Settings from './Settings';

const bip39 = require('bip39');

function Wallet({ appPrivateKey, appPublicKey, appId, transport }) {
  const wallet = new CoolWallet(transport, appPrivateKey, appId);

  const [isSettingSeed, setIsSettingSeed] = useState(false);
  const [isCheckingSum, setIsCheckingSum] = useState(false);

  const [mnemonic, setMnemonic] = useState('');
  const [sumOfSeed, setSumOfSeed] = useState(0);

  const setSeed = async() => {
    setIsSettingSeed(true)
    console.log(`setting seed ${mnemonic}`);
    const hex = bip39.mnemonicToSeedSync(mnemonic).toString('hex'); // ''
    try {
      await wallet.setSeed(hex)
    } catch(error){
      console.error(error)
    } finally {
      setIsSettingSeed(false)
    }
  };

  const createWallet = async() => {
    await wallet.createWallet(12);
  };

  const sendCheckSum = async () => {
    setIsCheckingSum(true)
    const sum = parseInt(sumOfSeed);
    try {
      await wallet.sendCheckSum(sum)
    } catch(error) {
      console.error(error)
    } finally {
      setIsCheckingSum(false)
    }
  };

  return (
    <Container>
      <h4> Create Wallet </h4>
      <Row>
        <Col>
          <InputGroup className='mb-3'>
            <FormControl
              onChange={(event) => {
                setMnemonic(event.target.value);
              }}
              value={mnemonic}
              placeholder='Mnemonic'
              aria-describedby='basic-addon2'
            />
            <InputGroup.Append>
              <Button 
                disabled={isSettingSeed}
                variant='outline-light' 
                mode='contained' 
                compact='true' onClick={setSeed}>
                { isSettingSeed ? 'Loading...' : 'Set Seed'}
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <Button
            block
            variant='outline-light'
            mode='contained'
            compact='true'
            onClick={createWallet}
          >
            Create Wallet By Card
          </Button>
        </Col>
        <Col>
          <InputGroup className='mb-3'>
            <FormControl
              onChange={(event) => {
                setSumOfSeed(event.target.value);
              }}
              value={sumOfSeed}
              placeholder='Sum Of Seed'
              aria-describedby='basic-addon2'
            />
            <InputGroup.Append>
              <Button
                disabled={isCheckingSum}
                variant='outline-light'
                mode='contained'
                compact='true'
                onClick={sendCheckSum}
              >
                { isCheckingSum ? 'Verifying...' : 'Check Sum'}
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Col>
      </Row>
      {/* Settings  */}
      <Row>
        <Settings wallet={wallet} appPublicKey={appPublicKey} />
      </Row>
    </Container>
  );
}

export default Wallet;
