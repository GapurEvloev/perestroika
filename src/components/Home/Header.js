import { h, Component } from 'preact';
import cn from 'classnames';

export class Header extends Component {
  state = {
    isMobileNavOpen: false,
    windowWidth: 0
  };

  onNavClickHandler = (slideName, event) => {
    event.preventDefault();
    this.props.onNavClick(slideName);
  };

  toggleMobileNavHandler = () => {
    this.setState({
      isMobileNavOpen: !this.state.isMobileNavOpen
    });
  };

  onWindowResizeHandler = () => {
    if (this.state.windowWidth !== window.innerWidth) {
      this.setState({
        windowWidth: window.innerWidth
      });
    }
  };

  onWindowScrollHandler = () => {
    if (this.state.isMobileNavOpen) {
      this.closeMobileNav()
    }
  };

  onWindowClicKHandler = event => {
    if (!this.navElem.contains(event.target)) {
      this.closeMobileNav();
    }
  };

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResizeHandler);
    window.addEventListener('scroll', this.onWindowScrollHandler);
    this.setState({
      windowWidth: window.innerWidth
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.activeSlideName !== nextProps.activeSlideName && this.state.isMobileNavOpen) {
      this.closeMobileNav()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    setTimeout(() => {
      if (!prevState.isMobileNavOpen && this.state.isMobileNavOpen) {
        document.body.style.cursor = 'pointer';
        window.addEventListener('click', this.onWindowClicKHandler);
      }

      if (prevState.isMobileNavOpen && !this.state.isMobileNavOpen) {
        document.body.style.cursor = '';
        window.removeEventListener('click', this.onWindowClicKHandler);
      }
    }, 0);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResizeHandler);
    window.removeEventListener('scroll', this.onWindowScrollHandler);
  }

  closeMobileNav() {
    this.setState({
      isMobileNavOpen: false
    });
  };

  render() {
    return (
      <div class="header">
        {(!this.props.logoBtnInactive) &&
          <button type="button" class="logo" onClick={this.onNavClickHandler.bind(this, 'promo')} />
        }

        {(this.props.logoBtnInactive) &&
          <span class="logo" />
        }

        {(!this.props.hideNav || this.state.windowWidth < 768) &&
          <div ref={el => this.navElem = el} class={cn('nav', { 'mobile-open': this.state.isMobileNavOpen })}>
            <ul class="nav-list">
              {this.props.slides.map(slide =>
                <li key={slide.name} class="nav-list-item">
                  <button
                    type="button"
                    onClick={this.onNavClickHandler.bind(this, slide.name)}
                    class={cn('nav-link', {
                      active: this.props.activeSlideName === slide.name
                    })}
                  >
                    {slide.title}
                  </button>
                </li>
              )}
            </ul>
          </div>
        }

        <button
          type="button"
          class="toggle-mobile-nav-btn"
          onClick={this.toggleMobileNavHandler}
        />
      </div>
    );
  }
}

export default Header;
