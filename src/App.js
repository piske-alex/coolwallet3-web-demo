import React, { useState } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import './App.css';
import Container from 'react-bootstrap/Container';
import { Row, Col } from 'react-bootstrap';

import MyNavBar from './Components/NavBar';
import Connection from './Components/Connection';

import Routes from './Components/Routes'


import WebBleTransport from '@coolwallets/transport-web-ble';
import { getAppKeysOrGenerate, getAppIdOrNull } from './Utils/sdkUtil';

const { appPublicKey, appPrivateKey } = getAppKeysOrGenerate();
const appId = getAppIdOrNull();

function App() {
  const [transport, setTransport] = useState({});

  const connect = async () => {
    WebBleTransport.listen(async (error, device) => {
      if (device) {
        const transport = await WebBleTransport.connect(device);
        setTransport(transport);
      } else throw error;
    });
  };

  const disconnect = () => {
    WebBleTransport.disconnect(transport.device.id);
    setTransport({});
  };

  return (
    <div className='App'>
      <Router>
        <MyNavBar />
        <Container className='App-header'>
          <Row style={{ margin: 5 }}>
            <Col>
              <h4 style={{ padding: 5 }}> CoolWalletS SDK Test </h4>
            </Col>
            <Col>
              <Connection connect={connect} disconnect={disconnect}></Connection>
            </Col>
          </Row>
        </Container>
        <Routes
          transport={transport}
          appId={appId}
          appPrivateKey={appPrivateKey}
          appPublicKey={appPublicKey}
        />
      </Router>
    </div>
  );
}

export default App;
