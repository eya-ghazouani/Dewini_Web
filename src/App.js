import './App.css';
import { useLocation } from 'react-router-dom';

import Navbar from './Components/Navbar';
import MainRoute from './Routes/MainRoute';


function App() {

  const location = useLocation();
  return (
    <div >
      {location.pathname === '/login' || location.pathname === '/register' ? null : 
        <Navbar />
      }
      <MainRoute />

    </div>
  );
}

export default App;
