import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ProvideContext } from './Hooks/SocketContext';

ReactDOM.render(
  <ProvideContext >
    <BrowserRouter >
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </BrowserRouter>
  </ProvideContext>,
  document.getElementById('root')
);

