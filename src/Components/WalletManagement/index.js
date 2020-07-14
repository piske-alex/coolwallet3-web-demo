import React from 'react';
import Wallet from './Wallet'
import Settings from './Settings'
import { wallet as coreWallet } from '@coolwallet/core';
const CoolWallet = coreWallet.default;
function WalletManagement({ appPrivateKey, appPublicKey, appId, transport }) {
  const wallet = new CoolWallet(transport, appPrivateKey, appId);
  return (
    <>
      <Wallet wallet={wallet} transport={transport} />
      <Settings wallet={wallet} appId={appId} appPublicKey={appPublicKey} appPrivateKey={appPrivateKey} transport={transport} />
    </>
  )
}
export default WalletManagement
