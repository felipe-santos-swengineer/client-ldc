import React from 'react';
import ReactDOM from 'react-dom';
import Routes from "./routes";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Global from "./styles/global";



ReactDOM.render(
  <React.StrictMode>
    <Global />
    <Routes />
  </React.StrictMode>,
  document.getElementById('root')
);
