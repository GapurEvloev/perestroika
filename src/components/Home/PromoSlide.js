import { h, Component } from 'preact';
import cn from 'classnames';

import Header from './Header';
import BuyForm from './BuyForm';

import { playAnimations, mobileAndTabletCheck, appRegistartionUrl, trackOutboundLink } from '../../utils';

export class PromoSlide extends Component {
  componentDidMount() {
    if ((!window.Ya || typeof window.Ya.share2 !== 'function') && !document.getElementById('yaShareScript')) {
      this.loadScript('//yastatic.net/share2/share.js', () => {
        this.initSharing();
      });
      return;
    }

    this.initSharing();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.animated && nextProps.isActive) {
      playAnimations(this.container, this.animated);
      this.animated = true;
    }

    if (nextProps.isActive && !this.props.isActive && !mobileAndTabletCheck()) {
      window.addEventListener('mousemove', this.paralaxHandler);
    }

    if (!nextProps.isActive && this.props.isActive) {
      window.removeEventListener('mousemove', this.paralaxHandler);
      this.pointerParalax.style.transform = 'none';
    }
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.paralaxHandler);
    this.pointerParalax.style.transform = 'none';

    if (this.request && typeof this.request.abort === 'function') {
      this.request.abort();
    }
  }

  initSharing() {
    if (!this.share) {
      return;
    }

    window.Ya.share2(this.share, {
      content: {
        url: window.location.href
      },
      theme: {
        services: 'vkontakte,facebook,twitter,odnoklassniki'
      }
    });
  }

  loadScript(url, callback) {
    const script = document.createElement('script');
    script.type = 'text/javascript';

    if (script.readyState) {
      script.onreadystatechange = function () {
        if (script.readyState === 'loaded' || script.readyState === 'complete') {
          script.onreadystatechange = null;
          script.id = 'yaShareScript';
          callback();
        }
      };
    } else {
      script.onload = function () {
        script.id = 'yaShareScript';
        callback();
      };
    }

    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  paralaxHandler = event => {
    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window;
    const offsetX = -Math.floor((clientX - innerWidth / 2) * 35 / (innerWidth / 2));
    const offsetY = Math.floor(-(clientY - innerHeight) * 35 / (innerHeight));

    this.pointerParalax.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  };

  goToCostSlide = (event) => {
    event.preventDefault();
    this.props.onNavClick('cost');
  }

  render() {
    const query = typeof window !== 'undefined' && window.location.search;
    const registrationUrl = `${appRegistartionUrl}${query}`;

    return (
      <div ref={el => this.container = el} class="slide-content promo-slide">
        <div ref={el => this.pointerParalax = el} class="flag-girl animated" data-animation="fadeIn" data-delay="400" />
        <div class="container">
          <Header
            hideNav
            logoBtnInactive
            onNavClick={this.props.onNavClick}
            slides={this.props.slides}
            activeSlideName={this.props.activeSlideName}
          />

          <div class="slide-content-flex">
            <div class="text">
              <h1
                class="animated"
                data-animation="fadeInDown"
              >
                Похудей за <span class="big">4 недели</span>{' '}
                и выиграй до <span class="bigger">3 000 000 рублей</span> к Новому году!
              </h1>

              <ul class="animated" data-animation="fadeInDown" data-delay="200">
                <li>Уникальная программа тренировок на каждый день</li>
                <li>Персональный план питания</li>
                <li>Никаких конкурсов на выбывание — шанс на победу есть у каждого!</li>
              </ul>

              <div class="animated" data-animation="fadeInDown" data-delay="400">
                <BuyForm
                  hours={this.props.hours}
                  minutes={this.props.minutes}
                  phone={this.props.phone}
                  success={this.props.success}
                  error={this.props.error}
                  formSubmitHandler={this.props.formSubmitHandler}
                  phoneChangeHandler={this.props.phoneChangeHandler}
                />
              </div>
            </div>
          </div>

          <div class="share-container">
            <button type="button" class="toggle-share-btn">
              Расскажи <br />друзьям
            </button>

            <div class="share-menu-container">
              <div
                ref={el => this.share = el}
                class="share-menu"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PromoSlide;
