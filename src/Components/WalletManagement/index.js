import React from 'react';
import Wallet from './Wallet'

function WalletManagement({ appPrivateKey, appPublicKey, appId, transport }) {
  return (
    <>
      <Wallet appId={appId} appPublicKey={appPublicKey} appPrivateKey={appPrivateKey} transport={transport} />
    </>
  )
}
export default WalletManagement
