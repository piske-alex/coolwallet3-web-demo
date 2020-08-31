import { Promise as promise } from 'bluebird';
const IconService = require("icon-sdk-js");
const random = require("crypto");

const env = {// ropsten net
	"apiUrl": "https://ctz.solidwallet.io/api/v3",
	"trackerAPI": "https://bicon.tracker.solidwallet.io/v3",
	"chainId": "0x2",
	"nid": 1
}
const ver = 3;

const {
	IconBuilder,
	IconAmount,
	IconConverter
} = IconService;

const httpProvider = new IconService.HttpProvider(env.apiUrl);
const iconService = new IconService(httpProvider);

export async function getAddressesBalance(userAddresses) {
	return await promise.map(userAddresses, getIconBalance);
}

export const getIconBalance = async address => {
	const loopValue = await iconService.getBalance(address).execute();
	console.log("loopValue: " + loopValue)

	const balance = IconAmount.of(loopValue, IconAmount.Unit.LOOP)
		.convertUnit(IconAmount.Unit.ICX)
		.toString();
	console.log('balance: ' + balance)
	return { address, balance };
};

export function getTxData(address, to, value) {
	const timestamp = check0xPrefix((new Date().getTime() * 1000).toString(16));

	const param = new IconBuilder.IcxTransactionBuilder()
		.from(address)
		.to(to)
		.value(IconAmount.of(value, IconAmount.Unit.ICX).toLoop())
		.stepLimit(IconConverter.toBigNumber(100000))
		.nid(IconConverter.toBigNumber(env.nid))
		//   .nonce(IconConverter.toBigNumber(nonce))
		.version(IconConverter.toBigNumber(ver))
		.timestamp(timestamp)
		.build();

	const rawTx = IconConverter.toRawTransaction(param);

	const signData = JSON.stringify(rawTx);

	return signData;

}



export function check0xPrefix(string) {
	if (!string) return;
	string = string.toLowerCase();
	if (string.startsWith("0x")) {
		return string;
	} else {
		return "0x" + string;
	}
}


export const sendTransaction = async fullTransaction => {
	const id = Buffer.from(random.randomBytes(8)).toString("hex");
	const data = {
		jsonrpc: "2.0",
		id: id,
		method: "icx_sendTransaction",
		params: fullTransaction
	};
	const response = await postData(env.apiUrl, data);

	if (response.err) throw response.err;

	return response.result;
};

async function postData(url, data) {
	console.log("postData:" + data);
	return await fetch(url, {
		body: JSON.stringify(data), 
		headers: {
			"content-type": "application/json"
		},
		method: "POST" 
	}).then(response => response.json()); 
}
