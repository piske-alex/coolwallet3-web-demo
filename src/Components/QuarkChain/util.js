import BigNumber from 'bignumber.js';

// const testnet = 'http://jrpc.devnet.quarkchain.io:38391';
const mainnet = 'http://jrpc.mainnet.quarkchain.io:38391';
const usedNet = mainnet;

const request = async (method, params) => {
  const res = await fetch(usedNet, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: '2.0',
      method,
      params,
      id: 1,
    }),
  });
  const response = await res.json();
  return response.result;
};

/**
 *
*/
async function getNetworkInfo() {
  const networkInfo = await request('networkInfo');
  console.log('networkInfo :', networkInfo);
  return networkInfo;
}

/**
 * @param {string} address
*/
export async function getTransactionCount(address) {
  const nonce = await request('getTransactionCount', [address]);
  console.log('nonce :', nonce);
  return nonce;
}

/**
 * @param {string} address
*/
export async function getBalance(address) {
  const result = await request('getBalances', [address]);
  // console.log('result :', result);
  for (let b of result.balances) {
    if (b.tokenId === '0x8bb0') {
      let balance = b.balance;
      balance = BigNumber(balance, 16).shiftedBy(-18).toFixed();
      console.log('balance :', balance, 'QKC');
      return balance;
    }
  }
}

/**
 * @param {string} address
*/
async function getAccountData(address) {
  const accountData = await request('getAccountData', [address, 'latest', true]);
  console.log('accountData :', accountData);
  return accountData;
}

/**
 * @param {string} from
 * @param {string} to
 * @param {string} value
 * @param {string} data
*/
export async function estimateGas(from, to, value, data) {
  console.log('from :', from);
  console.log('to :', to);
  console.log('value :', value);
  console.log('data :', data);
  console.log('estimateGas start');
  if (!value) value = '0x';
  if (!data) data = '0x';
  const estimatedGas = await request('estimateGas', [{ from, to, value, data }]);
  console.log('estimatedGas :', BigNumber(estimatedGas, 16).toFixed());
  return estimatedGas;
}

/**
 * @param {string} shardKey
*/
export async function getGasPrice(shardKey) {
  return await request('gasPrice', [shardKey, '0x8bb0']);
}
