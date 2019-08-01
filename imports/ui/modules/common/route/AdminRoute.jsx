import React from 'react';
import { notification } from 'antd';
import {
  func, string, node, oneOfType
} from 'prop-types';
import _get from 'lodash/get';
import { Route, Redirect } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { withCurrentUserContext } from './AppWrapper';
import { ROLES } from '../../../../../lib/enums/roles';
import { ROUTER_PATHS } from '../../../../../lib/enums/general';

class AdminRoute extends React.PureComponent {
  state = {}

  componentDidMount() {
    const role = Meteor.user().roles[0];
    if (role !== ROLES.ADMIN) {
      this.checkPermissonNotification();
    }
  }

  componentDidUpdate(prevProps) {
    const { role } = this.props;
    const { role: prevRole } = prevProps;
    if (role !== prevRole) {
      this.checkPermissonNotification();
    }
  }

  checkPermissonNotification = () => {
    const { role } = this.props;
    if (!role || ![ROLES.ADMIN].includes(role)) {
      notification.error({
        message: 'You don\'t have permission to access this page'
      });
    }
  }

  render() {
    const {
      role, component: Component, ...rest
    } = this.props;
    let roles = null;
    if (Meteor.user()) {
      roles = _get(Meteor.user(), 'roles[0]', '');
    }
    return (
      <Route
        {...rest}
        render={props => (
          roles === ROLES.ADMIN || (role && [ROLES.ADMIN].includes(role)) ? (
            <Component {...props} />
          ) : (
            <Redirect to={ROUTER_PATHS.MAIN_HOMEPAGE} />
          )
        )}
      />
    );
  }
}

AdminRoute.propTypes = {
  component: oneOfType([
    func,
    node,
  ]).isRequired,
  role: string,
};

AdminRoute.defaultProps = {
  role: null,
};

export default withCurrentUserContext(AdminRoute);
