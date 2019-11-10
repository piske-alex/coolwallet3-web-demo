import React from 'react'
import './App.css'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import Connection from './Components/Connection'
import Settings from './Components/Settings'
import WalletTest from './Components/WalletTests'
import ETHTest from './Components/EthereumTest'

import CoolWallet from '@coolwallets/wallet'
import cwsETH from '@coolwallets/eth'
import WebBleTransport from '@coolwallets/transport-web-ble';
import { getAppKeysOrGenerate, getAppIdOrNull } from './Utils/sdkUtil'

const { appPublicKey, appPrivateKey } = getAppKeysOrGenerate()
const appId = getAppIdOrNull()

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transport: {}
    }
  }

  connect = async () => {
    WebBleTransport.listen(async (error, device) => {
      if (device) {
        const transport = await WebBleTransport.connect(device);
        this.setState({
          transport
        });
        return transport;
      }
      throw error;
    });
  }

  disconnect = () => {
    const { transport } = this.state;
    WebBleTransport.disconnect(transport.device.id);
    this.setState({
      transport: {}
    });
  }

  render() {
    const { transport } = this.state;
    const wallet = new CoolWallet(transport, appPrivateKey, appId);
    const ETH = new cwsETH(transport, appPrivateKey, appId);
    return (
      <div className='App'>
        <header className='App-header'>
          <Container>
            <h3 style={{ padding: 20 }}> CoolWalletS x Web BLE </h3>
          </Container>
          <Container>
            <Row style={{ margin: 20 }}>
              <Col>
                <Connection connect={this.connect} disconnect={this.disconnect}></Connection>
              </Col>
              <Col>
                <Settings hardware={wallet} appPublicKey={appPublicKey}></Settings>
              </Col>
            </Row>
            <Row style={{ margin: 20 }}>
              <Col>
                <WalletTest wallet={wallet}></WalletTest>
              </Col>
            </Row>
            <Row style={{ margin: 20 }}>
              <Col>
                <ETHTest ETH={ETH}></ETHTest>
              </Col>
            </Row>
          </Container>
        </header>
      </div>
    )
  }
}