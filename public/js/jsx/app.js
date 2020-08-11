import React from 'react';
import logo from './logo.svg';
import { Navbar, NavbarBrand } from 'reactstrap';
import Menu from './components/MenuComponent';
import './App.css';

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
