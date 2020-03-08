import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { AlreadyRegistered } from '@coolwallets/errors';

class SettingPage extends Component {
  getPassword = () => {
    this.props.wallet.getPairingPassword().then((pwd) => {
      console.log(`Got pairing password: ${pwd}`);
    });
  };

  registerWithCard = () => {
    console.log(this.props)
    this.props.wallet
      .register(this.props.appPublicKey, '12345678', 'myChromeExt')
      .then((appId) => {
        localStorage.setItem('appId', appId);
        this.props.wallet.setAppId(appId);
        console.log(`Store AppId complete! ${appId}`);
      })
      .catch((error) => {
        if (error instanceof AlreadyRegistered) {
          console.log(`Already registered`);
        } else {
          console.error(error);
        }
      });
  };

  render() {
    return (
      <Container>
        <h4>Settings</h4>
        <Row>
          <Button
            variant='outline-danger'
            style={{ margin: 5 }}
            onClick={() => {
              this.props.wallet.resetCard();
            }}
          >
            Reset
          </Button>
          <Button style={{ margin: 5 }} variant='outline-light' onClick={this.registerWithCard}>
            Register
          </Button>

          <Button variant='outline-light' style={{ margin: 5 }} onClick={this.getPassword}>
            {' '}
            Get password
          </Button>
        </Row>
      </Container>
    );
  }
}

export default SettingPage;
