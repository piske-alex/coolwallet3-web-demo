import React from 'react'
import Connection from './Components/Connection'
import DeviceTest from './Components/DeviceTest'
import WalletTest from './Components/WalletTests'
import ETHTest from './Components/EthereumTest'
import WebBleTransport from '@coolwallets/transport-web-ble'
import { getAppKeysOrGenerate, getAppIdOrNull } from './Utils/sdkUtil'

import { CWSDevice, CWSWallet } from '@coolwallets/sdk-core'
import cwsETH from '@coolwallets/eth'
import './App.css'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const { appPublicKey, appPrivateKey } = getAppKeysOrGenerate()
const appId = getAppIdOrNull()
const transport = new WebBleTransport()
const wallet = new CWSWallet(transport, appPrivateKey, appId)
const device = new CWSDevice(transport, appPrivateKey, appId)
const ETH = new cwsETH(transport, appPrivateKey, appId)

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <Container>
          <h3 style={{ padding: 20 }}> CoolWalletS x Web BLE </h3>
        </Container>
        <Container>
          <Row style={{ margin: 20 }}>
            <Col>
              <Connection transport={transport}></Connection>
            </Col>
            <Col>
              <DeviceTest device={device} appPublicKey={appPublicKey}></DeviceTest>
            </Col>
          </Row>
          <Row style={{ margin: 20 }}>
            <Col>
              <WalletTest wallet={wallet}></WalletTest>
            </Col>
            <Col>
              <ETHTest ETH={ETH}></ETHTest>
            </Col>
          </Row>
        </Container>
      </header>
    </div>
  )
}

export default App
