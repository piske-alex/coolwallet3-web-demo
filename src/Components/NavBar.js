import React from 'react';

import { Navbar, Nav } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

function MyNavBar(props) {
  const history = useHistory();

  return (
		<Navbar bg='light' expand='lg'>
			<Navbar.Brand href="#home">Navbar</Navbar.Brand>
			<Nav variant='tabs'>
			  <Nav.Item>
			    <Nav.Link
			      onClick={() => {
			        history.push('wallet');
			      }}
			    >
			      Wallet
						{props.cardName}
			    </Nav.Link>
			  </Nav.Item>
			  <Nav.Item>
			    <Nav.Link
			      onClick={() => {
			        history.push('eth');
			      }}
			    >
			      ETH
			    </Nav.Link>
			  </Nav.Item>
			</Nav>
		</Navbar>
  );
}

export default MyNavBar;
