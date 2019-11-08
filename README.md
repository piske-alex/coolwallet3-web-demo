# CoolWalletS WebApp Demo

![](https://i.imgur.com/THXHkCP.png)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


This is a demo of how to use CoolWalletS SDK to built your own Dapp.

### Install and run
```
npm insatll
```

```
yarn start 
# or
npm start
````

## Notes

In this demo, we use [`@coolwallets/transport-web-ble`]() as the bluetooth transport.

`@coolwallets/wallet` is imported to handle registration, pairing and create a seed with the card.

`@coolwallets/eth` is use to sign eth transactions.