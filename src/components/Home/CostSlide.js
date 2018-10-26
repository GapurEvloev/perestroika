import { h, Component } from 'preact';

import Header from './Header';
import BuyForm from './BuyForm';

import { playAnimations, appSeasonUrl, appRegistartionUrl, trackOutboundLink } from '../../utils';

export class CostSlide extends Component {
  componentWillReceiveProps(nextProps) {
    if (!this.animated && nextProps.isActive) {
      playAnimations(this.container, this.animated);
      this.animated = true;
    }
  }

  render() {
    const query = typeof window !== 'undefined' && window.location.search;
    const registrationUrl = `${appRegistartionUrl}${query}`;

    return (
      <div ref={el => this.container = el} class="slide-content cost-slide">
        <div class="left-gradient">
          <div class="triangle" />
        </div>

        <div class="container">
          <Header
            onNavClick={this.props.onNavClick}
            slides={this.props.slides}
            activeSlideName={this.props.activeSlideName}
          />

          <h2 class="gradient-title animated" data-animation="fadeIn" data-delay="400">
            Взнос за <br />участие
          </h2>

          <div class="slide-content-flex">
            <div class="text">
              <h2 class="animated" data-animation="fadeInRight">Преимущества:</h2>

              <ul class="animated" data-animation="fadeInRight" data-delay="150">
                <li>Честные правила</li>
                <li>Призовой фонд 4 000 000 рублей</li>
                <li>Цена в 2 раза ниже обычного фитнеc марафона</li>
                <li>План питания и тренировок от профессионалов</li>
              </ul>

              <div class="animated" data-animation="fadeInRight" data-delay="300">
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
        </div>
      </div>
    );
  }
}

export default CostSlide;
