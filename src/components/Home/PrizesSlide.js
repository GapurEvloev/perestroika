import { h, Component } from 'preact';

import Header from './Header';
import { playAnimations } from '../../utils';

export class PrizesSlide extends Component {
  state = {
    isHoverBlockOpen: false
  };

  openHoverBlockHandler = (event) => {
    this.setState({
      isHoverBlockOpen: true
    });
  };

  hoverBlockClickHandler = event => {
    this.setState({
      isHoverBlockOpen: false
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!this.animated && nextProps.isActive) {
      playAnimations(this.container, this.animated);
      this.animated = true;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isHoverBlockOpen && !this.state.isHoverBlockOpen) {
      setTimeout(() => {
        document.body.style.cursor = '';
        window.removeEventListener('click', this.hoverBlockClickHandler);
      }, 0);
    }

    if (!prevState.isHoverBlockOpen && this.state.isHoverBlockOpen) {
      setTimeout(() => {
        document.body.style.cursor = 'pointer';
        window.addEventListener('click', this.hoverBlockClickHandler);
      }, 0);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.hoverBlockClickHandler);
  }

  render() {
    return (
      <div ref={el => this.container = el} class="slide-content prizes-slide">
        <div class="right-gradient">
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
              Доска<br /> почета
            </h2>

            <div class="text">
              <h3 class="animated" data-animation="fadeInDown" data-duration="250">
                30 передовиков
              </h3>

              <div class="default-block">
                <div class="main-prizes animated" data-animation="fadeInDown" data-delay="150" data-duration="250">
                  <p>3 приза по</p>

                  <h2>1000 000 <span class="rubl">р</span></h2>

                  <span class="nomination">
                    Самому способному
                  </span>

                  <span class="nomination">
                    Самому сильному
                  </span>

                  <span class="nomination">
                    Самому упорному
                  </span>
                </div>

                <div class="other-prizes animated" data-animation="fadeInDown" data-delay="300" data-duration="250">
                  <p>27 наград по</p>

                  <h2>30 000 <span class="rubl">р</span></h2>

                  <span>оставшимся финалистам</span>
                </div>

                <h3 class="animated" data-animation="fadeInDown" data-delay="450" data-duration="250">
                  Шансы велики!
                </h3>
              </div>

              {(this.state.isHoverBlockOpen) &&
                <div class="hover-block">
                  <h5><b>30</b> финалистов соревнуются за главный приз в 3-х номинациях</h5>

                  <div class="nominations">
                    <div class="nomination">
                      <h4>Cамый способный</h4>
                      <p>Финалист, набравший наибольшее количество баллов в абсолютном значении</p>
                    </div>

                    <div class="nomination">
                      <h4>Cамый сильный</h4>
                      <p>
                        Финалисты выкладывают видео ролики, на которых выполняют 3 разных упражнения на время.{' '}
                        Тот, кто покажет лучший результат, получит приз
                      </p>
                    </div>

                    <div class="nomination">
                      <h4>Cамый упорный</h4>
                      <p>
                        Финалисты выкладывают фото «до» и «после». Тот, кто наберет больше всего голосов, получит приз
                      </p>
                    </div>
                  </div>

                  <p>Каждый финалист, не занявший первое место в одной из номинаций, получает приз 30 000 руб.</p>
                </div>
              }

              <button type="button" class="opne-hover-block-btn" onClick={this.openHoverBlockHandler}>
                Подробнее
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PrizesSlide;
