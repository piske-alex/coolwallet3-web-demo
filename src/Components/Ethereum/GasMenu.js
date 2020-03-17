import React, { Component } from 'react'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import axios from 'axios'

class GasMenu extends Component {
  state = {
    fast: 0,
    avg: 0,
    slow: 0,
    selected: 0,
  }

  componentDidMount() {
    axios.get('https://ethgasstation.info/json/ethgasAPI.json').then(response => {
      this.setState({
        fast: response.data.fast,
        avg: response.data.average,
        slow: response.data.safeLow,
      })
    })
  }

  render() {
    return (
      // <Row style={{marginLeft: 5}}>
      <ButtonGroup block >
        <Button
          active = {this.state.selected === 1}
          variant='secondary'
          onClick={() => {
            this.props.handler(this.state.fast)
            this.setState({ selected: 1 })
          }}
        >
          Fast: {this.state.fast}
        </Button>
        <Button
        active = {this.state.selected === 2}
          variant='secondary'
          onClick={() => {
            this.props.handler(this.state.avg)
            this.setState({ selected: 2 })
          }}
        >
          Avg: {this.state.avg}
        </Button>
        <Button
        active = {this.state.selected === 3}
          variant='secondary'
          onClick={() => {
            this.props.handler(this.state.slow)
            this.setState({ selected: 3 })
          }}
        >
          Slow: {this.state.slow}
        </Button>
      </ButtonGroup>
      // </Row>
    )
  }
}

export default GasMenu
