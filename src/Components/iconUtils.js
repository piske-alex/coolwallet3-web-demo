import IconService from 'icon-sdk-js';
import crypto from 'crypto'

const {
  IconBuilder,
  IconAmount,
  IconConverter
} = IconService;

const version = 3;
const network = 'https://wallet.icon.foundation/api/v3'
const nid = 1

const httpProvider = new IconService.HttpProvider(network);
const iconService = new IconService(httpProvider);


export const getIconBalance = async address => {
  const loopValue = await iconService.getBalance(address).execute();

  const balance = IconAmount.of(loopValue, IconAmount.Unit.LOOP)
    .convertUnit(IconAmount.Unit.ICX)
    .toString();
  return balance;
};

export const getRawTransaction = async(address, to, value) => {
  
  const timestamp = check0xPrefix((new Date().getTime() * 1000).toString(16));
  
  const txObj = new IconBuilder.IcxTransactionBuilder()
      .from(address)
      .to(to)
      .value(IconAmount.of(value, IconAmount.Unit.ICX).toLoop())
      .stepLimit(IconConverter.toBigNumber(100000))
      .nid(IconConverter.toBigNumber(nid))
      //   .nonce(IconConverter.toBigNumber(nonce))
      .version(IconConverter.toBigNumber(version))
      .timestamp(timestamp)
      .build();
    // Returns raw transaction object
    const rawTx = IconConverter.toRawTransaction(txObj);
    return rawTx
}


function check0xPrefix(string) {
  if (!string) return;
  string = string.toLowerCase();
  if (string.startsWith("0x")) {
    return string;
  } else {
    return "0x" + string;
  }
}

// Do transaction step 3
export const sendTransaction = async fullTransaction => {
  
    const id = Buffer.from(crypto.randomBytes(8)).toString("hex");
    const data = {
      jsonrpc: "2.0",
      id: id,
      method: "icx_sendTransaction",
      params: fullTransaction
    };
    const response = await postData('https://cors-anywhere-anton.herokuapp.com/'+network, data);

    if (response.err) throw response.err;

    return response.result;
  
};

async function postData(url, data) {
  // Default options are marked with *
  console.log("postData:" + data);
  return await fetch(url, {
    body: JSON.stringify(data), // must match 'Content-Type' header
    headers: {
      "content-type": "application/json"
    },
    method: "POST" // *GET, POST, PUT, DELETE, etc.
  }).then(response => response.json()); // 輸出成 json
}