import React from 'react';
import { HashRouter as Switch, Route, Redirect } from 'react-router-dom';
import ManageWallet from './WalletManagement';
import ETHTest from './Ethereum';
// import BitcoinTest from './Bitcoin/index'

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
      <Route path='/' children={<></>} />
    </Switch>
  );
}

export default Routes;
