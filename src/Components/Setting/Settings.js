import React, { useState } from 'react';
import { Container, InputGroup, FormControl, Row, Col, Button } from 'react-bootstrap';
import { error as Error, apdu } from '@coolwallet/core';

function SettingPage({ appId, appPublicKey, appPrivateKey, transport }) {
  const [password, setPassword] = useState('12345678');
  const [deviceName, setDeviceName] = useState('Click Get Paired APP');
  const [newPassword, setNewPassword] = useState('')
  const [cardInfo, setCardInfo] = useState('')
  const [MCUStatus, setMCUStatus] = useState('')
  const [SEVersion, setSEVersion] = useState('')
  const [pairedAPPs, setPairedAPPs] = useState()
  const [pairedAPPID, setPairedAPPID] = useState()
  const [newDeviceName, setNewDeviceName] = useState('')
  const [AppletExist, setAppletExist] = useState('')

  const [isRevokingPassword, setIsRevokingPassword] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [isGettingCardInfo, isSettingCardInfo] = useState(false)
  const [isGettingMCUStatus, isSettingMCUStatus] = useState(false)
  const [isGettingSEVersion, isSettingSEVersion] = useState(false)
  const [isGettingPairedAPPs, isSettingPairedAPPs] = useState(false)
  const [isRemovePairedDevice, setRemovePairedDevice] = useState(false)
  const [isSwitchLockStatus, setSwitchLockStatus] = useState(false)
  const [isRenameDevice, setRenameDevice] = useState(false)
  const [isAppletExist, setIsAppletExist] = useState(false)

  const getPassword = async () => {
    setIsRevokingPassword(true)
    try {
      const newPassword = await apdu.pair.getPairingPassword(transport, appId, appPrivateKey); //.then((pwd) => {
      setNewPassword(newPassword)
    } catch (error) {
      console.error(error)
    } finally {
      setIsRevokingPassword(false)
    }
  };

  const registerWithCard = async (password) => {
    try {
      setIsRegistering(true)
      const name = 'TestAPP'
      const appId = await apdu.pair.register(transport, appPublicKey, password, name);
      setDeviceName(name)
      localStorage.setItem('appId', appId);
    } catch (error) {
      // TODO
      if (error instanceof Error.AlreadyRegistered) {
        console.log(`Already registered`);
      } else {
        console.error(error);
      }
    } finally {
      setIsRegistering(false)
    }
  };

  const resetCard = async () => {
    setIsResetting(true)
    try {
      await apdu.general.resetCard(transport);
    } catch (error) {
      console.error(error)
    } finally {
      setIsResetting(false)
    }

  }

  const getCardInfo = async () => {
    isSettingCardInfo(true)
    try {
      const data = await apdu.info.getCardInfo(transport);
      const cardInfo = `paired: ${data.paired}, locked: ${data.locked}, walletCreated: ${data.walletCreated},showDetail: ${data.showDetail}, pairRemainTimes: ${data.pairRemainTimes}`;
      setCardInfo(cardInfo)
    } catch (error) {
      console.error(error)
    } finally {
      isSettingCardInfo(false)
    }

  }

  const getMCUStatus = async () => {
    isSettingMCUStatus(true)
    try {
      const data = await apdu.mcu.dfu.getMCUVersion(transport)
      const cardInfo = `MCUStatus: ${data.fwStatus}, cardMCUVersion: ${data.cardMCUVersion}`;
      setMCUStatus(cardInfo)
    } catch (error) {
      console.error(error)
    } finally {
      isSettingMCUStatus(false)
    }

  }

  const getSEVersion = async () => {
    isSettingSEVersion(true)
    try {
      const data = await apdu.general.getSEVersion(transport)
      setSEVersion(data)
    } catch (error) {
      console.error(error)
    } finally {
      isSettingSEVersion(false)
    }

  }

  const getPairedApps = async () => {
    isSettingPairedAPPs(true)
    try {
      const data = await apdu.pair.getPairedApps(transport, appId, appPrivateKey)
      let dataStr = ''
      for (let index = 0; index < data.length; index++) {
        const pairedAppId = data[index].appId;
        const pairedAppName = data[index].appName;
        if (appId !== pairedAppId){
          if (dataStr) {
            dataStr = `${dataStr}, ${pairedAppName}: ${pairedAppId} `
          } else {
            dataStr = `${pairedAppName}: ${pairedAppId}`
          }
        }else {
          console.log(`${pairedAppName}: ${pairedAppId}`)
          setDeviceName(pairedAppName)
        }
      }
      setPairedAPPs(dataStr)
    } catch (error) {
      console.error(error)
    } finally {
      isSettingPairedAPPs(false)
    }
  }

  const removePairedDevice = async (pairedAPP) => {
    setRemovePairedDevice(true)
    try {
      console.log(pairedAPP)
      await apdu.pair.removePairedDevice(transport, appId, appPrivateKey, pairedAPP)
    } catch (error) {
      console.error(error)
    } finally {
      setRemovePairedDevice(false)
    }
  }

  const switchLockStatus = async () => {
    setSwitchLockStatus(true)
    try {
      await apdu.pair.switchLockStatus(transport, appId, appPrivateKey, true)
    } catch (error) {
      console.error(error)
    } finally {
      setSwitchLockStatus(false)
    }
  }

  const renameDevice = async (name) => {
    setRenameDevice(true)
    try {
      await apdu.pair.renameDevice(transport, appId, appPrivateKey, name)
    } catch (error) {
      console.error(error)
    } finally {
      setRenameDevice(false)
    }
  }

  const getApplet = async () => {
    setIsAppletExist(true)
    try {
      const result = await apdu.ota.selectApplet(transport);
      setAppletExist(`===>${result}`)
    } catch (error) {
      console.error(error)
    } finally {
      setIsAppletExist(false)
    }
  }

  
  return (
    <Container>
      <h4>Settings ({deviceName})</h4>
      <Row>
        <Col xs={3}>
          <Button
            block
            disabled={isResetting}
            variant='outline-danger'
            style={{ margin: 5 }}
            onClick={resetCard}
          >
            {isResetting ? 'Please Press Button...' : 'Reset Card'}
          </Button>
        </Col>
        <Col xs={4}>
          <InputGroup className='mb-3' style={{ margin: 5 }}>
            <FormControl
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              value={password}
              placeholder='pairing password'
            />
            <InputGroup.Append>
              <Button
                disabled={isRegistering}
                variant='outline-light'
                mode='contained'
                compact='true'
                onClick={() => {
                  registerWithCard(password);
                }}
              >
                {isRegistering ? 'Please Press Button...' : 'Register'}
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Col>

        <Col cs={3}>
          <Button
            disabled={isRevokingPassword}
            variant='outline-light'
            style={{ margin: 5 }}
            onClick={getPassword}>
            {isRevokingPassword ? 'Loading' : 'Get password'}
          </Button>
        </Col>
        <Col cs={1}>
          {newPassword}
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <Button
            disabled={isGettingMCUStatus}
            variant='outline-light'
            style={{ margin: 5 }}
            onClick={getMCUStatus}>
            {isGettingMCUStatus ? 'Loading' : 'Get FW Status'}
          </Button>
        </Col>
        <Col cs={3}>
          {MCUStatus}
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <Button
            disabled={isGettingSEVersion}
            variant='outline-light'
            style={{ margin: 5 }}
            onClick={getSEVersion}>
            {isGettingSEVersion ? 'Loading' : 'Get SE Version'}
          </Button>
        </Col>
        <Col cs={3}>
          {SEVersion}
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <Button
            disabled={isGettingCardInfo}
            variant='outline-light'
            style={{ margin: 5 }}
            onClick={getCardInfo}>
            {isGettingCardInfo ? 'Loading' : 'Get Card Info'}
          </Button>
        </Col>
        <Col cs={3}>
          {cardInfo}
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <Button
            disabled={isGettingPairedAPPs}
            variant='outline-light'
            style={{ margin: 5 }}
            onClick={getPairedApps}>
            {isGettingPairedAPPs ? 'Loading' : 'Get Paired APP'}
          </Button>
        </Col>
        <Col cs={1}>
          {pairedAPPs}
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <Button
            disabled={isRemovePairedDevice}
            variant='outline-light'
            mode='contained'
            compact='true'
            onClick={() => {
              removePairedDevice(pairedAPPID);
            }}
          >
            {isRemovePairedDevice ? 'Please Press Button...' : 'Remove Paired Device'}
          </Button>
        </Col>
        <Col>
          <InputGroup className='mb-3' style={{ margin: 5 }}>
            <FormControl
              onChange={(event) => {
                setPairedAPPID(event.target.value);
              }}
              value={pairedAPPID}
              placeholder='paired APP ID'
            />
          </InputGroup>
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <Button
            disabled={isSwitchLockStatus}
            variant='outline-light'
            style={{ margin: 5 }}
            onClick={switchLockStatus}>
            {isSwitchLockStatus ? 'Loading' : 'switch Lock Status'}
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <Button
            disabled={isRenameDevice}
            variant='outline-light'
            mode='contained'
            compact='true'
            onClick={() => {
              renameDevice(newDeviceName);
            }}
          >
            {isRenameDevice ? 'Loading' : 'Rename Device'}
          </Button>
        </Col>
        <Col>
          <InputGroup className='mb-3' style={{ margin: 5 }}>
            <FormControl
              onChange={(event) => {
                setNewDeviceName(event.target.value);
              }}
              value={newDeviceName}
              placeholder='New Device Name'
            />
          </InputGroup>
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <Button
            disabled={isAppletExist}
            variant='outline-light'
            style={{ margin: 5 }}
            onClick={getApplet}>
            {isAppletExist ? 'Loading' : 'Is Applet Exist'}
          </Button>
        </Col>
        <Col cs={3}>
          {AppletExist}
        </Col>
      </Row>
    </Container>
  );
}

export default SettingPage;
