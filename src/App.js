import React, { useState, useEffect } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import WebBleTransport from '@coolwallets/transport-web-ble';

import { getAppKeysOrGenerate, getAppIdOrNull } from './Utils/sdkUtil';
import Routes from './Components/Routes'
import MyNavBar from './Components/NavBar';
import Connection from './Components/Connection';
import './App.css';

const { appPublicKey, appPrivateKey } = getAppKeysOrGenerate();
const appId = getAppIdOrNull();

function App() {
  const [transport, setTransport] = useState({});
  const [cardName, setCardName] = useState('');

  const connect = async () => {
    WebBleTransport.listen(async (error, device) => {
      if (device) {
				setCardName(device.name);
        const transport = await WebBleTransport.connect(device);
        setTransport(transport);
      } else throw error;
    });
  };

  const disconnect = () => {
    WebBleTransport.disconnect(transport.device.id);
    setTransport({});
		setCardName('');
  };

	const connectButton = () => (cardName)
    ? (<Button variant="outline-warning" style={{ margin: 5 }} onClick={disconnect}> Disconnect</Button>)
    : (<Button variant="light" style={{ margin: 5 }} onClick={connect}>Connect</Button>);
  
  return (
    <div className='App'>
      <Router>
        <Container>
					<Row>
						<Col>
							<MyNavBar/>
						</Col>
						{cardName}
						{connectButton()}
					</Row>
          <Row style={{ margin: '5%' }}>
            <Col>
              <h2 style={{ padding: 5 }}> </h2>
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
