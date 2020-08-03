import BigNumber from 'bignumber.js';

export const getFeeRate = async () => {
	const res = await fetch(`https://route.cbx.io/api/bch/utils/estimatefee`);
	const resObject = await res.json();
	return (new BigNumber(resObject[3])).shiftedBy(5).toFixed();
};

export const getBalances = async addresses => {
	try {
		let balances = [];
		for (let address of addresses) {
			const res = await fetch(`https://route.cbx.io/api/bch/addr/${address}`);
			const resObject = await res.json();
			balances = balances.concat(new BigNumber(resObject.balance).toFixed());
		}
		return balances;
	} catch (error) {
		console.log('error :', error);
	}
};

export const getUtxos = async (addresses, outScripts) => {
	try {
		let utxos = [];
		const addressLimit = 50;
		const c = Math.ceil(addresses.length / addressLimit);
		for (let i = 0; i < c; i++) {
			const n = i * addressLimit;
			const addrs = addresses.slice(n, n + addressLimit);
			const addressesWithComma = addrs.join(',');
			const res = await fetch(`https://route.cbx.io/api/bch/addrs/${addressesWithComma}/utxo`);
			const resObject = await res.json();
			console.log('resObject :', resObject);

			const scripts = outScripts.slice(n, n + addressLimit);

			for (const utxo of resObject) {
				const preTxHash = utxo.txid;
				const preIndex = utxo.vout;
				const preValue = (new BigNumber(utxo.satoshis)).toFixed();
				const addressIndex = scripts.indexOf(utxo.scriptPubKey);
				if (!utxos[addressIndex]) utxos[addressIndex] = [];
				utxos[addressIndex].push({ preTxHash, preIndex, preValue, addressIndex });
			}
		}
		return utxos;
	} catch (error) {
		console.log('error :', error);
		return [];
	}
};

export const sendTx = async (tx) => {
	try {
		const response = await fetch(`https://route.cbx.io/api/bch/tx/send`, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			method: 'POST',
			body: `rawTx=${tx}`,
		});
		return await response.text();

	} catch (error) {
		console.log('error :', error);
	}
};
