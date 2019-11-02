import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import { getAppKeysOrGenerate, getAppIdOrNull } from './sdkUtil';

import WebBleTransport from '@coolwallets/transport-web-ble'
import { CWSDevice } from '@coolwallets/sdk-core'
import cwsETH from '@coolwallets/eth'

const transport = new WebBleTransport();

const { appPublicKey, appPrivateKey } = getAppKeysOrGenerate();
const appId = getAppIdOrNull()
const device =  new CWSDevice(transport, appPrivateKey, appId)
const ETH = new cwsETH(transport, appPrivateKey, appId)

class Ble extends Component {

	getPassword = () => {
		device.getPairingPassword().then(pwd=>{
			console.log(`Got pairing password: ${pwd}`)
		})
	}

  render() {
    return (
      <Container>
		  <Row>
		  	<Button onClick={transport.connect}>Connect</Button>
			<Button onClick={transport.disconnect}> Disconnect</Button>
		  </Row>
		  <Row>
		  	<Button onClick={ () => {
				  device.getSEVersion().then(version=>{
					  console.log(`Got SE Version: ${version}`)
				  })
			}}>SE Version</Button>
		  </Row>
		  <Row>
		  	<Button onClick={ () => {
				  device.resetCard()
			}}>Reset</Button>
		  </Row>
		  <Row>
		  	<Button onClick={ () => {
				  device.register(appPublicKey, '83239194', 'myChromeExt').then(appId => {
					  localStorage.setItem("appId", appId)
					  device.setAppId(appId)
					  console.log(`Store AppId complete! ${appId}`)
				  })
			}}>Register</Button>
		  </Row>
		  <Row>
			  <Button onClick={this.getPassword}> Get password</Button>
		  </Row>
		  <h3>Ethereum Test</h3>
		  <Row>
			  <Button onClick={()=>{
				  ETH.getAddress(0).then(addr=>{
					  console.log(`Got address => ${addr}`)
				  })
			  }}> getAddress </Button>
		  </Row>
		  <Row>
			  <Button onClick={()=>{
				  const payload = "eb81f884b2d05e00825208940644de2a0cf3f11ef6ad89c264585406ea346a96870107c0e2fc200080018080";
				//   const publicKey = "033a057e1f19ea73423bd75f4d391dd28145636081bf0c2674f89fd6d04738f293";
				  const addressIndex = 0;
				  ETH.signTransaction(payload, addressIndex).then(hex=>{
					  console.log(`signed Hex: ${hex}`)
				  })
			  }}> Sign Transfer! </Button>
		  </Row>
	  </Container>	  
        
    )
  }
}

export default Ble
