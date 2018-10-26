import { h, Component } from 'preact';
import cn from 'classnames';

import Header from './Header';
import faq from '../../assets/faq.json';
import { playAnimations, appFaqUrl } from '../../utils';

const allGroups = [
  {
    title: 'Участие',
    link: 'https://app.perestroika.fit/faq/#participation'
  },
  {
    title: 'Оплата',
    link: 'https://app.perestroika.fit/faq/#payment'
  },
  {
    title: 'Баллы и призы',
    link: 'https://app.perestroika.fit/faq/#points'
  },
  {
    title: 'Тренировки и питание',
    link: 'https://app.perestroika.fit/faq/#training'
  }
];

class Question extends Component {
  state = {
    opened: false
  };

  handleOpenClick = () => {
    this.setState({ opened: !this.state.opened });
  };

  outsideClickHandler = () => {
    if (this.container && !this.container.contains(event.target) && this.state.opened) {
      this.setState({ opened: false });
    }
  };

  componentDidMount() {
    window.addEventListener('click', this.outsideClickHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.outsideClickHandler);
  }

  render() {
    const { question, answer } = this.props;
    const containerClass = cn('question', { opened: this.state.opened });

    return (
      <div ref={el => this.container = el} class={containerClass}>
        <div class="overlay">
          <button
            type="button"
            onClick={this.handleOpenClick}
            dangerouslySetInnerHTML={{ __html: question }}
          />
        </div>

        <p dangerouslySetInnerHTML={{ __html: answer }} />
      </div>
    );
  }
}

export class FAQSlide extends Component {
  state = {
    showAll: false,
    mobile: false
  };

  componentDidMount() {
    window.addEventListener('resize', this.windowResizeHandler);

    this.setState({
      mobile: this.isMobile()
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!this.animated && nextProps.isActive) {
      playAnimations(this.container, this.animated);
      this.animated = true;
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.windowResizeHandler);
  }

  toggleShowAllHanlder = (event) => {
    this.setState({
      showAll: !this.state.showAll
    });
  };

  windowResizeHandler = () => {
    if (this.state.mobile !== this.isMobile()) {
      this.setState({
        mobile: this.isMobile()
      });
    }
  };

  isMobile() {
    return window.innerWidth < 768;
  }

  render() {
    const items = generateItems(faq, this.state.showAll, this.state.mobile);

    return (
      <div ref={el => this.container = el} class="slide-content faq-slide">
        <div class="container">
          <Header
            onNavClick={this.props.onNavClick}
            slides={this.props.slides}
            activeSlideName={this.props.activeSlideName}
          />

          <div class="slide-content-flex">
            <h2 class="animated" data-animation="fadeInDown">Справочное бюро</h2>

            <ul class="row questions animated" data-animation="fadeInUp">
              {items.map((item, i) =>
                <li key={i} class="col">{item}</li>
              )}
            </ul>

            <div>
              {(!this.state.showAll && !this.state.mobile) &&
                <button type="button" class="btn" onClick={this.toggleShowAllHanlder}>
                  Еще
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FAQSlide;

function generateItems(groups, showAll, mobile) {
  if (mobile) {
    return allGroups.map(group =>
      <h3>
        <a href={group.link} title={group.title} target="_blank" rel="noopener noreferrer">{group.title}</a>
      </h3>
    )
  }

  const items = [];
  let maxLength = 0;

  for (const group of groups) {
    if (group.items.length > maxLength) {
      maxLength = group.items.length;
    }

    items.push(<h3 dangerouslySetInnerHTML={{ __html: group.title }} />);
  }

  for (let index = 0; index < maxLength; index++) {
    for (const group of groups) {
      const item = group.items[index];
      items.push(item && (item.showAlways || showAll) && <Question {...item} />);
    }
  }

  return items;
}
