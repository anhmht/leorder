import React from 'react';
import MessengerCustomerChat from 'react-messenger-customer-chat';
import {
  Layout
} from 'antd';
import { node } from 'prop-types';
import MainFooter from '../../mainFooter/components/MainFooter';
import MainHeader from '../../header/components/MainHeader';
import './MainLayout.scss';

const { Content } = Layout;
class MainLayout extends React.PureComponent {
  static propTypes = {
    children: node,
  }

  static defaultProps = {
    children: null,
  }

  state = {};

  render() {
    const { children } = this.props;

    return (
      <div>
        <Layout className="wm-hb-layout-container">
          <MainHeader />
          <Layout>
            <Content>
              {children}
            </Content>
          </Layout>
          <MainFooter />
        </Layout>
      </div>
    );
  }
}

export default MainLayout;
