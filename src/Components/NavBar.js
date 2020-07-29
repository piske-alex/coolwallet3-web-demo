import React, { useState } from "react";
import { Navbar, Nav } from "react-bootstrap";
import "./NavBar.css";

function MyNavBar() {
  const [activeTab, setActiveTab] = useState("#wallet");

  return (
    <Navbar variant="dark" expand="lg">
      <Nav
        variant="tabs"
        activeKey={activeTab}
        onSelect={(key) => {
          console.log("key :", key);
          setActiveTab(key);
        }}
      >
        <Nav.Item>
          <Nav.Link className="NavItem" href="#wallet">
            Wallet
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="NavItem" href="#utility">
            Utility
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="NavItem" href="#eth">
            ETH
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="NavItem" href="#btc">
            BTC
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="NavItem" href="#xrp">
            XRP
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="NavItem" href="#bch">
            BCH
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </Navbar>
  );
}

export default MyNavBar;
