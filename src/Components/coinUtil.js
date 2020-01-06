import * as Stellar from 'stellar-sdk';

const horizonUrl = 'https://horizon.stellar.org';
const passphrase = 'Public Global Stellar Network ; September 2015';

const server = new Stellar.Server(horizonUrl)

let tx;

export const getBalance = async (accountId) => {
  const account = await server
        .accounts()
        .accountId(accountId)
        .call();
      let balance = account.balances.find(obj => {
        return obj.asset_type === 'native';
      }).balance;
      return balance;
};

export const getRawTransaction = async (from, to, amount) => {
  const fundingAccount = await server.loadAccount(from)
  const operation = Stellar.Operation.payment({
    destination: to,
    asset: Stellar.Asset.native(),
    amount: amount.toString(),
  })

  let txBuilder = new Stellar.TransactionBuilder(fundingAccount, {
    fee: 100,
    networkPassphrase: passphrase,
  })
    .addOperation(operation)
    .setTimeout(Stellar.TimeoutInfinite);

  tx = txBuilder.build();

  const signatureBase = tx.signatureBase();
  return signatureBase;
};

export const sendTransaction = async(from, signature) => {
  const fundingAccount = await server.loadAccount(from)
  const kp = Stellar.Keypair.fromPublicKey(fundingAccount.accountId());
  const hint = kp.signatureHint(); // this value depends only on public key
  const ds = new Stellar.xdr.DecoratedSignature({ hint, signature });
  tx.signatures.push(ds);
  console.log(tx)
  try {
    await server.submitTransaction(tx);
    return 'success'
  } catch (error) {
    const msg = error.response ? JSON.stringify(error.response.data.extras.result_codes) : error;
    console.error(msg)
    return msg
  }
 
}