import React from 'react';

import Wallet from './Wallet'
import Settings from './Settings'
import Switches from './Switches'
import CoolWallet from '@coolwallets/wallet';

function WalletManagement ({ appPrivateKey, appPublicKey, appId, transport }) {

  const wallet = new CoolWallet(transport, appPrivateKey, appId);
  return (
    <>
      <Wallet wallet={wallet}/>
      <Settings wallet={wallet} appPublicKey={appPublicKey} />
      <Switches />
    </>
  )
}

export default WalletManagement
