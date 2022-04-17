import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { DAppProvider, Rinkeby } from '@usedapp/core';
import { Polygon } from '@usedapp/core';

const chainConfig = {
  readOnlyChainId: Rinkeby.chainId,
  readOnlyUrls: {
    [Polygon.chainId]: 'https://eth-rinkeby.alchemyapi.io/v2/K7c5PR2jtHaK2G_kpNVF7k4D8scMCCvg',
  },
}


ReactDOM.render(
  <React.StrictMode>
    <DAppProvider config={chainConfig}>
      <App />
    </DAppProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
