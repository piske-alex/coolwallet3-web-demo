import React from 'react';
import { HashRouter as Switch, Route, Redirect } from 'react-router-dom';
import ManageWallet from './WalletManagement';
import ETHTest from './Ethereum';
import BitcoinTest from './Bitcoin'

function Routes({ appPublicKey, appPrivateKey, transport, appId }) {
  return (
    <Switch>
			<Redirect from='/' to='/wallet'/>
      <Route
        path='/wallet/'
        children={
          <ManageWallet
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
      <Route
        path='/btc'
        children={<BitcoinTest transport={transport} appPrivateKey={appPrivateKey} appId={appId} />}
      />
    </Switch>
  );
}

export default Routes;
