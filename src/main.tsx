import React from 'react';
import ReactDOM from 'react-dom';
import App from 'src/components/app';
import Providers from 'src/components/providers';
import { registerSW } from 'virtual:pwa-register';

registerSW();

ReactDOM.render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>,
  document.getElementById('root'),
);
