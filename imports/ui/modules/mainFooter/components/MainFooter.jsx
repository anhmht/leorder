import React from 'react';
import './MainFooter.scss';

import {
  Layout
} from 'antd';


const {
  Footer
} = Layout;

class MainFooter extends React.PureComponent {
  state = {};

  render() {
    return (
      <div>
        <Footer className="layout-footer">
          {/* Whammy.RichKID ©2019 WM-tech */}
        </Footer>
      </div>
    );
  }
}

export default MainFooter;
