import React, { useState } from 'react';
import { InputGroup, FormControl, Button, Row, Container } from 'react-bootstrap';
import CoolWallet from '@coolwallets/wallet';

import Settings from './Settings';

const bip39 = require('bip39');

function Wallet({ appPrivateKey, appPublicKey, appId, transport }) {
  const wallet = new CoolWallet(transport, appPrivateKey, appId);

  const [mnemonic, setMnemonic] = useState(
    ''
  );
  const [sumOfSeed, setSumOfSeed] = useState(0);

  const setSeed = () => {
    console.log(`setting seed ${mnemonic}`);
    const hex = bip39.mnemonicToSeedSync(mnemonic).toString('hex'); // '' 
    wallet
      .setSeed(hex)
      .then(() => {
        console.log(`Set seed success!`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createWallet = () => {
    wallet.createWallet(12).catch((error) => {
      console.error(error);
    });
  };

  const sendCheckSum = () => {
    const sum = parseInt(sumOfSeed);
    console.log(`sum ${sum}, type ${typeof sum}`);
    wallet
      .sendCheckSum(sum)
      .then((result) => {
        console.log(`send checksum success`);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Container>
      <h4> Create Wallet </h4>
      <Row>
        <InputGroup className='mb-3' style={{ margin: 5 }}>
          <FormControl
            onChange={(event) => {
              setMnemonic(event.target.value);
            }}
            value={mnemonic}
            placeholder='Mnemonic'
            aria-describedby='basic-addon2'
          />
          <InputGroup.Append>
            <Button variant='outline-light' mode='contained' compact='true' onClick={setSeed}>
              Set Seed
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </Row>
      <Row>
        <InputGroup className='mb-3' style={{ margin: 5 }}>
          <Button variant='outline-light' mode='contained' compact='true' onClick={createWallet}>
            Create Wallet By Card
          </Button>
          <FormControl
            onChange={(event) => {
              setSumOfSeed(event.target.value);
            }}
            value={sumOfSeed}
            placeholder='Sum Of Seed'
            aria-describedby='basic-addon2'
          />
          <InputGroup.Append>
            <Button variant='outline-light' mode='contained' compact='true' onClick={sendCheckSum}>
              Check Sum
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </Row>
      {/* Settings  */}
      <Row>
        <Settings wallet={wallet} appPublicKey={appPublicKey} />
      </Row>
    </Container>
  );
}

export default Wallet;
