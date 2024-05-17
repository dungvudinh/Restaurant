import './App.css';
import {useState} from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Reception from './pages/Reception';
import Cashier from './pages/Cashier';
import Login from './pages/Login';
function App() {
  
  
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* <Route path='/' element={<ClientSide />} exact  /> */}
          <Route path='/reception' element={<Reception />} index/>
          <Route path='/cashier' element={<Cashier />} index/>
          <Route path='/login' element={<Login />} index/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
