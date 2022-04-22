import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { DAppProvider, Rinkeby } from '@usedapp/core';
import { Polygon } from '@usedapp/core';

const chainConfig = {
  readOnlyChainId: Rinkeby.chainId,
  readOnlyUrls: {
    [Polygon.chainId]: 'https://polygon-mumbai.g.alchemy.com/v2/NksJUWKCRZRnKFfp-llyoTcbnjLLBEyo',
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
