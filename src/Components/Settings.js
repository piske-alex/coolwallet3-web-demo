import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'

class SettingPage extends Component {
  getPassword = () => {
    this.props.wallet.getPairingPassword().then(pwd => {
      console.log(`Got pairing password: ${pwd}`)
    })
  }

  render() {
    return (
      <Container>
        <h4>Settings</h4>
        <Row>
          <Button
            variant='outline-danger'
            style={{ margin: 20 }}
            onClick={() => {
              this.props.wallet.resetCard()
            }}
          >
            Reset
          </Button>
          <Button
            style={{ margin: 20 }}
            variant='outline-light'
            onClick={() => {
              this.props.wallet.register(this.props.appPublicKey, '2799548', 'myChromeExt').then(appId => {
                localStorage.setItem('appId', appId)
                this.props.wallet.setAppId(appId)
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

export default SettingPage
