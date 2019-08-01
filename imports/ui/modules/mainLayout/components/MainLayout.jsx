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
        <MessengerCustomerChat
          pageId="1330430287107877"
          appId="1191480251034518"
          themeColor="#fedc59"
          loggedInGreeting="Hi! Mình đang có Nike Earth Day Collection, bạn muốn sở hữu bộ sưu tập không?"
          loggedOutGreeting="Hi! Mình đang có Nike Earth Day Collection, bạn muốn sở hữu bộ sưu tập không?"
        />
      </div>
    );
  }
}

export default MainLayout;
