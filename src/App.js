import React from "react";
import { HashRouter as Router } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import WebBleTransport from "@coolwallet/transport-web-ble";

import { getAppKeysOrGenerate, getAppIdOrNull } from "./Utils/sdkUtil";
import Routes from "./Components/Routes";
import MyNavBar from "./Components/NavBar";
import "./App.css";

const { appPublicKey, appPrivateKey } = getAppKeysOrGenerate();
const appId = getAppIdOrNull();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { transport: undefined, cardName: "", errorMsg: "" };
  }

  static getDerivedStateFromError(error) {
    return { errorMsg: error.toString() };
  }

  componentDidCatch(error, errorInfo) {
    console.debug("catched error :", error);
  }

  connect = async () => {
    WebBleTransport.listen(async (error, device) => {
      console.log(device)
      if (device) {
        const cardName = device.name;
        const transport = await WebBleTransport.connect(device);
        this.setState({ transport, cardName });
      } else {
        console.log(error);
      }
    });
  };

  disconnect = () => {
    WebBleTransport.disconnect(this.state.transport.device.id);
    this.setState({ transport: undefined, cardName: "" });
  };

  showConnectButton() {
    return this.state.cardName ? (
      <Button
        variant="outline-warning"
        style={{ margin: 5 }}
        onClick={this.disconnect}
      >
        {" "}
        Disconnect
      </Button>
    ) : (
        <Button variant="light" style={{ margin: 5 }} onClick={this.connect}>
          Connect
        </Button>
      );
  }

  showErrorMessage() {
    return this.state.errorMsg ? (
      <Row style={{ margin: 25, background: "white" }}>
        <div style={{ width: "4px", background: "red" }} />
        <Col style={{ paddingTop: 15 }}>
          <p style={{ fontSize: 15, color: "red" }}>{this.state.errorMsg}</p>
        </Col>
      </Row>
    ) : (
        <Row style={{ margin: 25 }} />
      );
  }

  render() {
    return (
      <div className="App">
        <Router>
          <Container>
            <Row>
              <Col>
                <MyNavBar />
              </Col>
              <p style={{ paddingTop: 15, paddingRight: 10 }}>
                {this.state.cardName}
              </p>
              {this.showConnectButton()}
            </Row>
            {this.showErrorMessage()}
          </Container>
          <Routes
            transport={this.state.transport}
            appId={appId}
            appPrivateKey={appPrivateKey}
            appPublicKey={appPublicKey}
          />
        </Router>
      </div>
    );
  }
}

export default App;
