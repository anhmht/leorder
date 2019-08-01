import React from 'react';
import './DetailObj.scss';
import {
  shape, func
} from 'prop-types';
import { Button, Layout, notification } from 'antd';
import { Helmet } from 'react-helmet';
import { Meteor } from 'meteor/meteor';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';
import _pick from 'lodash/pick';
import ActionCreators from '/imports/ui/actions';
import { connect } from 'react-redux';
import Slide from 'react-reveal/Slide';
import Spin from 'react-reveal/Spin';
import { ROUTER_PATHS } from '../../../../../../lib/enums/general';

const {
  Content
} = Layout;

class DetailObj extends React.PureComponent {
  static propTypes = {
    match: shape().isRequired,
    routerPush: func.isRequired,
  }

  state = {
    detailObj: null,
  }

  componentDidMount() {
    const { match: { params: { code } } } = this.props;

    Meteor.call('product.getProductByCode', code, (error, product) => {
      if (error) {
        notification.error({
          message: 'Fail',
          description: 'Get product fail',
          duration: 3.0,
        });
        this.onBackFromDetail();
      } else {
        this.setState({
          detailObj: product
        });
      }
    });
  }

  onBackFromDetail = () => {
    const { routerPush } = this.props;
    routerPush(ROUTER_PATHS.MAIN_HOMEPAGE);
  };

  render() {
    const { detailObj } = this.state;
    const obj = !detailObj
      ? <div />
      : (
        <div>
          <Helmet
            title={detailObj.title}
            meta={[
              { name: 'author', content: 'richkid.club' },
              { property: 'og:title', content: detailObj.title },
              { property: 'og:site_name', content: 'richkid.club' },
              { property: 'og:type', content: 'website' },
              { property: 'og:url', content: `http://www.richkid.club/sneaker/${detailObj.code}` },
              { property: 'og:description', content: detailObj.description },
              { property: 'og:image', content: detailObj.rawBgUrl },
              { property: 'og:site_name', content: 'richkid.club' },
              { property: 'og:image:width', content: '400' },
              { property: 'og:image:height', content: '400' },
              { name: 'viewport', content: 'width=device-width, maximum-scale=1' },
              { name: 'apple-itunes-app', content: 'app-id=1125423676' },
            ]}
          />
          <Content className="main-content-cotainer">
            <Spin>
              <div className="cancel-btn">
                <Button shape="circle" icon="close" onClick={this.onBackFromDetail} />
              </div>
            </Spin>
            <div className="detail-container">
              <Slide bottom>
                <div
                  className="image-container"
                  style={{
                    background: detailObj.bgUrl
                  }}
                />
                <div className="detail-info-container">
                  <h1 className="detail-title">{detailObj.title}</h1>
                  <div className="detail-price">{`$ ${detailObj.availables[0].price}  - Available: ${detailObj.availables[0].size} US`}</div>
                  <div className="detail-description">{detailObj.description}</div>
                </div>
              </Slide>
            </div>
          </Content>
        </div>
      );
    return (
      <div>
        {obj}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators(
  _pick(ActionCreators, [
    'routerPush',
  ]), dispatch,
);

export default compose(
  connect(null, mapDispatchToProps),
)(DetailObj);
