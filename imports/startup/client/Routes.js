import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import MessengerCustomerChat from 'react-messenger-customer-chat';
import { history } from '../../ui/reducers/store/configStore';
import { ROUTER_PATHS } from '../../../lib/enums/general';
import HomePage from '../../ui/modules/mainContent/components/carouselContent/HomePage';
import CarouselContent from '../../ui/modules/mainContent/components/carouselContent/CarouselContent';
import DetailObj from '../../ui/modules/mainContent/components/detailObj/DetailObj';
import AdminLayout from '../../ui/modules/adminLayout/components/AdminLayout';
import ProductPage from '../../ui/modules/product/components/ProductPage';
import GeneralModal from '../../ui/modules/common/modal/GeneralModal';
import MainLayout from '../../ui/modules/mainLayout/components/MainLayout';
import AdminRoute from '../../ui/modules/common/route/AdminRoute';
import CategoryPage from '../../ui/modules/category/components/CategoryPage';

const Admin = () => (
  <AdminLayout>
    <Switch>
      <AdminRoute exact path={ROUTER_PATHS.ADMIN_DASHBOARD} component={ProductPage} />
      <AdminRoute exact path={ROUTER_PATHS.ADMIN_CATEGORY} component={CategoryPage} />
    </Switch>
  </AdminLayout>
);

const Main = () => (
  <MainLayout>
    <Switch>
      <Route exact path={ROUTER_PATHS.MAIN_HOMEPAGE} component={HomePage} />
    </Switch>
    <MessengerCustomerChat
      pageId="376839595842757"
      appId="419255595205415"
      themeColor="#ef9f1b"
      loggedOutGreeting="Xin chào! Chúng tôi có thể giúp gì được cho bạn?"
    />
  </MainLayout>
);

const Routes = () => (
  <ConnectedRouter history={history}>
    <div>
      <GeneralModal />
      <Switch>
        <Route path={ROUTER_PATHS.ADMIN_DASHBOARD} component={Admin} />
        <Route path={ROUTER_PATHS.MAIN_HOMEPAGE} component={Main} />
      </Switch>
    </div>
  </ConnectedRouter>
);

export default Routes;
