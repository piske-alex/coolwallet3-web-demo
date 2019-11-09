import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'

class Ble extends Component {
  render() {
    return (
      <Container>
        <h4> Connection </h4>
        <Row>
          <Button variant="light" style={{ margin: 20 }} onClick={this.props.connect}>Connect</Button>
          <Button variant="outline-warning" style={{ margin: 20 }} onClick={this.props.disconnect}> Disconnect</Button>
        </Row>
      </Container>

    )
  }
}

export default Ble
