import { Server, NotFoundError as stellarNotFound, BASE_FEE, TransactionBuilder, TimeoutInfinite, Memo } from 'stellar-sdk';
import * as Stellar from 'stellar-sdk';
import { NotFoundError as kinesisNotFound } from 'js-kinesis-sdk';
import BigNumber from 'bignumber.js';

const data = {
	networkPassphrase: 'Public Global Stellar Network ; September 2015',
	horizonURL: 'https://horizon.stellar.org',
}

const server = new Server(data.horizonURL);

/**
 * Get Address balance
 * @Interface
 * @param {string} accountId (address)
 * @param {string} assetType
 * @returns {Promise<string>}
 */
export async function getStellarBalance(accountId, assetType = 'native') {
	try {
		const account = await server
			.accounts()
			.accountId(accountId)
			.call();
		const { balance } = account.balances.find(obj => {
			return obj.asset_type === assetType;
		});
		return balance;
	} catch (error) {
		if (isNotFoundError(error)) {
			return '0.0';
		}
		throw error;
	}
}

/**
 * reutn fixed base rate: 100 stroops
 * @return {string}
 */
// eslint-disable-next-line class-methods-use-this
export function getTransactionFee() {
	const baseFee = BASE_FEE;
	return moveDecimal(baseFee, -7);
}

function moveDecimal(value, unit) {
	const decimal = new BigNumber('10').pow(unit);
	const amount = new BigNumber(value);
	return amount.times(decimal).toFixed();
}

export async function getSignatureBaseAndTx(
	fromAddress,
	toAddress,
	fee,
	amount,
	memoType,
	memoInput
) {

	let memo;
	try {
		memo = new Memo(memoType, memoInput);
	} catch (error) {
		throw Error('getSignatureBaseAndTx error' + error);
	}
	const fundingAccount = server.loadAccount(fromAddress);
	console.log("======>")
	console.log(fromAddress)
	console.log(fundingAccount)

	const operation = await getOperation(toAddress, amount)

	return server.loadAccount(fromAddress)
		.then(function (fundingAccount) {
			console.log("+++++++++")
			console.log(fundingAccount)
			console.log(fundingAccount.accountId())


			const param = new TransactionBuilder(fundingAccount, {
				fee: parseInt(moveDecimal(fee, 7), 10),
				networkPassphrase: data.networkPassphrase,
			})
				.addOperation(operation)
				.setTimeout(TimeoutInfinite)
				.addMemo(memo);


			const tx = param.build();

			const signatureBase = tx.signatureBase();

			return { signatureBase, tx, fundingAccount };
		})
		.catch(function (error) {
			console.error('Something went wrong!', error);
		});

}

/**
 * check account status and decide operation type.
 * @private
 * @param {string} accountId
 * @param {string} amount
 * @return {Promise<Stellar.Operation>}
 */
async function getOperation(to, amount) {
	console.log(typeof amount)
	const toExists = await server.loadAccount(to)
		.then(() => true, () => false);

	console.log(toExists)

	const operation = toExists
		? Stellar.Operation.payment({
			destination: to,
			asset: Stellar.Asset.native(),
			amount: amount,
		})
		: Stellar.Operation.createAccount({
			destination: to,
			startingBalance: amount,
		});

	return operation;
}

/**
 * broadcast tx object
 * @Interface
 * @param {Stellar.Transaction} tx
 * @return {Promise}
 */
export async function sendTransaction(fundingAccount, tx, signature, fromAddress) {
	try {
		console.log(fundingAccount.accountId())
		const kp = Stellar.Keypair.fromPublicKey(fundingAccount.accountId());
		const hint = kp.signatureHint(); // this value depends only on public key
		console.log(hint)
		const ds = new Stellar.xdr.DecoratedSignature({ hint, signature });
		console.log("DecoratedSignature done")
		console.log(ds)
		tx.signatures.push(ds);
		console.log("tx.signatures.push done")
		console.log(tx)
		await server.submitTransaction(tx);
		console.log("server.submitTransaction done")
	} catch (error) {
		const msg = error.response ? JSON.stringify(error.response.data) : error;
		throw Error(msg)
	}
}


/**
 * using error.message because Stellar.NotFoundError can not be detected by instanceOf() in React-Native.
 * @param {Error} error
 * @return {Boolean}
 * */
const isNotFoundError = error => {
	return (
		error instanceof kinesisNotFound ||
		error instanceof stellarNotFound ||
		(typeof error.message === 'string' && error.message.includes('404'))
	);
};
