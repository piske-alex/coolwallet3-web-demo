import React from 'react';
import { HashRouter as Switch, Route } from 'react-router-dom';
import WalletTest from './WalletTests';
import ETHTest from './Ethereum';
// import BitcoinTest from './Bitcoin/index'

function Routes({ appPublicKey, appPrivateKey, transport, appId }) {
  return (
    <Switch>
      <Route
        path='/wallet/'
        children={
          <WalletTest
            transport={transport}
            appPrivateKey={appPrivateKey}
            appPublicKey={appPublicKey}
            appId={appId}
          />
        }
        appId={appId}
      />
      <Route
        path='/eth'
        children={<ETHTest transport={transport} appPrivateKey={appPrivateKey} appId={appId} />}
      />
      <Route path='/' children={<></>} />
    </Switch>
  );
}

export default Routes;
