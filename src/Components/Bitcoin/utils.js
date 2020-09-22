export const getBTCBalance = async (address) => {
  const response = await (
    await fetch(`https://cors-anywhere.herokuapp.com/blockchain.info/rawaddr/${address}`)
  ).json()
  return parseFloat(response.final_balance)/10**8
};

const getBTCUTXO = async (address) => {
  try{
    const response = await (
      await fetch(`https://cors-anywhere.herokuapp.com/blockchain.info/unspent?active=${address}`)
    ).json()
    return response
  } catch (e) {
    return {unspent_outputs:[]}
  }
  
};

/***
 * @param addressToScan
 * 
 */
export const getBalance = async (addressesToScan) => {
  let balance = 0
  let utxos = []
  for(let address of addressesToScan) {
    const utxosA = await getBTCUTXO(address)
    console.log(utxosA)
    if(utxosA.unspent_outputs.length>0) {
      for(let k in utxosA.unspent_outputs) {
        balance += utxosA.unspent_outputs[k].value
        utxos.push(utxosA.unspent_outputs[k])
      }
    }
    await new Promise((res) => {
      setTimeout(res,500)
    })
  }
  console.log(utxos)
  return {balance, utxos}
}

const utxoReducer = (result,utxo) => {
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
}

const utxoSweepReducer = (result,utxo) => {
    result.inputs.push({
      preTxHash: utxo.tx_hash_big_endian,
      preIndex: utxo.tx_output_n,
      preValue: utxo.value,
      addressIndex: utxo.addressIndexCoolWallet
    })
    result.sendAmount += utxo.value - 93*fee
  return result
}

const calcInput = (existingUTXOs, amountToSend, fee, sendDust) => {
    const txFee = 79*fee
    console.log(txFee)
    return existingUTXOs.filter((utxo) => (sendDust? utxo.value > 93*fee: true)).reduce(utxoReducer, {inputs:[], change:0, amountToSend: amountToSend + txFee});
}

const calcSweepInput = (existingUTXOs, fee, sendDust) => {
  return existingUTXOs.filter((utxo) => (sendDust? utxo.value > 93*fee: true)).reduce(utxoSweepReducer, {inputs:[], sendAmount: -79*fee});
}

export const sweep = (existingUTXOs, toAddress, fee, sendDust=false) => {
  const preTx = calcSweepInput(existingUTXOs, fee, sendDust)
  if(preTx.sendAmount < 0) throw "Not Enough Balance to cover fee"
  return {inputs: preTx.inputs, output: {value: preTx.sendAmount, address: toAddress}, change: {value: 0, addressIndex:0}}
} 

export const transfer = (existingUTXOs, toAddress, satoshis, fee, sendDust=false) => {
  const preTx = calcInput(existingUTXOs, satoshis, fee, sendDust)
  if(preTx.amountToSend > 0 ) throw "Not Enough Balance"
  return {inputs: preTx.inputs, output: {value: satoshis, address: toAddress}, change: {value: preTx.change, addressIndex:0}}
}