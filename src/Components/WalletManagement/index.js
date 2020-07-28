import React from 'react';
import Wallet from './Wallet'
import Settings from './Settings'

function WalletManagement({ appPrivateKey, appPublicKey, appId, transport }) {
  return (
    <>
      <Wallet appId={appId} appPublicKey={appPublicKey} appPrivateKey={appPrivateKey} transport={transport} />
      <Settings appId={appId} appPublicKey={appPublicKey} appPrivateKey={appPrivateKey} transport={transport} />
    </>
  )
}
export default WalletManagement
