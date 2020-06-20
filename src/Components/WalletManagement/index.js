import React from 'react';

import Wallet from './Wallet'
import Register from './Settings'
import CoolWallet from '@coolwallets/wallet';

function WalletManagement({ appPrivateKey, appPublicKey, appId, transport }) {

  const wallet = new CoolWallet(transport, appPrivateKey, appId);
  return (
    <>
      <Wallet wallet={wallet} />
      <Register wallet={wallet} appPublicKey={appPublicKey} />
    </>
  )
}

export default WalletManagement