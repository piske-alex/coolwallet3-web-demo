import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'

class Device extends Component {
  getPassword = () => {
    this.props.device.getPairingPassword().then(pwd => {
      console.log(`Got pairing password: ${pwd}`)
    })
  }

  render() {
    return (
      <Container>
        <h4>Device</h4>
        <Row>
          <Button
            variant='outline-danger'
            style={{ margin: 20 }}
            onClick={() => {
              this.props.device.resetCard()
            }}
          >
            Reset
          </Button>
          <Button
            style={{ margin: 20 }}
            variant='outline-light'
            onClick={() => {
              this.props.device.register(this.props.appPublicKey, '83239194', 'myChromeExt').then(appId => {
                localStorage.setItem('appId', appId)
                this.props.device.setAppId(appId)
                console.log(`Store AppId complete! ${appId}`)
              })
            }}
          >
            Register
          </Button>

          <Button variant='outline-light' style={{ margin: 20 }} onClick={this.getPassword}>
            {' '}
            Get password
          </Button>
        </Row>
      </Container>
    )
  }
}

export default Device
