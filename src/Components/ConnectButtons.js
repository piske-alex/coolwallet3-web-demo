import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import { WebBleTransport } from 'cws-web-ble'
import { CWSDevice } from 'cws-sdk-core'
import { getAppKeysOrGenerate } from './sdkUtil';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
const transport = new WebBleTransport();

const { appPublicKey, appPrivateKey } = getAppKeysOrGenerate();
const core =  new CWSDevice(transport, appPublicKey, appPrivateKey)

class Ble extends Component {

  render() {
    return (
      // <div id="bleTest" width="640" height="480">
      <Container>
		  <Row>
		  	<Button onClick={transport.connect}>Connect</Button>
		  </Row>
		  <Row>
		  	<Button onClick={ () => {
				  core.getSEVersion()
			}}>SE Version</Button>
		  </Row>
		  <Row>
		  	<Button onClick={ () => {
				  core.resetCard()
			}}>Reset</Button>
		  </Row>
		  <Row>
		  	<Button onClick={ () => {
				  core.registerDevice('123456', 'myChromeExt').then(appId => {
					  localStorage.setItem("appId", appId)
					  console.log(`Store AppId complete! ${appId}`)
				  })
			}}>Register</Button>
		  </Row>
		  <Row>
			  <Button onClick={transport.disconnect}> Disconnect</Button>
		  </Row>
	  </Container>
        
    )
  }
}

export default Ble
