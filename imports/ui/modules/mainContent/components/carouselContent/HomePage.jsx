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

class HomePage extends React.PureComponent {
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
    return (
      <div>
        <Content className="main-content-cotainer">
          <div className="carousel-container">
            <Carousel autoplay>
              <div>
                <h3>1</h3>
              </div>
              <div>
                <h3>2</h3>
              </div>
              <div>
                <h3>3</h3>
              </div>
              <div>
                <h3>4</h3>
              </div>
            </Carousel>
            <h1 className="title">MUA HỘ - SHIP HÀNG MỸ</h1>
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
  withTracker(() => ({
    products: [],
    isLoading: true
  }))
)(HomePage);
