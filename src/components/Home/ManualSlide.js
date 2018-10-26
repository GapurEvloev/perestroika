import { h, Component } from 'preact';
import cookie from 'cookie';

import config from '../../config';
import { playAnimations, appRegistartionUrl, trackOutboundLink } from '../../utils';
import Header from './Header';

export class ManualSlide extends Component {
  componentWillReceiveProps(nextProps) {
    if (!this.animated && nextProps.isActive) {
      playAnimations(this.container, this.animated);
      this.animated = true;
    }
  }

  render() {
    const query = typeof window !== 'undefined' && window.location.search;
    const registrationUrl = `${appRegistartionUrl}${query}`;
    let price = config.seasonPrice;

    if (typeof document !== 'undefined' && cookie.parse(document.cookie).landingDiscount) {
      price = config.seasonDiscountPrice;
    }

    return (
      <div ref={el => this.container = el} class="slide-content manual-slide">
        <div class="left-gradient">
          <div class="triangle" />
        </div>

        <div class="container">
          <Header
            onNavClick={this.props.onNavClick}
            slides={this.props.slides}
            activeSlideName={this.props.activeSlideName}
          />

          <div class="slide-content-flex">
            <h2 class="gradient-title animated" data-animation="fadeIn" data-delay="400">
              Инструкция <br/>по применению
            </h2>

            <div class="right-text">
              <div class="steps animated" data-animation="fadeInRight">
                <div class="scroll-hint">
                  <span>Скрольте вниз, что бы узнать подробности</span>
                </div>

                <div class="steps-scroll skipScroll">
                  <div class="step rubl-icon">
                    <h5>Регистрируетесь и оплачиваете участие</h5>
                  </div>

                  <div class="step photo-icon">
                    <h5>Делаете фотокарточку «до», и следите за прогрессом</h5>
                  </div>

                  <div class="two-steps">
                    <div class="step sheet-icon">
                      <h5>Ежедневно получаете планы тренировок и питания</h5>
                    </div>

                    <div class="step thumb-icon">
                      <h5>Набираете баллы за активность и соблюдение режима</h5>
                    </div>
                  </div>

                  <div class="step user-icon">
                    <h5>Стремитесь войти в число 30 передовиков по количеству баллов</h5>
                  </div>

                  <div class="two-steps">
                    <div class="step star-icon">
                      <h5>Показываете лучший результат</h5>
                    </div>

                    <div class="step photo-icon">
                      <h5>Делаете фотокарточку «до/после» и набираете голоса</h5>
                    </div>
                  </div>

                  <div class="step rubl-icon">
                    <h5>Получаете призы в трёх номинациях</h5>
                  </div>
                </div>
              </div>

              <div class="call-to-action animated" data-animation="fadeInRight" data-delay="200">
                <h3>Прямо сейчас за {price} рублей</h3>
                <a
                  href={registrationUrl}
                  class="btn"
                  onClick={trackOutboundLink.bind(this, { event_аction: 'paymentButtonClick' })}
                >
                  Оплатить
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ManualSlide;
