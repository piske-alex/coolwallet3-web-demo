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
import cwsXRP from "@coolwallets/xrp";
import axios from "axios";
import * as API from "./api";

function XRPTest({ transport, appPrivateKey, appId }) {
  const XRP = new cwsXRP(transport, appPrivateKey, appId);

  const [addressIndex, setAddressIndex] = useState(0);
  const [balance, setBalance] = useState(0);

  // sign transaction
  const [address, setAddress] = useState("");
  const [to, setTo] = useState("rUtYY9mi5XN4Y34tokbDUXPRqheKggCCyX");
  const [value, setValue] = useState("0");

  // Loading status
  const [isGettingAddress, setIsGettingAddress] = useState(false);
  const [isSigningTransaction, setIsSigningTx] = useState(false);

  const getAddress = async () => {
    setIsGettingAddress(true);
    const addressIdx = parseInt(addressIndex);
    try {
      const address = await XRP.getAddress(addressIdx); //.then((address) => {
      setAddress(address);
      axios
        .get(`https://data.ripple.com/v2/accounts/${address}/balances`)
        .then(function (response) {
          // Success
          setBalance(response.data.balances[0].value);
        });
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
      const param = {
        //TransactionType: , //"Payment"
        //Flags, //2147483648
        Sequence: "11", //"0000000b",
        DestinationTag: "00000000",
        LastLedgerSequence: "599", //"1b02294797",
        Amount: (parseInt(value) * Math.pow(10, 6)).toString(),
        Fee: "12", //"400000000000000c",
        //SigningPubKey,
        //Account,
        Destination: "rB8rz3nCuHDviKErGMT8xuFHZ8ZvdMfF91",
      };

      const signedTx = await XRP.signPayment(param, addressIndex); //.then((signedTx) => {
      console.log("signedTx: " + signedTx);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSigningTx(false);
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
                <Form.Label style={{ fontSize: 20 }}>Toooo</Form.Label>
                <Form.Control
                  value={to}
                  onChange={(event) => {
                    setTo(event.target.value);
                  }}
                  placeholder="r..."
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
                  placeholder="Amount in Eth"
                />
              </Form.Group>

              <Form.Group as={Col} xs={2}>
                <br></br>
                <Button
                  disabled={isSigningTransaction}
                  variant="outline-success"
                  onClick={signTx}
                >
                  {isSigningTransaction ? "Signing Tx..." : "Sign & Send"}
                </Button>
              </Form.Group>
            </Form.Row>

            <Form.Row></Form.Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default XRPTest;
