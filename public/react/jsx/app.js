import React from 'react';
import { Navbar, NavbarBrand } from 'reactstrap';
import Menu from './MenuComponent';

function App() {
  return (
    <div className="App">
      <Navbar dark color="primary">
          <div className="container">
            <NavbarBrand href="/">My Little Restraunt</NavbarBrand>
          </div>Fuck me
        </Navbar>
      <Menu />
    </div>
  );
}

export default App;
