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