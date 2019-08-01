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
      <Helmet
        title="richkid.club - Open your mind, enrich your style"
        meta={[
          { name: 'author', content: 'richkid.club' },
          { property: 'og:title', content: 'richkid.club' },
          { property: 'og:site_name', content: 'richkid.club' },
          { property: 'og:type', content: 'website' },
          { property: 'og:url', content: 'http://www.richkid.club/' },
          { property: 'og:description', content: 'Open your mind, enrich your style' },
          { property: 'og:image', content: 'http://www.richkid.club/favicon.png' },
          { property: 'og:site_name', content: 'richkid.club' },

          { name: 'viewport', content: 'width=device-width, maximum-scale=1' },
          { name: 'apple-itunes-app', content: 'app-id=1125423676' },
        ]}
      />
      <AppWrapper>
        <Routes />
      </AppWrapper>
    </div>
  </Provider>
);

export default App;
