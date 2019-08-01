import React from 'react';
import _omit from 'lodash/omit';
import _get from 'lodash/get';
import { Icon, Spin } from 'antd';
import { withTracker } from 'meteor/react-meteor-data';
import { element, bool, shape } from 'prop-types';

const CurrentUserContext = React.createContext('currentUserContext');

export function withCurrentUserContext(Component) {
  return function WrapperComponent(props) {
    return (
      <CurrentUserContext.Consumer>
        {state => <Component {...props} {...state} />}
      </CurrentUserContext.Consumer>
    );
  };
}

class AppWrapper extends React.PureComponent {
  static propTypes = {
    children: element.isRequired,
    userDataHandlerLoading: bool.isRequired,
    userData: shape(),
  }

  static defaultProps = {
    userData: null,
  }

  state = {

  }

  getChildrens = () => {
    const { children } = this.props;
    const props = _omit(this.props, 'children');
    return React.Children.map(children, child => React.cloneElement(child, { ...props }));
  };

  render() {
    const { userDataHandlerLoading, userData } = this.props;
    const childrens = this.getChildrens();
    return (
      <CurrentUserContext.Provider value={
        {
          userData,
          userId: _get(userData, '_id'),
          role: _get(userData, 'roles[0]')
        }}
      >
        <Spin
          spinning={userDataHandlerLoading}
          indicator={(
            <Icon type="loading" style={{ fontSize: 24 }} spin />
        )}
        >
          {userDataHandlerLoading ? (
            <div style={{
              width: '100vw',
              height: '100vh'
            }}
            />
          ) : childrens}
        </Spin>
      </CurrentUserContext.Provider>

    );
  }
}


const AppWrapperContainer = withTracker(() => {
  const userDataHandler = Meteor.subscribe('user.currentUserData');
  const userDataHandlerLoading = !userDataHandler.ready();
  return {
    userDataHandlerLoading,
    userData: Meteor.user(),
  };
})(AppWrapper);

export default AppWrapperContainer;
