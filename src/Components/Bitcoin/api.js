import BigNumber from 'bignumber.js';

export const getFee = async () => {
	const res = await fetch(`https://bitcoinfees.earn.com/api/v1/fees/recommended`);
	const resObject = await res.json();
	return resObject.fastestFee;
};

export const getAccounts = async addresses => {
	try {
		let accounts = [];
		const addressLimit = 50;
		const c = Math.ceil(addresses.length / addressLimit);
		for (let i = 0; i < c; i++) {
			const n = i * addressLimit;
			const addrs = addresses.slice(n, n + addressLimit);
			const addressesWithPipe = addrs.join('|');
			const res = await fetch(`https://blockchain.info/multiaddr?active=${addressesWithPipe}&n=0&cors=true`);
			const resObject = await res.json();

			accounts = accounts.concat(resObject.addresses.map(addr => {
				return {
					address: addr.address,
					balance: (new BigNumber(addr.final_balance)).shiftedBy(-8).toFixed()
				};
			}));
		}
		return accounts;
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

			utxos = utxos.concat(resObject.unspent_outputs.map(out => {
				const preTxHash = out.tx_hash_big_endian;
				const preIndex = out.tx_index;
				const preValue = (new BigNumber(out.value_hex, 16)).toFixed();
				const addressIndex = scripts.indexOf(out.script);
				return { preTxHash, preIndex, preValue, addressIndex };
			}));
		}
		return utxos;
	} catch (error) {
		console.log('error :', error);
	}
}
