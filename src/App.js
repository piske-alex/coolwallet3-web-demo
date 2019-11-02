import React from 'react';
import DeviceTest from './Components/DeviceTest'
import WalletTest from './Components/WalletTests'
import ETHTest from './Components/EthereumTest'
import WebBleTransport from '@coolwallets/transport-web-ble'
import { getAppKeysOrGenerate, getAppIdOrNull } from './Components/sdkUtil';


import { CWSDevice, CWSWallet } from '@coolwallets/sdk-core'
import cwsETH from '@coolwallets/eth'
import './App.css';

const { appPublicKey, appPrivateKey } = getAppKeysOrGenerate();
const appId = getAppIdOrNull()
const transport = new WebBleTransport()
const wallet = new CWSWallet(transport, appPrivateKey, appId)
const device =  new CWSDevice(transport, appPrivateKey, appId)
const ETH = new cwsETH(transport, appPrivateKey, appId)

function App() {
  return (
    <div className="App">
      <header className="App-header">
        
        <DeviceTest transport={transport} device={device} appPublicKey={appPublicKey} ></DeviceTest>
        <ETHTest ETH={ETH} ></ETHTest>
        <WalletTest wallet={wallet} ></WalletTest>
      </header>
    </div>
  );
}

export default App;
