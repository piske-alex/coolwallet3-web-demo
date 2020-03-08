export const getBTCBalance = async (address) => {
  const response = await (
    await fetch(`https://cors-anywhere.herokuapp.com/blockchain.info/rawaddr/${address}`)
  ).json()
  return parseFloat(response.final_balance)/10**8
};