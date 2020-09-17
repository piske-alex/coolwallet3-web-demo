import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormText from 'react-bootstrap/FormText';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Container from 'react-bootstrap/Container';
import cwsBTC from '@coolwallets/btc';

import { getBTCBalance, getBTCUTXO } from './utils'


function BitcoinTest({ transport, appPrivateKey, appId }) {
  const BTC = new cwsBTC(transport, appPrivateKey, appId);

  const [addressIndex, setAddressIndex] = useState(0);
  const [balance, setBalance] = useState(0);

  const [address, setAddress] = useState('');
  const [destination, setDestination] = useState('');
  const [profile, setProfile] = useState('');
  const [utxo, setUTXO] = useState('');
  const [utxos, setUTXOs] = useState([]);
  const [amount, setAmount] = useState('');
  const [fee, setFee] = useState('');
  const [log, setLog] = useState('Initialized...');

  const getAddress = async () => {
    const addressIdx = parseInt(addressIndex);
    const ScriptType = BTC.ScriptType.P2SH_P2WPKH;
    console.log('getting now')
    BTC.getAddressAndOutScript(ScriptType, 0).then(({ address, outScript }) => {
      setAddress(address);
      console.log(address)
      getBTCBalance(address).then((balance) => {
        console.log(`Update BTC balance ${balance}`);
        setBalance(balance);
      });
    });
    
  };

  const getRawTx = async () => {
    
    let existingUTXOs = JSON.parse(localStorage.getItem(`${profile}-utxos`))
    const amountToSend = parseInt(amount)
    console.log(amountToSend)

    const txFee = 79*parseInt(fee)
    console.log(txFee)
    const preTx = existingUTXOs.filter((utxo) => (utxo.value > 93*fee)).reduce((result,utxo) => {
      if (result.amountToSend > 0) {
        result.inputs.push({
          preTxHash: utxo.tx_hash_big_endian,
          preIndex: utxo.tx_output_n,
          preValue: utxo.value,
          addressIndex: utxo.addressIndexCoolWallet
        })
        if (result.amountToSend > utxo.value) {
          result.amountToSend -= (utxo.value - 93*fee)
          console.log(result.amountToSend)
        } else {
          result.change = utxo.value - result.amountToSend - 93*fee
          result.amountToSend = 0
        }
      }
      return result
    },{inputs:[], change:0, amountToSend: amountToSend + txFee});
    
    console.log(preTx)
    if(preTx.amountToSend > 0 )alert('not enough balance')
    const ScriptType = BTC.ScriptType.P2SH_P2WPKH;
    console.log('getting now')
    const tx = await BTC.signTransaction(ScriptType, preTx.inputs, {value: amountToSend,address: destination}, {value: preTx.change, addressIndex:0})
    console.log('osidfj')
    console.log(tx)
    const newLog = log+"\nPut the below to blockcypher raw tx push \n"+tx
      setLog(newLog)
  };

  const populateLocalStorage = async () => {
    for(let i =0; i<addressIndex; i++) {
      console.log(log)
      const newLog = log+"\nGetting Address "+i
      setLog(newLog)
      console.log(newLog)
      const ScriptType = BTC.ScriptType.P2SH_P2WPKH;
      await BTC.getAddressAndOutScript(ScriptType, i).then(({ address, outScript }) => {
        localStorage.setItem(`${profile}-${i}`,address)
      });
    }
    localStorage.setItem(`${profile}-index`,addressIndex)
  }

  const getUTXOs = async () => {
    const addInd = parseInt(localStorage.getItem(`${profile}-index`))

    console.log(`start getting utxos ${addInd}`)
    const balance = 0
    for(let i =0; i<addInd; i++) {
      console.log(log)
      const newLog = log+"\nGetting UTXO for Address "+i
      setLog(newLog)
      console.log(newLog)
      const utxos = await getBTCUTXO(localStorage.getItem(`${profile}-${i}`))
      if(utxos.unspent_outputs.length>0) {
        if(localStorage.getItem(`${profile}-utxos`)){
          let existingUTXOs = JSON.parse(localStorage.getItem(`${profile}-utxos`))
          let existFlag = false
          for(let k in utxos.unspent_outputs) {
            for(let j in existingUTXOs) {
              if(existingUTXOs[j].tx_hash+existingUTXOs[j].tx_output_n === utxos.unspent_outputs[k].tx_hash+utxos.unspent_outputs[k].tx_output_n) {
                existFlag = true
              }
            }
            if(!existFlag) {
              utxos.unspent_outputs[k].addressIndexCoolWallet = i
              existingUTXOs.push(utxos.unspent_outputs[k])
            }
          }
          localStorage.setItem(`${profile}-utxos`, JSON.stringify(existingUTXOs))
          setUTXOs(existingUTXOs)
        }else {
            let existingUTXOs = []
            existingUTXOs = existingUTXOs.concat(utxos.unspent_outputs.map((v) => {
              v.addressIndexCoolWallet = i
              return v
            }))
            localStorage.setItem(`${profile}-utxos`, JSON.stringify(existingUTXOs))
            setUTXOs(existingUTXOs)
        }
        console.log(utxos)
      }
      await new Promise((res) => {
        setTimeout(res,500)
      })
    }
  }

  return (
    <Container style={{ textAlign: 'left' }}>
      <h5> Get Address</h5>
      {/* Get Address from Card */}
      <Row>
        <Col xs={3}>
          <InputGroup className='mb-3'>
            <FormControl
              onChange={(event) => {
                setAddressIndex(parseInt(event.target.value));
              }}
              value={addressIndex}
              placeholder='Index'
              aria-describedby='basic-addon2'
            />
            <InputGroup.Append>
              <Button variant='outline-success' compact='true' onClick={getAddress}>
                Get Address
              </Button>
            </InputGroup.Append>
          </InputGroup>
          <FormControl
              onChange={(event) => {
                setProfile(event.target.value);
              }}
              value={profile}
              placeholder='Profile'
              aria-describedby='basic-addon2'
            />
          <InputGroup className='mb-3'>
            <FormControl
              onChange={(event) => {
                setAddressIndex(parseInt(event.target.value));
              }}
              value={addressIndex}
              placeholder='Index'
              aria-describedby='basic-addon2'
            />
            <InputGroup.Append>
              <Button variant='outline-success' compact='true' onClick={populateLocalStorage}>
                Populate Address
              </Button>
            </InputGroup.Append>
          </InputGroup>
          <Button variant='outline-success' compact='true' onClick={getUTXOs}>
                getUTXOs
              </Button>
        </Col>
        <Col>
          <FormText style={{ textAlign: 'left' }}> From {address} </FormText>
          <FormText style={{ textAlign: 'left' }}> Balance: {balance} </FormText>
        </Col>
      </Row>
      <Row>
        <textarea style={{height:300}} disabled value={log}></textarea>
      </Row>
      <Row>
        <FormControl
              onChange={(event) => {
                setUTXO(event.target.value);
              }}
              value={utxo}
              placeholder='utxo index (1,2,3...)'
              aria-describedby='basic-addon2'
            />
        <FormControl
              onChange={(event) => {
                setAmount(event.target.value);
              }}
              value={amount}
              placeholder='amount to send (sat)'
              aria-describedby='basic-addon2'
            />
          <FormControl
              onChange={(event) => {
                setDestination(event.target.value);
              }}
              value={destination}
              placeholder='destination'
              aria-describedby='basic-addon2'
            />
          <FormControl
              onChange={(event) => {
                setFee(event.target.value);
              }}
              value={fee}
              placeholder='fee (sat)'
              aria-describedby='basic-addon2'
            />
        
        <Button variant='outline-success' compact='true' onClick={getRawTx}>
                get raw transaction
              </Button>
      </Row>
      <Row>
        <Col>
        {utxos.map((v)=>{
          return <p key={v.tx_hash}>{JSON.stringify(v)}</p>
        })}
        </Col>
      </Row>
      <br></br>
      
    </Container>
  );
}

export default BitcoinTest;
