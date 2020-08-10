import React from 'react';
import Settings from './Settings'

function SettingManagement({ appPrivateKey, appPublicKey, appId, transport }) {
  return (
    <>
      <Settings appId={appId} appPublicKey={appPublicKey} appPrivateKey={appPrivateKey} transport={transport} />
    </>
  )
}
export default SettingManagement
