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
import cwsBNB from "@coolwallet/bnb";
import axios from "axios";
import BigNumber from 'bignumber.js';

function BNBTest({ transport, appPrivateKey, appId }) {
  const BNB = new cwsBNB();

  const [addressIndex, setAddressIndex] = useState(0);
  const [balance, setBalance] = useState(0);

  // sign transaction
  const [address, setAddress] = useState("");
  const [to, setTo] = useState("");
  const [value, setValue] = useState("0");
  const [fee, setFee] = useState("0");
  const [accountData, setAccountData] = useState("");
  const [chainId, setChainId] = useState("");


  // Loading status
  const [isGettingAddress, setIsGettingAddress] = useState(false);
  const [isSigningTransaction, setIsSigningTx] = useState(false);

  const getAddress = async () => {
    setIsGettingAddress(true);
    const addressIdx = parseInt(addressIndex);
    try {
      const address = await BNB.getAddress(transport, appPrivateKey, appId, addressIdx); //.then((address) => {
      setAddress(address);
      axios
        .get(`https://dex.binance.org/api/v1/account/${address}`)
        .then(function (response) {
          // Success
          console.log("balances: " + JSON.stringify(response.data.balances))
          setAccountData(response.data)
          //accountData = response.data
          const balances = response.data.balances;
          for (var balance of balances) {
            if (balance.symbol == 'BNB') {
              setBalance(balance.free);
              break;
            }
          }
        });

      axios
        .get(`https://dex.binance.org/api/v1/node-info`)
        .then(function (response) {
          // Success
          console.log("node-info: " + JSON.stringify(response.data))
          setChainId(response.data.node_info.network)
        });
    } catch (error) {
      console.error(error);
    } finally {
      setIsGettingAddress(false);
    }
  };

  const getCoins = (value) => {
    const coin = {
      amount: new BigNumber(value).multipliedBy(Math.pow(10, 8)).toNumber(),
      //parseFloat(value) * Math.pow(10, 8),
      denom: "BNB"
    }
    return coin
  }

  const signTx = async () => {
    setIsSigningTx(true);
    console.log("accountData: " + JSON.stringify(accountData))
    try {
      const msg = {
        inputs: [
          {
            address: accountData.address,
            coins: [getCoins(value)],
          },
        ],
        outputs: [
          {
            address: to,
            coins: [getCoins(value)],
          },
        ],
      };

      const signObj = {
        account_number: accountData.account_number.toString(),
        chain_id: chainId,
        data: null,
        memo: "",
        msgs: [msg],
        sequence: accountData.sequence.toString(),
        source: "711"
      };
      console.log("signObj: " + JSON.stringify(signObj));
      const signHex = Buffer.from(JSON.stringify(signObj), 'ascii').toString('hex')
      console.log("signHex: " + JSON.stringify(signHex));

      const signedTx = await BNB.signTransaction(transport, appPrivateKey, appId, signHex, addressIndex);
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
                <Form.Label style={{ fontSize: 20 }}>To BNB address</Form.Label>
                <Form.Control
                  value={to}
                  onChange={(event) => {
                    setTo(event.target.value);
                  }}
                  placeholder="bnb..."
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
                  placeholder="Amount in Bnb"
                />
              </Form.Group>
              <Form.Group xs={4} md={2} as={Col} controlId="Fee">
                <Form.Label style={{ fontSize: 20 }}>Fee</Form.Label>
                <Form.Control
                  disabled
                  type="value"
                  value={fee}
                  onChange={(event) => {
                    setFee(event.target.value);
                  }}
                  placeholder="Fee in Bnb"
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

export default BNBTest;
