import React from 'react';

import Nav from 'react-bootstrap/Nav';
import { useHistory } from 'react-router-dom';

function MyNavBar() {
  const history = useHistory();

  return (
    <Nav>
      <Nav.Item>
        <Nav.Link
          onClick={() => {
            history.push('wallet');
          }}
        >
          Wallet
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          onClick={() => {
            history.push('eth');
          }}
        >
          ETH (MegaWallet)
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          onClick={() => {
            history.push('btc');
          }}
        >
          BTC
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default MyNavBar;
