import React from 'react';

import Wallet from './Wallet'
import Register from './Settings'
import { wallet as coreWallet } from '@coolwallet/core';

function WalletManagement({ appPrivateKey, appPublicKey, appId, transport }) {

  const wallet = new coreWallet(transport, appPrivateKey, appId);
  return (
    <>
      <Wallet wallet={wallet} />
      <Register wallet={wallet} appPublicKey={appPublicKey} />
    </>
  )
}

export default WalletManagement