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

			accounts = resObject.addresses.map(addr => {
				return {
					address: addr.address,
					balance: (new BigNumber(addr.final_balance)).shiftedBy(-8).toFixed()
				};
			});
		}
		return accounts;
	} catch (error) {
		console.log('error :', error);
	}
}

export const getUtxos = async addresses => {
	try {
		addresses = addresses.slice(0,1);
		let utxos = [];
		const addressLimit = 50;
		const c = Math.ceil(addresses.length / addressLimit);
		for (let i = 0; i < c; i++) {
			const n = i * addressLimit;
			const addrs = addresses.slice(n, n + addressLimit);
			const addressesWithPipe = addrs.join('|');
			const res = await fetch(`https://blockchain.info/unspent?active=${addressesWithPipe}&cors=true`);
			const resObject = await res.json();
			console.log('resObject :', resObject);

			utxos = resObject.unspent_outputs.map(out => {
				return {
					preTxHash: 'ce3e845aedad19ad8ece79964cf474a2588011c42cfdd8c32aafa6b8aafcd178',
					preIndex: 2,
					preValue: '17867',
					addressIndex: 0,
				};
			});
		}
		return utxos;
	} catch (error) {
		console.log('error :', error);
	}
}
