// import * as Stellar from 'stellar-sdk';

// const horizonUrl = 'https://horizon.stellar.org';
// const passphrase = 'Public Global Stellar Network ; September 2015';

// const server = new Stellar.Server(horizonUrl)

// let tx;

// export const getBalance = async (accountId) => {
// };

export const getTxObject = (from, to, amount) => {
  return {
    account_number: '39',
    chain_id: 'Binance-Chain-Tigris',
    data: null,
    memo: '',
    msgs: [
      {
        inputs: [
          {
            address: from,
            coins: [{ amount: amount, denom: 'BNB' }],
          },
        ],
        outputs: [
          {
            address: to,
            coins: [{ amount: amount, denom: 'BNB' }],
          },
        ],
      },
    ],
    sequence: '503',
    source: '1',
  };
};

// export const sendTransaction = async(from, signature) => {

// }
