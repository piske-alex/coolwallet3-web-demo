import BigNumber from 'bignumber.js';

export const getFeeRate = async () => {
	const res = await fetch(`https://bitcoinfees.earn.com/api/v1/fees/recommended`);
	const resObject = await res.json();
	return resObject.fastestFee;
};

export const getBalances = async addresses => {
	try {
		let balances = [];
		const addressLimit = 50;
		const c = Math.ceil(addresses.length / addressLimit);
		for (let i = 0; i < c; i++) {
			const n = i * addressLimit;
			const addrs = addresses.slice(n, n + addressLimit);
			const addressesWithPipe = addrs.join('|');
			const res = await fetch(`https://blockchain.info/multiaddr?active=${addressesWithPipe}&n=0&cors=true`);
			const resObject = await res.json();

			balances = balances.concat(resObject.addresses.map(addr => {
				return (new BigNumber(addr.final_balance)).shiftedBy(-8).toFixed();
			}));
		}
		return balances;
	} catch (error) {
		console.log('error :', error);
	}
}

export const getUtxos = async (addresses, outScripts) => {
	try {
		let utxos = [];
		const addressLimit = 50;
		const c = Math.ceil(addresses.length / addressLimit);
		for (let i = 0; i < c; i++) {
			const n = i * addressLimit;
			const addrs = addresses.slice(n, n + addressLimit);
			const addressesWithPipe = addrs.join('|');
			const res = await fetch(`https://blockchain.info/unspent?active=${addressesWithPipe}&cors=true`);
			const resObject = await res.json();

			const scripts = outScripts.slice(n, n + addressLimit);

			for (const out of resObject.unspent_outputs) {
				const preTxHash = out.tx_hash_big_endian;
				const preIndex = out.tx_index;
				const preValue = (new BigNumber(out.value_hex, 16)).toFixed();
				const addressIndex = scripts.indexOf(out.script);

				if (!utxos[addressIndex]) utxos[addressIndex] = [];
				utxos[addressIndex].push({ preTxHash, preIndex, preValue, addressIndex });
			}
		}
		return utxos;
	} catch (error) {
		console.log('error :', error);
	}
}
