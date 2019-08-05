import React from 'react';
import 'antd/dist/antd.css';
import { Provider } from 'react-redux';
import { Helmet } from 'react-helmet';
import Routes from '../startup/client/Routes';
import store from './reducers/store/configStore';
import AppWrapper from './modules/common/route/AppWrapper';

const App = () => (
  <Provider store={store}>
    <div className="App">
      <AppWrapper>
        <Routes />
      </AppWrapper>
    </div>
  </Provider>
);

export default App;
