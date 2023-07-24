import React from 'react';
import ReactDOM from "react-dom/client";
import { Provider } from 'react-redux';
//import App from './App';
import store from './store';
import ThemeProvider from "themes/ThemeProvider";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import Router from 'router/Router';


const persistor = persistStore(store);

const rootElement = document.getElementById('root')

const root = ReactDOM.createRoot(rootElement!);
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider> 
          <Router />
        </ThemeProvider> 
      </PersistGate>
    </Provider>
  // </React.StrictMode>
);