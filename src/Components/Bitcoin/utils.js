export const getBTCBalance = async (address) => {
  const response = await (
    await fetch(`https://cors-anywhere.herokuapp.com/blockchain.info/rawaddr/${address}`)
  ).json()
  return parseFloat(response.final_balance)/10**8
};

export const getBTCUTXO = async (address) => {
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
export const getUTXOs = async (addressesToScan) => {
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