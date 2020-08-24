import React, { useState } from "react";
import * as Stellar from 'stellar-sdk';
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
import cwsXLM from "@coolwallet/xlm";


function XLMTest({ transport, appPrivateKey, appId }) {
  const XLM = new cwsXLM();

  const [addressIndex, setAddressIndex] = useState(0);
  const [balance, setBalance] = useState(0);
  const [fee, setFee] = useState(0);

  // sign transaction
  const [address, setAddress] = useState("");
  const [to, setTo] = useState(""); // dai
  const [value, setValue] = useState("2"); // 不能為0
  const [txHash, setHash] = useState("");
  const [protocol, setProtocol] = useState("");

  // Sign Message
  const [tx, setTx] = useState("");
  const [signatureTx, setSignatureTx] = useState("");
  const [fundingAccount, setFundingAccount] = useState("");

  // Loading status
  const [isGettingAddress, setIsGettingAddress] = useState(false);
  const [isSigningTransaction, setIsSigningTx] = useState(false);
  const [isSendingTx, setIsSendingTx] = useState(false);
  const [isGettingFee, setIsGettingFee] = useState(false);

  const getAddress = async (protocol) => {
    setIsGettingAddress(true);
    const addressIdx = parseInt(addressIndex);
    try {
      console.log("protocol: " + protocol);
      setProtocol(protocol)
      const address = await XLM.getAddress(transport, appPrivateKey, appId, addressIdx, protocol); //.then((address) => {
      console.log("address: " + address);
      setTo(address);
      setAddress(address);
      const balance = await util.getStellarBalance(address);
      console.log(balance)
      setBalance(balance);
      const fee = util.getTransactionFee();
      console.log(fee)
      setFee(fee);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGettingAddress(false);
    }
  };

  const getFee = async () => {
    setIsGettingFee(true);
    try {
      const fee = util.getTransactionFee();
      console.log(fee)
      setFee(fee);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGettingFee(false);
    }
  };


  const signTx = async () => {
    setIsSigningTx(true);
    try {
      const toAdd = 'GBCCEUDACKSPOLNYLRA7XEUCHR4ROFZYXGAONDAU3RLFMX5O7GNYNELV'
      // GATFWI7OGQ37UIFFKGIRFTOPZCIZIXXELTD76CETICSZ7Z63ULWQJZH4
      const resp = await util.getSignatureBaseAndTx(address, address, fee, value, Stellar.MemoNone, null);
      console.log(resp.signatureBase)
      console.log(resp.tx)
      setTx(resp.tx)
      setFundingAccount(resp.fundingAccount)

      const signatureTx = await XLM.signTransaction(transport, appPrivateKey, appId, resp.signatureBase, resp.tx, addressIndex, protocol); //.then((signedTx) => {
      setSignatureTx(signatureTx)
      console.log(signatureTx)
      
    } catch (error) {
      console.error(error);
    } finally {
      setIsSigningTx(false);
    }
  };


  const sendTx = async () => {
    // setIsSendingTx(true);
    // try {
    const resp = await util.sendTransaction(fundingAccount, tx, signatureTx, address);
    // } catch (error) {
    //   console.error(error);
    // } finally {
    //   setIsSendingTx(false);
    // }
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
          </InputGroup>
          <Button
            disabled={isGettingAddress}
            variant="outline-success"
            compact="true"
            onClick={() => getAddress("SLIP0010")}
          >
            {isGettingAddress ? "Loading..." : "Get Address SLIP0010"}
          </Button>
          <Button
            disabled={isGettingAddress}
            variant="outline-success"
            compact="true"
            onClick={() => getAddress("BIP44")}
          >
            {isGettingAddress ? "Loading..." : "Get Address BIP44"}
          </Button>
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
      <h4> Get Fee</h4>
      <Row>
        <Col xs={3}>
          <Button
            disabled={isGettingFee}
            variant="outline-success"
            compact="true"
            onClick={getFee}
          >
            {isGettingFee ? "Loading..." : "Get Fee"}
          </Button>
        </Col>
        <Col>
          <FormText style={{ textAlign: "left" }}>
            {" "}
            Fee: {fee}{" "}
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
                  disabled={isSendingTx}
                  variant="outline-success"
                  onClick={sendTx}
                >
                  {isSendingTx ? "Sending Tx..." : "Send"}
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

export default XLMTest;
