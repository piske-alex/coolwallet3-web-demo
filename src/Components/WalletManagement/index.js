import React from 'react';
import Wallet from './Wallet'
import Settings from './Settings'
import { wallet as coreWallet } from '@coolwallet/core';
const CoolWallet = coreWallet.default;
function WalletManagement({ appPrivateKey, appPublicKey, appId, transport }) {
  const wallet = new CoolWallet(transport, appPrivateKey, appId);
  return (
    <>
      <Wallet wallet={wallet} />
      <Settings wallet={wallet} appPublicKey={appPublicKey} />
    </>
  )
}
export default WalletManagement
