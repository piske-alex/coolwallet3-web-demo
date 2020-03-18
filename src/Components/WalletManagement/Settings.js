import React, { useState } from 'react';
import { Container, InputGroup, FormControl, Row, Col, Button } from 'react-bootstrap';
import { AlreadyRegistered } from '@coolwallets/errors';

function SettingPage({ wallet, appPublicKey }) {
  const [password, setPassword] = useState('12345678');
  const [newPassword, setNewPassword] = useState('')

  const [isRevokingPassword, setIsRevokingPassword] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)

  const getPassword = async () => {
    setIsRevokingPassword(true)
    try {
      const newPassword = await wallet.getPairingPassword(); //.then((pwd) => {
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
      const appId = await wallet.register(appPublicKey, password, 'TestAPP');
      localStorage.setItem('appId', appId);
      wallet.setAppId(appId);
    } catch (error) {
      if (error instanceof AlreadyRegistered) {
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
      await wallet.resetCard();
    } catch(error) {
      console.error(error)
    } finally {
      setIsResetting(false)
    }
    
  }

  return (
    <Container>
      <h4>Settings</h4>
      <Row>
        <Col xs={3}>
          <Button
            block
            disabled={isResetting}
            variant='outline-danger'
            style={{ margin: 5 }}
            onClick={resetCard}
          >
            { isResetting ? 'Please Press Button...' : 'Reset Card'}
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
                { isRegistering? 'Please Press Button...' : 'Register'}
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
            { isRevokingPassword ? 'Loading' :'Get password'}
          </Button>
        </Col>
        <Col cs={3}>
          {newPassword}
        </Col>
      </Row>
    </Container>
  );
}

export default SettingPage;
