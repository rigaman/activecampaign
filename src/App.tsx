import React from 'react';
import './App.css';
import Contacts from "./components/Contacts";


function App() {
  return (
    <div className="App">
      <Contacts data-testid="contacts"/>
    </div>
  );
}

export default App;
