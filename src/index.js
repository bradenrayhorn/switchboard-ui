import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import axios from "axios";
import {getToken, isLoggedIn} from "./utils/user";
import urls from "./constants/urls";

axios.defaults.baseURL = urls.coreBase;

axios.interceptors.request.use(
  config => {
    if (isLoggedIn()) {
      const token = getToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.log(error);
  }
);

ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById('root')
);
