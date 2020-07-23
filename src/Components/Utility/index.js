import React, { useState } from 'react';
import { apdu } from "@coolwallet/core";
import { Container, Row, Col, Button } from 'react-bootstrap';

function Utility({ appPrivateKey, appPublicKey, appId, transport }) {

  const [lastKeyIdArray, setLastKeyIdArray] = useState([])
  const [showFullAddress, setshowFullAddress] = useState('click button')
  const [showFullAddressFlag, setshowFullAddressFlag] = useState('off')

  const [changeShowFullAddressFlag, setChangeShowFullAddressFlag] = useState(false)
  const [isShowFullAddress, setShowFullAddressStatus] = useState(false)
  const [isGetLastKeyId, setGetLastKeyIdStatus] = useState(false)
  const [isUpdateBalance, setUpdateBalanceStatus] = useState(false)
  const [isUpdateLastKeyId, setUpdateLastKeyIdStatus] = useState(false)

  const showFullAddressd = async () => {
    setShowFullAddressStatus(true)
    try {
      await apdu.info.toggleDisplayAddress(transport, appId, appPrivateKey, false);
      setshowFullAddress("do showFullAddress success")
    } catch (error) {
      console.error(error)
    } finally {
      setShowFullAddressStatus(false)
    }
  };

  const changeshowFullAddressFlag = async () =>{
    const status = !changeShowFullAddressFlag ? true : false;
    const flag = !status ? "on" : "off";
    console.log(showFullAddressFlag)
    console.log(status)
    setChangeShowFullAddressFlag(status);
    setshowFullAddressFlag(flag);

  }

  const updateLastKeyId = async () => {
    setUpdateLastKeyIdStatus(true)
    try {
      const dataArr = [{ KeyId: "2000", coinType: "00" }, { KeyId: "2277", coinType: "02" }]
      await apdu.info.updateKeyId(transport, appId, appPrivateKey, dataArr);
    } catch (error) {
      console.error(error)
    } finally {
      setUpdateLastKeyIdStatus(false)
    }
  };

  const getLastKeyId = async () => {
    setGetLastKeyIdStatus(true)
    try {
      const lastKeyIdArr = await apdu.info.getLastKeyId(transport, "04");
      console.log(lastKeyIdArr)
      setLastKeyIdArray(lastKeyIdArr)
    } catch (error) {
      console.error(error)
    } finally {
      setGetLastKeyIdStatus(false)
    }
  };
  const listItems = lastKeyIdArray.map((lastKeyId) =>
    <li key={lastKeyId.coinType}>
      {lastKeyId.coinType}: {lastKeyId.addressLastIndex}
    </li>
  );

  const updateBalance = async () => {
    setUpdateBalanceStatus(true)
    try {
      let dataArr = [];
      dataArr.push({ balance: 9999.9, coinType: "00" })
      dataArr.push({ balance: 8669.0, coinType: "3c" })
      dataArr.push({ balance: 3425, coinType: "02" })
      dataArr.push({ balance: -2345.3, coinType: "90" })
      const lastKeyIdArr = await apdu.mcu.display.updateBalance(transport, appId, appPrivateKey, dataArr);
      console.log(lastKeyIdArr)
      setLastKeyIdArray(lastKeyIdArr)
    } catch (error) {
      console.error(error)
    } finally {
      setUpdateBalanceStatus(false)
    }
  };
  return (
    <Container>
      <Row>
        <Col xs={3}>
          <Button
            disabled={isShowFullAddress}
            variant='outline-light'
            style={{ margin: 5 }}
            onClick={showFullAddressd}>
            {isShowFullAddress ? 'Loading' : 'Show Full Address'}
          </Button>
        </Col>
        <Col xs={3}>
          <Button
            // disabled={changeShowFullAddressFlag}
            variant='outline-light'
            style={{ margin: 5 }}
            onClick={changeshowFullAddressFlag}>
            {changeShowFullAddressFlag ? 'on' : 'off'}
          </Button>
        </Col>
        <Col>
          {showFullAddress}
        </Col>
      </Row> 
      <Row>
        <Col xs={3}>
          <Button
            disabled={isUpdateBalance}
            variant='outline-light'
            style={{ margin: 5 }}
            onClick={updateBalance}>
            {isUpdateBalance ? 'Loading' : 'Update Balance'}
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <Button
            disabled={isUpdateLastKeyId}
            variant='outline-light'
            style={{ margin: 5 }}
            onClick={updateLastKeyId}>
            {isUpdateLastKeyId ? 'Loading' : 'Update Last Key Id'}
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <Button
            disabled={isGetLastKeyId}
            variant='outline-light'
            style={{ margin: 5 }}
            onClick={getLastKeyId}>
            {isGetLastKeyId ? 'Loading' : 'Get Last Key Id'}
          </Button>
        </Col>
        <Col cs={3}>
          <ul>
            {listItems}
          </ul>
        </Col>
      </Row>
    </Container>
  )
}
export default Utility
