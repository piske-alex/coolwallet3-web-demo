import React from 'react';
import Wallet from './Wallet'
import Settings from './Settings'
import { wallet } from '@coolwallet/core';
// const CoolWallet = coreWallet.default;
function WalletManagement({ appPrivateKey, appPublicKey, appId, transport }) {
  const CoolWallet = new wallet(transport, appPrivateKey, appId);
  return (
    <>
      <Wallet wallet={CoolWallet} transport={transport} />
      <Settings wallet={CoolWallet} appId={appId} appPublicKey={appPublicKey} appPrivateKey={appPrivateKey} transport={transport} />
    </>
  )
}
export default WalletManagement
