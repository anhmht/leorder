import React from 'react';
import withSizes from 'react-sizes';
import { compose } from 'recompose';
import { withTracker } from 'meteor/react-meteor-data';
import { connect } from 'react-redux';
import {
  node, string, func
} from 'prop-types';
import { bindActionCreators } from 'redux';
import {
  Layout, Menu, Icon,
} from 'antd';
import _pick from 'lodash/pick';
import ActionCreators from '/imports/ui/actions';
import { ROUTER_PATHS } from '../../../../../lib/enums/general';
import { withCurrentUserContext } from '../../common/route/AppWrapper';

const {
  Header, Content, Sider, Footer
} = Layout;

class AdminLayout extends React.PureComponent {
  static propTypes = {
    userId: string,
    routerPush: func.isRequired,
    pathname: string,
    children: node,
  }

  static defaultProps = {
    userId: '',
    pathname: '',
    children: null,
  }

  state = {
  };

  componentWillReceiveProps(nextProps) {
    const { userId, routerPush } = this.props;
    const { userId: nextUserId } = nextProps;
    if (!nextUserId && userId) {
      routerPush(ROUTER_PATHS.MAIN_HOMEPAGE);
    }
  }

  handleChangeRoute = (route) => {
    const { routerPush } = this.props;
    routerPush(route);
  }

  handleLogout = () => {
    this.handleChangeRoute(ROUTER_PATHS.MAIN_HOMEPAGE);
    Meteor.logout();
  }

  render() {
    const { children, pathname } = this.props;
    return (
      <div>
        <Layout>
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
          >
            <div className="logo" />
            <Menu theme="dark" mode="inline" selectedKeys={[pathname]}>
              <Menu.Item
                key={ROUTER_PATHS.ADMIN_DASHBOARD}
                onClick={() => this.handleChangeRoute(ROUTER_PATHS.ADMIN_DASHBOARD)}
              >
                <Icon type="global" />
                <span>Product</span>
              </Menu.Item>
              <Menu.Item
                key={ROUTER_PATHS.ADMIN_CATEGORY}
                onClick={() => this.handleChangeRoute(ROUTER_PATHS.ADMIN_CATEGORY)}
              >
                <Icon type="database" />
                <span>Category</span>
              </Menu.Item>
              <Menu.Item
                key="3"
                onClick={() => this.handleLogout()}
              >
                <Icon type="logout" />
                <span>Logout</span>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Header className="header-container" style={{ position: 'initial' }}>
              <div className="header-title">rich-kid.club</div>
            </Header>
            <Content style={{
              position: 'relative',
              background: '#fff',
              padding: 24,
              margin: 0,
              minHeight: 'calc(100vh - 88px)',
            }}
            >
              {
                  children
                }
            </Content>
            <Footer className="layout-footer">
          Whammy.RichKID ©2019 WM-tech
            </Footer>
          </Layout>
        </Layout>
      </div>

    );
  }
}

const mapStateToProps = state => ({
  pathname: state.router.location.pathname,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  _pick(ActionCreators, [
    'routerPush',
  ]), dispatch,
);

const mapSizesToProps = ({ width }) => ({
  isMobile: width <= 780,
});


export default compose(
  withSizes(mapSizesToProps),
  withCurrentUserContext,
  connect(mapStateToProps, mapDispatchToProps),
  withTracker(() => {
    const userId = Meteor.userId();
    const currentUser = Meteor.user();
    return {
      userId,
      currentUser,
    };
  }),
)(AdminLayout);
