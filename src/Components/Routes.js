import React from "react";
import { HashRouter as Switch, Route, Redirect } from "react-router-dom";
import ManageWallet from "./WalletManagement";
import Setting from "./Setting";
import Utility from "./Utility";
import ETHTest from "./Ethereum";
import XRPTest from "./XRP";
import BitcoinTest from "./Bitcoin";
import BitcoinCashTest from "./BitcoinCash";

function Routes({ appPublicKey, appPrivateKey, transport, appId }) {
  return (
    <Switch>
      <Redirect from='/' to='/setting' />
      <Route
        path="/setting/"
        children={
          <Setting
            transport={transport}
            appPrivateKey={appPrivateKey}
            appPublicKey={appPublicKey}
            appId={appId}
          />
        }
        appId={appId}
      />      <Route
        path="/wallet/"
        children={
          <ManageWallet
            transport={transport}
            appPrivateKey={appPrivateKey}
            appPublicKey={appPublicKey}
            appId={appId}
          />
        }
        appId={appId}
      />
      <Route
        path="/utility/"
        children={
          <Utility
            transport={transport}
            appPrivateKey={appPrivateKey}
            appPublicKey={appPublicKey}
            appId={appId}
          />
        }
        appId={appId}
      />
      <Route
        path="/eth"
        children={
          <ETHTest
            transport={transport}
            appPrivateKey={appPrivateKey}
            appId={appId}
          />
        }
      />
      <Route
        path="/xrp"
        children={
          <XRPTest
            transport={transport}
            appPrivateKey={appPrivateKey}
            appId={appId}
          />
        }
      />
      <Route
        path="/btc"
        children={
          <BitcoinTest
            transport={transport}
            appPrivateKey={appPrivateKey}
            appId={appId}
          />
        }
      />
      {/* <Route
        path="/bch"
        children={
          <BitcoinCashTest
            transport={transport}
            appPrivateKey={appPrivateKey}
            appId={appId}
          />
        }
      /> */}
    </Switch>
  );
}

export default Routes;
