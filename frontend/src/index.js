import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { PrivyProvider } from '@privy-io/react-auth';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
      <PrivyProvider
        appId={process.env.REACT_APP_PRIVY_APP_ID}
        clientId={process.env.REACT_APP_PRIVY_CLIENT_ID}
        config={{
            loginMethods: ['email', 'google', 'passkey'],
            embeddedWallets: { createOnLogin: 'all-users' }
        }}
      >
        <App />
      </PrivyProvider>
    </React.StrictMode>
  );
