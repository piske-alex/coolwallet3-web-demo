import React, { useState } from 'react';
import { InputGroup, FormControl, Button, Row, Container, Col } from 'react-bootstrap';
import { apdu } from '@coolwallet/core';

function Wallet({ appId, appPublicKey, appPrivateKey, transport }) {

  const [isSettingSeedByCreate, setIsSettingSeedByCreate] = useState(false);
  const [isSettingSeedByRecover, setIsSettingSeedByRecover] = useState(false);
  const [isCheckingSum, setIsCheckingSum] = useState(false);

  const [recoverMnemonic, setRecoverMnemonic] = useState('');
  const [createMnemonic, setCreateMnemonic] = useState('');
  const [sumOfSeed, setSumOfSeed] = useState('');

  const [numOfSettingIndex, setNumOfSettingIndex] = useState(1);

  const setSeed = async (event) => {
    const method = event.target.getAttribute('method')
    let mnemonic;
    switch (method) {
      case 'create':
        mnemonic = createMnemonic;
        setIsSettingSeedByCreate(true)
        break;
      case 'recover':
        mnemonic = recoverMnemonic;
        setIsSettingSeedByRecover(true)
        break;
      default:
        alert(`wallet method ${method} is not exist`)
        mnemonic = ''
        return
    }
    console.log(`${method} setting seed: ${mnemonic}`);
    console.log(mnemonic)
    try {
      await apdu.wallet.setSeed(transport, appId, appPrivateKey, mnemonic)
    } catch(error){
      console.error(error)
    } finally {
      setIsSettingSeedByRecover(false)
      setIsSettingSeedByCreate(false)
    }
  };

  const createWallet = async() => {
    try {
      await apdu.wallet.createSeedByCard(transport, appId, appPrivateKey, 12);
    } catch (error) {
      console.error(error)
    }
  };

  const createSeedByApp = async () => {

    const crypto = require('crypto');
    const seedStrPromise = apdu.util.createSeedByApp(12, crypto.randomBytes)
    
    seedStrPromise.then(function (result) {
        setCreateMnemonic(result)
      }, function (err) {
        console.log(err);
      });

  };

  const sendCheckSum = async () => {
    setIsCheckingSum(true)
    const sum = parseInt(sumOfSeed);
    try {
      await apdu.wallet.sendCheckSum(transport, sum)
    } catch(error) {
      console.error(error)
    } finally {
      setIsCheckingSum(false)
    }
  };

  const initSecureRecovery = async () => {
    let num = 12;
    try {
      const status = await apdu.wallet.initSecureRecovery(transport, num)
      console.log(`initSecureRecovery status : ${status}`)
    } catch (error) {
      console.error(error)
    }
  }

  const setSecureRecveryIdx = async (event) => {
    const recoverIndex = event.target.getAttribute('recover-index')

    console.log(numOfSettingIndex)

    try {
      const status = await apdu.wallet.setSecureRecoveryIdx(transport, recoverIndex)
      console.log(`setSecureRecveryIdx status : ${status}`)
      if (numOfSettingIndex >= 5){
        alert(`check your card!!!`)

        try {
          console.log(await apdu.wallet.getSecureRecoveryStatus(transport))
        } catch (error) {
          console.log(error)
        }
        
        setNumOfSettingIndex(1)
      } else {
        setNumOfSettingIndex(numOfSettingIndex + 1)
      }
    } catch (error) {
      console.error(error)
    }
  };

  const getSecureRecveryIdxButtons = (row, col) => {
    const array = []

    for (var i = 1; i <= col; i++) {
      const recoverIndex = (i-1) + (row-1) * 5
      array.push(<Button
        // block
        key={i}
        variant='outline-light'
        mode='contained'
        compact='true'
        recover-index={recoverIndex}
        onClick={setSecureRecveryIdx}
      >
        *
          </Button>)
    }

    return array
  };
  
  const cancelSecureRecovery = async (event) => {
    const cancelType = event.target.getAttribute('cancel-type')
    console.log(cancelType)
    try{
      await apdu.wallet.cancelSecureRecovery(transport, cancelType)
      setNumOfSettingIndex(1)
    } catch (error) {
      console.error(error)
    }
  }




  return (
    <Container>
      <h4> Recover Wallet </h4>
      <Row>
        <Col xs={3}>
          <Button
            block
            disabled={isSettingSeedByRecover}
            variant='outline-light'
            mode='contained'
            compact='true'
            method='recover'
            onClick={setSeed}
          >
            {isSettingSeedByRecover ? 'Loading...' : 'Basic Recover'}
          </Button>
        </Col>
        <Col>
          <InputGroup className='mb-3'>
            <FormControl
              onChange={(event) => {
                setRecoverMnemonic(event.target.value);
              }}
              value={recoverMnemonic}
              placeholder='Mnemonic'
              aria-describedby='basic-addon2'
            />
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
            onClick={initSecureRecovery}
          >
            Advance Recover
          </Button>
        </Col>
        <Col xs={3}>
          <div>
            {getSecureRecveryIdxButtons(1, 5)}
          </div>
          <div>
            {getSecureRecveryIdxButtons(2, 5)}
          </div>
        </Col>
        <Col xs={4}>
          <Button
            variant='outline-light'
            mode='contained'
            compact='true'
            cancel-type='00'
            onClick={cancelSecureRecovery}
          >
            {isCheckingSum ? 'Verifying...' : 'Restart this Round'}
          </Button>
          <Button
            variant='outline-light'
            mode='contained'
            compact='true'
            cancel-type='01'
            onClick={cancelSecureRecovery}
          >
            {isCheckingSum ? 'Verifying...' : 'Cancel Advanced Wallet Recovery'}
          </Button>
        </Col>
      </Row>

      <h4> Create Wallet </h4>
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
      <Row>
        <Col xs={3}>
          <Button
            block
            variant='outline-light'
            mode='contained'
            compact='true'
            onClick={createSeedByApp}
          >
            Create Wallet By App
          </Button>
        </Col>
        <Col>
          <InputGroup className='mb-3'>
            <FormControl
              onChange={(event) => {
                setCreateMnemonic(event.target.value);
              }}
              value={createMnemonic}
              placeholder='Mnemonic'
              aria-describedby='basic-addon2'
            />
            <InputGroup.Append>
              <Button 
                disabled={isSettingSeedByCreate}
                variant='outline-light' 
                mode='contained' 
                method='create'
                compact='true' onClick={setSeed}>
                { isSettingSeedByCreate ? 'Loading...' : 'Set Seed'}
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Col>
      </Row>
    </Container>
  );
}

export default Wallet;
