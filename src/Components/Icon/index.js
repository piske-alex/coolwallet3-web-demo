import React, { useState } from "react";
import {
  Row,
  Col,
  FormText,
  InputGroup,
  FormControl,
  Container,
  Form,
  Button,
} from "react-bootstrap";
import * as util from "./util";
import cwsICX from "@coolwallet/icx";


function ICXTest({ transport, appPrivateKey, appId }) {
  const ICX = new cwsICX();

  const [addressIndex, setAddressIndex] = useState(0);
  const [balance, setBalance] = useState(0);

  // sign transaction
  const [address, setAddress] = useState("");
  const [to, setTo] = useState("hx5295a21c5b97d098ce11f5839311cadaccbae3f6"); // dai
  const [value, setValue] = useState("0");
  const [txHash, setHash] = useState("");

  // Sign Message
  const [signedTx, setSignedTx] = useState("");

  // Loading status
  const [isGettingAddress, setIsGettingAddress] = useState(false);
  const [isSigningTransaction, setIsSigningTx] = useState(false);
  const [isSendingTransaction, setIsSendingTx] = useState(false);

  const getAddress = async () => {
    setIsGettingAddress(true);
    const addressIdx = parseInt(addressIndex);
    try {
      console.log(transport);
      const address = await ICX.getAddress(transport, appPrivateKey, appId, addressIdx); //.then((address) => {
      setAddress(address);
      const response = await util.getIconBalance(address);
      console.log(response)
      setBalance(response.balance);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGettingAddress(false);
    }
  };


  const signTx = async () => {
    setIsSigningTx(true);
    // transfer dai
    // const data = '0xa9059cbb000000000000000000000000c94f3bebddfc0fd7eac7badb149fad2171b94b6900000000000000000000000000000000000000000000000000000000000003e8'

    try {
      
      const signData = util.getTxData(address, to, value);
      const signedTx = await ICX.signTransaction(transport, appPrivateKey, appId, signData, addressIndex); //.then((signedTx) => {
      console.log(signedTx)
      setSignedTx(signedTx)
    } catch (error) {
      console.error(error);
    } finally {
      setIsSigningTx(false);
    }
  };

  const sendTx = async () => {
    try {
      const resp = await util.sendTransaction(signedTx);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSendingTx(false);
    }
  };


  return (
    <Container style={{ textAlign: "left" }}>
      <h4> Get Address</h4>
      <Row>
        <Col xs={3}>
          <InputGroup className="mb-3">
            <FormControl
              onChange={(event) => {
                setAddressIndex(parseInt(event.target.value));
              }}
              value={addressIndex}
              placeholder="Index"
              aria-describedby="basic-addon2"
            />
            <InputGroup.Append>
              <Button
                disabled={isGettingAddress}
                variant="outline-success"
                compact="true"
                onClick={getAddress}
              >
                {isGettingAddress ? "Loading..." : "Get Address"}
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Col>
        <Col>
          <FormText style={{ textAlign: "left" }}> From {address} </FormText>
          <FormText style={{ textAlign: "left" }}>
            {" "}
            Balance: {balance}{" "}
          </FormText>
        </Col>
      </Row>
      <br></br>
      {/* Sign Test Transfer */}
      <h4>Sign Transaction</h4>
      <Row>
        <Col>
          <Form>
            <Form.Row>
              <Form.Group xs={4} as={Col} controlId="formGridTo">
                <Form.Label style={{ fontSize: 20 }}>To</Form.Label>
                <Form.Control
                  value={to}
                  onChange={(event) => {
                    setTo(event.target.value);
                  }}
                  placeholder="0x..."
                />
              </Form.Group>

              <Form.Group xs={4} md={2} as={Col} controlId="Amount">
                <Form.Label style={{ fontSize: 20 }}>Amount</Form.Label>
                <Form.Control
                  type="value"
                  value={value}
                  onChange={(event) => {
                    setValue(event.target.value);
                  }}
                  placeholder="Amount in ICX"
                />
              </Form.Group>

              <Form.Group as={Col} xs={2}>
                <br></br>
                <Button
                  disabled={isSigningTransaction}
                  variant="outline-success"
                  onClick={signTx}
                >
                  {isSigningTransaction ? "Signing Tx..." : "Sign"}
                </Button>
                <Button
                  disabled={isSendingTransaction}
                  variant="outline-success"
                  onClick={sendTx}
                >
                  {isSendingTransaction ? "Sending Tx..." : "Send"}
                </Button>
              </Form.Group>
            </Form.Row>
          </Form>
        </Col>
      </Row>
      <Row style={{ paddingTop: 20 }}>
        <Col ms={12}>
          <p style={{ textAlign: "left", fontSize: 20 }}> {txHash} </p>
        </Col>
      </Row>
    </Container>
  );
}

export default ICXTest;
