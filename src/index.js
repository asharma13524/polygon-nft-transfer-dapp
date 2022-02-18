import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { DAppProvider } from '@usedapp/core';
import { Polygon, Config } from '@usedapp/core';

const config: Config = {
  readOnlyChainId: Polygon.chainId,
  readOnlyUrls: {
    [Polygon.chainId]: '',
  },
}


ReactDOM.render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <App />
    </DAppProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
