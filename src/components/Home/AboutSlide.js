import { h, Component } from 'preact';

import Header from './Header';
import ModalBox from './ModalBox';
import config from '../../config';

import { playAnimations } from '../../utils';

export class AboutSlide extends Component {
  videoId = config.aboutVideoId;
  state = {
    showVideo: false
  };

  componentWillReceiveProps(nextProps) {
    if (!this.animated && nextProps.isActive) {
      playAnimations(this.container, this.animated);
      this.animated = true;
    }
  }

  openVideo = event => {
    event.preventDefault();
    this.setState({
      showVideo: true
    });
  };

  closeVideo = () => {
    this.setState({
      showVideo: false
    });
  };

  render() {
    return (
      <div ref={el => this.container = el} class="slide-content about-slide">
        <div class="container">
          <Header
            onNavClick={this.props.onNavClick}
            slides={this.props.slides}
            activeSlideName={this.props.activeSlideName}
          />

          <div class="slide-content-flex">
            <h2 class="animated" data-animation="fadeInDown">
              За фигуру и грацию получайте овации!
            </h2>

            <div class="columns">
              <div class="col text-block">
                <div class="columns">
                  <div class="col animated" data-animation="fadeInLeft" data-delay="200">
                    <h3>Будем выдавать вам планы занятий — каждому по потребностям!</h3>
                  </div>

                  <div class="col animated" data-animation="fadeInRight" data-delay="100">
                    <h3>Будем награждать вас за упорство — каждого по способностям!</h3>
                  </div>
                </div>

                <p class="animated" data-animation="fadeInUp" data-delay="400">
                  Перестройка — это настрой на долгосрочный результат,{' '}
                  это разумная система отбора финалистов! Подсушим вас внешне,{' '}
                  но не иссушим внутренне — всем мир, спорт и никаких бешеных гонок на похудение!
                </p>
              </div>

              <div class="col tv-block">
                <div class="tv">
                  <button
                    type="button"
                    class="tv-screen"
                    style={{ backgroundImage: `url(/assets/about-video-preview.jpg)` }}
                    onClick={this.openVideo}
                  >
                    <div>
                      <div>
                        <div class="tv-play" />
                        Смотреть видео
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {(this.state.showVideo) &&
          <ModalBox close={this.closeVideo}>
            <div class="iframe-wrapper">
              <iframe
                width="1024"
                height="768"
                src={`https://www.youtube.com/embed/${this.videoId}?rel=0&amp;showinfo=0;autoplay=1`}
                frameborder="0"
                allowfullscreen
              />

              <button
                type="button"
                class="close-video-modal-btn"
                onClick={this.closeVideo}
              />
            </div>
          </ModalBox>
        }
      </div>
    );
  }
}

export default AboutSlide;
