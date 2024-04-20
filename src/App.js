import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Reception from './pages/Reception';
import Cashier from './pages/Cashier';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/reception' element={<Reception />} index/>
          <Route path='/cashier' element={<Cashier />} index/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
