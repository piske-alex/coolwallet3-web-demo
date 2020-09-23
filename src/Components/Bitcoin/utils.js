import * as bitcoin from 'bitcoinjs-lib';
import * as bip32 from "bip32";
const b58 = require('bs58check')


export const getBTCBalance = async (address) => {
  const response = await (
    await fetch(`https://cors-anywhere.herokuapp.com/blockchain.info/rawaddr/${address}`)
  ).json()
  return parseFloat(response.final_balance) / 10 ** 8
};

const getBTCUTXO = async (address) => {
  try {
    const response = await (
      await fetch(`https://cors-anywhere.herokuapp.com/blockchain.info/unspent?active=${address}`)
    ).json()
    return response
  } catch (e) {
    return { unspent_outputs: [] }
  }
};

//https://bitcoinfees.earn.com/api/v1/fees/recommended
export const getBTCfee = async (address) => {
  try {
    const response = await (
      await fetch(`https://cors-anywhere.herokuapp.com/bitcoinfees.earn.com/api/v1/fees/recommended`)
    ).json()
    return response
  } catch (e) {
    return { "fastestFee": '0', "halfHourFee": '0', "hourFee": '0' }
  }
};
//blockchain.info/pushtx?tx=
export const pushTX = async (tx) => {
  try {
    const response = await (
      await fetch(`https://blockchain.info/pushtx?tx=${tx}`, {
        method: 'POST'
      })
    ).text()
    return response
  } catch (e) {
    return e
  }
};

/***
 * @param addressToScan
 * 
 */
export const getBalance = async (addressesToScan) => {
  let balance = 0
  let utxos = []
  for (let address of addressesToScan) {
    const utxosA = await getBTCUTXO(address)
    console.log(utxosA)
    if (utxosA.unspent_outputs.length > 0) {
      for (let k in utxosA.unspent_outputs) {
        balance += utxosA.unspent_outputs[k].value
        utxos.push(utxosA.unspent_outputs[k])
      }
    }
    await new Promise((res) => {
      setTimeout(res, 500)
    })
  }
  console.log(utxos)
  return { balance, utxos }
}

const utxoReducer = (result, utxo) => {
  if (result.amountToSend > 0) {
    result.inputs.push({
      preTxHash: utxo.tx_hash_big_endian,
      preIndex: utxo.tx_output_n,
      preValue: utxo.value,
      addressIndex: utxo.addressIndexCoolWallet
    })
    if (result.amountToSend > utxo.value) {
      result.amountToSend -= (utxo.value - 93 * result.fee)
      console.log(result.amountToSend)
    } else {
      result.change = utxo.value - result.amountToSend - 93 * result.fee
      result.amountToSend = 0
    }
  }
  return result
}

const utxoSweepReducer = (result, utxo) => {
  result.inputs.push({
    preTxHash: utxo.tx_hash_big_endian,
    preIndex: utxo.tx_output_n,
    preValue: utxo.value,
    addressIndex: utxo.addressIndexCoolWallet
  })
  result.sendAmount += utxo.value - 93 * result.fee
  return result
}

const calcInput = (existingUTXOs, amountToSend, fee, sendDust) => {
  const txFee = 79 * fee
  console.log(txFee)
  return existingUTXOs.filter((utxo) => (sendDust ? utxo.value > 93 * fee : true)).reduce(utxoReducer, { inputs: [], change: 0, amountToSend: amountToSend + txFee, fee });
}

const calcSweepInput = (existingUTXOs, fee, sendDust) => {
  return existingUTXOs.filter((utxo) => (sendDust ? utxo.value > 93 * fee : true)).reduce(utxoSweepReducer, { inputs: [], sendAmount: -79 * fee, fee });
}

export const sweep = (existingUTXOs, toAddress, fee, sendDust = false) => {
  const preTx = calcSweepInput(existingUTXOs, fee, sendDust)
  if (preTx.sendAmount < 0) throw "Not Enough Balance to cover fee"
  return { inputs: preTx.inputs, output: { value: preTx.sendAmount, address: toAddress }, change: { value: 0, addressIndex: 0 } }
}

export const transfer = (existingUTXOs, toAddress, satoshis, fee, sendDust = false) => {
  const preTx = calcInput(existingUTXOs, satoshis, fee, sendDust)
  if (preTx.amountToSend > 0) throw "Not Enough Balance"
  return { inputs: preTx.inputs, output: { value: satoshis, address: toAddress }, change: { value: preTx.change, addressIndex: 0 } }
}

export const yPubToAddress = (ypub, amount) => {
  const xpubY = ((ypub) => {
    let data = b58.decode(ypub)
    data = data.slice(4)
    data = Buffer.concat([Buffer.from('0488b21e', 'hex'), data])
    return b58.encode(data)
  })(ypub)

  const addresses = []

  for (let i = 0; i < amount; i++) {
    const { address } = bitcoin.payments.p2sh({
      redeem: bitcoin.payments.p2wpkh({
        pubkey: bip32.fromBase58(xpubY, bitcoin.networks.bitcoin).derive(i).publicKey,
        network: bitcoin.networks.bitcoin
      })
    });
    addresses.push(address)
  }

  return addresses
}