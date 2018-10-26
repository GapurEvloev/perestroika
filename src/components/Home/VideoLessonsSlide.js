import { h, Component } from 'preact';

import Header from './Header';
import ModalBox from './ModalBox';
import config from '../../config';

import { playAnimations } from '../../utils';

export class VideoLessonsSlide extends Component {
  videoId = config.videoLessonsVideoId;

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
      <div ref={el => this.container = el} class="slide-content video-lessons-slide">
        <div class="container">
          <Header
            onNavClick={this.props.onNavClick}
            slides={this.props.slides}
            activeSlideName={this.props.activeSlideName}
          />

          <div class="slide-content-flex">
            <h2 class="animated" data-animation="fadeInDown">
              Займемся физкультурой!
            </h2>

            <div class="vertical-align-center">
              <div class="col tv-block">
                <div class="tv">
                  <button
                    type="button"
                    class="tv-screen"
                    style={{ backgroundImage: `url(/assets/video-lessons-video-preview.jpg)` }}
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

              <div class="col text-block">
                <h3 class="animated" data-animation="fadeInRight" data-delay="100">
                  Труд крут!
                </h3>
                <p  class="animated" data-animation="fadeInRight" data-delay="300">
                  Наши видеоуроки помогут вам сделать упражнения правильно – настоящие{' '}
                  спортсмены покажут все просто, доступно и информативно!
                </p>
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

export default VideoLessonsSlide;
