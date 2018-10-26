import { h, Component } from 'preact';
import { Router } from 'preact-router';
import cn from 'classnames';

import Home from './Home';

import { mobileAndTabletCheck } from '../utils';

export default class App extends Component {
  state = {
    isMobile: false
  };

  handleRoute = e => {
    this.currentUrl = e.url;
  };

  componentDidMount() {
    this.setState({
      isMobile: mobileAndTabletCheck()
    });
  }

  render() {
    return (
      <div class={cn('root', { 'mobile-browser': this.state.isMobile })}>
        <Router onChange={this.handleRoute}>
          <Home path="/" />
        </Router>
      </div>
    );
  }
}
