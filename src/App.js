import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import PDF from './components/pdf';

class App extends Component {
  render() {
    return (
      <div className="App">
        <PDF/>
      </div>
    );
  }
}

export default App;
