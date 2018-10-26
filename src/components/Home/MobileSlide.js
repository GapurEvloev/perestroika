import { h, Component } from 'preact';

import Header from './Header';
import Footer from './Footer';

import { playAnimations } from '../../utils';

export class MobileSlide extends Component {
  componentWillReceiveProps(nextProps) {
    if (!this.animated && nextProps.isActive) {
      playAnimations(this.container, this.animated);
      this.animated = true;
    }
  }

  render() {
    return (
      <div ref={el => this.container = el} class="slide-content mobile-slide">
        <div class="container">
          <Header
            hideNav
            onNavClick={this.props.onNavClick}
            slides={this.props.slides}
            activeSlideName={this.props.activeSlideName}
          />

          <div class="slide-content-flex">
            <div class="center">
              <div class="text">
                <h2 class="animated" data-animation="fadeInLeft">Зож в твоем кармане!</h2>

                <ul class="advantages-list animated" data-animation="fadeInLeft" data-delay="100">
                  <li class="control">Ежедневные рекомендации по тренировкам и питанию</li>
                  <li class="interface">Адаптивная программа тренировок</li>
                  <li class="notifications">Напоминания в режиме реального времени</li>
                </ul>

                <p class="animated" data-animation="fadeInLeft" data-delay="200">
                  С нашим мобильным приложением ты готов к физкульт-подвигам{' '}
                  всегда и везде. Все самое полезное – в твоем смартфоне.
                </p>

                <h2 class="soon">Скоро!</h2>

                {/*
                <div class="apps-links animated" data-animation="fadeInLeft" data-delay="300">
                  <a
                    href="https://play.google.com/store"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="google-play-link"
                  >
                    Google Play
                  </a>

                  <a
                    href="https://www.apple.com/ru/ios/app-store/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="app-store-link"
                  >
                    App Store
                  </a>
                </div>
                */}
              </div>

              <div class="phones-preview animated" data-animation="fadeInRight" data-delay="400">
                <div class="phone1" />
                <div class="phone2" />
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

export default MobileSlide;
