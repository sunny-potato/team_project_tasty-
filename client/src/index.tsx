import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { HashRouter, BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  /* Would prefer to change to server solution if avail instead of hashrouter */
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById('root')
);
