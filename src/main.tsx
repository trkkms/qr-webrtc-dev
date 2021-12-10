import React from 'react';
import ReactDOM from 'react-dom';
import App from 'src/components/app';
import Providers from 'src/components/providers';

ReactDOM.render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>,
  document.getElementById('root'),
);
