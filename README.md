# CoolWalletS WebApp Demo

![screenshot](https://i.imgur.com/fw0M8C5.png)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

This is a demo of how to use CoolWalletS SDK to built your own Dapp.

## Install and run

```shell
npm insatll
```

```shell
yarn start
# or
npm start
```

## Notes

In this demo, we use [`@coolwallets/transport-web-ble`](https://github.com/CoolBitX-Technology/coolwallet-js-sdk/tree/master/packages/transport-web-ble) as the bluetooth transport.

[`@coolwallets/wallet`](https://github.com/CoolBitX-Technology/coolwallet-js-sdk/tree/master/packages/cws-wallet) is imported to handle registration, pairing and create a seed with the card.

[`@coolwallets/eth`](https://github.com/CoolBitX-Technology/coolwallet-js-sdk/tree/master/packages/cws-eth) is use to sign eth transactions.
