import React from 'react';
import './CarouselContent.scss';
import {
  Carousel,
  Tooltip,
  Button,
  Layout
} from 'antd';
import Slide from 'react-reveal/Slide';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';
import _pick from 'lodash/pick';
import ActionCreators from '/imports/ui/actions';
import { connect } from 'react-redux';
import { withTracker } from 'meteor/react-meteor-data';
import {
  shape, arrayOf, bool, func
} from 'prop-types';
import { Meteor } from 'meteor/meteor';
import Products from '../../../../../../lib/collections/products';

const GUIDE_CLASS = 'wm-guide';

const {
  Content
} = Layout;

class CarouselContent extends React.PureComponent {
  static propTypes = {
    isLoading: bool.isRequired,
    routerPush: func.isRequired,
    products: arrayOf(shape()).isRequired
  }

  constructor(props) {
    super(props);
    // this.state = props.carouselData;
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.carousel = React.createRef();
    this.tooltip = React.createRef();
    setTimeout(() => this.setState({ guideClass: '' }), 2000);
  }

  state = {
    guideClass: GUIDE_CLASS,
  };

  showGuideClass = () => {
    const { guideClass } = this.state;
    if (guideClass) {
      return;
    }
    this.setState({ guideClass: GUIDE_CLASS });
    setTimeout(() => this.setState({ guideClass: '' }), 2000);
  }


  onClickDetail = (val) => {
    const { routerPush } = this.props;
    routerPush(`/sneaker/${val.code}`);
  };

  next() {
    const { guideClass } = this.state;

    if (guideClass) {
      return;
    }
    this.carousel.next();
  }

  prev() {
    const { guideClass } = this.state;
    if (guideClass) {
      return;
    }
    this.carousel.prev();
  }

  render() {
    const { guideClass } = this.state;
    const { products } = this.props;
    return (
      <div>
        <Content className="main-content-cotainer">
          <div className={`guid-btn ${guideClass}`}>
            <Tooltip
              visible={!!guideClass}
              ref={node => (this.tooltip = node)}
              placement="right"
              title="Click the product's name panel to go detail"
            >
              <Button shape="circle" icon="question" onClick={this.showGuideClass} />
            </Tooltip>
          </div>
          <div className="carousel-container">
            <Slide top>
              <Carousel ref={node => (this.carousel = node)}>
                {products.map(product => (
                  <div key={product._id} className="item-content">
                    <div role="presentation" className={`item-description ${guideClass}`} onClick={() => this.onClickDetail(product)}>
                      <div className="item-description-content">
                        {product.title}
                      </div>
                    </div>
                    <div
                      className="item-bg"
                      style={{
                        background: product.bgUrl
                      }}
                    >
                      <div className="cs-navigation-container">
                        <div role="presentation" onClick={() => this.prev()} className={`cs-prev ${guideClass}`}>
                          <div className="guide-label">PREVIOUS</div>
                        </div>
                        <div role="presentation" onClick={() => this.next()} className={`cs-next ${guideClass}`}>
                          <div className="guide-label">NEXT</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Carousel>
            </Slide>
          </div>
        </Content>
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
  withTracker(() => {
    const handleProduct = Meteor.subscribe('product.getListProduct');
    if (handleProduct.ready()) {
      const products = Products.find({
        isFeature: true,
        isPublish: true
      }).fetch();
      return {
        products,
        isLoading: !handleProduct.ready()
      };
    }
    return {
      products: [],
      isLoading: true
    };
  })
)(CarouselContent);
