/* eslint-disable */
import { h, Component } from 'preact';
import cn from 'classnames';
import normalizeWheel from 'normalize-wheel';
import cookie from 'cookie';

import config from '../../config';
import { preventEvent, debouncer, scrollFromTop, getElementBound } from '../../utils';
import PromoSlide from './PromoSlide';
import AboutSlide from './AboutSlide';
import ManualSlide from './ManualSlide';
import PrizesSlide from './PrizesSlide';
import CostSlide from './CostSlide';
import MobileSlide from './MobileSlide';
import VideoLessonsSlide from './VideoLessonsSlide';
import FAQSlide from './FAQSlide';

const slides = [
  {
    name: 'promo',
    title: 'Промо',
    inNav: false,
    content: PromoSlide
  },
  {
    name: 'about',
    title: 'О проекте',
    inNav: true,
    content: AboutSlide
  },
  {
    name: 'manual',
    title: 'Как участвовать?',
    inNav: true,
    content: ManualSlide
  },
  {
    name: 'prizes',
    title: 'Призы',
    inNav: true,
    content: PrizesSlide
  },
  {
    name: 'cost',
    title: 'Стоимость',
    inNav: true,
    content: CostSlide
  },
  {
    name: 'video-lessons',
    title: 'Видео уроки',
    inNav: false,
    content: VideoLessonsSlide
  },
  {
    name: 'faq',
    title: 'Вопросы',
    inNav: true,
    content: FAQSlide
  },
  {
    name: 'mobile',
    title: 'Приложение',
    inNav: false,
    content: MobileSlide
  }
];

const skipKeyTargetsTags = ['TEXTAREA', 'INPUT', 'SELECT'];

function isSafari() {
  const ua = window.navigator.userAgent.toLowerCase();
  return ua.indexOf('safari') > -1 && ua.indexOf('chrome') < 0;
}

class Slide extends Component {
  render() {
    return (
      <div
        ref={el => this.elem = el}
        id={this.props.name}
        class={cn('home-page-slide', {
          active: this.props.isActive
        })}
      >
        {this.props.children}
      </div>
    );
  }
}

export default class Home extends Component {
  isSafari = false;
  slides = slides.slice(0);

  preventScroll = false;
  slideAnimationRuning = false;
  touchScrolling = false;
  lastScrollDirection = 0;
  lastScrollDelta = 0;
  lastOffset = null;
  currentDelta = null;
  touchScrollPosotionStart = null;

  initialSelectDebouncer = null;
  wheelScrollDebouncer = null;
  touchScrollDebouncer = null;
  disableScrollDebouncer = null;
  safariScrollInterval = null;

  state = {
    activeSlideName: null,
    isSliding: false,

    hours: null,
    minutes: null,
    phone: '',
    success: false,
    error: false
  };

  componentDidMount() {
    this.isSafari = isSafari();
    document.addEventListener('keydown', this.keydownHandler, false);
    window.addEventListener('DOMMouseScroll', this.wheelHandler, false);
    window.addEventListener('wheel', this.wheelHandler, false);
    window.addEventListener('touchstart', this.touchstartHandler, false);
    window.addEventListener('touchend', this.touchendHandler, false);
    this.initialSelectSlide();
    this.skipScrollContainer = document.querySelector('.skipScroll');

    if (localStorage.getItem('subscribe')) {
      this.setState({
        success: true
      });
    }

    const beenHere = localStorage.getItem('_t2cntsts_bnhr');

    if (!beenHere) {
      localStorage.setItem('_t2cntsts_bnhr', true);

      const date = new Date();
      date.setHours(date.getHours() + config.discountCookieHours);
      const expires = date.toUTCString();

      document.cookie = `landingDiscount=${date.toISOString()};domain=.${location.host};path=/;expires=${expires}`;
    }

    const landingDiscount = cookie.parse(document.cookie).landingDiscount;

    if (landingDiscount) {
      this.startCheckDiscount();
    }
  };

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keydownHandler, false);
    window.removeEventListener('DOMMouseScroll', this.wheelHandler, false);
    window.removeEventListener('wheel', this.wheelHandler, false);
    window.removeEventListener('touchstart', this.touchstartHandler, false);
    window.removeEventListener('touchend', this.touchendHandler, false);

    this.stopCheckDiscount();
    this.stopInitialSelectDebouncer();
    this.stopWheelScrollDebouncer();
    this.stopDisableScrollDebouncer();
    this.stopSafariScrollInterval();
    this.stopTouchScrollDebouncer();
    this.stopSlideAnimation();
  }

  get activeSlide() {
    return this.slides.find(slide => slide.name === this.state.activeSlideName);
  }

  get activeSlideNode() {
    return this.activeSlide.component.elem;
  }

  get activeSlideIndex() {
    return this.slides.indexOf(this.activeSlide);
  }

  get activeSlideScrollOffset() {
    const slide = this.activeSlideNode;
    const { top, bottom } = slide.getBoundingClientRect();

    return {
      top,
      bottom: bottom - window.innerHeight
    }
  }

  get nextSlide() {
    return this.slides[this.activeSlideIndex + 1] || null;
  }

  get prevSlide() {
    return this.slides[this.activeSlideIndex - 1] || null;
  }

  get slidesNodesBorders() {
    return this.slides.map(slide => {
      const { top, height } = getElementBound(slide.component.elem);
      return {
        slide,
        top,
        bottom: top + height
      }
    });
  }

  get viewportCenterSlide() {
    const vCenter = window.pageYOffset + window.innerHeight / 2;
    const centerSlide = this.slidesNodesBorders.find(border => border.top < vCenter && border.bottom > vCenter);
    return centerSlide ? centerSlide.slide : null;
  }

  get slidesInViewport() {
    const vTop = window.pageYOffset;
    const vBottom = vTop + window.innerHeight;

    const bordersInViewport = this.slidesNodesBorders.filter(border =>
      (vTop >= border.top && vTop < border.bottom) || (vBottom >= border.top && vBottom < border.bottom)
    );

    return bordersInViewport.map(border => border.slide);
  }

  startCheckDiscount() {
    this.checkDiscount();
    this.checkDiscountInterval = setInterval(this.checkDiscount.bind(this), 10000);
  }

  stopCheckDiscount() {
    if (this.checkDiscountInterval) {
      clearInterval(this.checkDiscountInterval);
      this.checkDiscountInterval = null;
    }
  }

  checkDiscount() {
    const landingDiscount = cookie.parse(document.cookie).landingDiscount;

    if (!landingDiscount) {
      return this.setState({
        hours: null,
        minutes: null
      });
    }

    const now = new Date();
    const date = new Date(Date.parse(landingDiscount));

    const diff = Math.floor((date - now) / 60000);
    let hours = Math.floor(diff / 60);
    let minutes = (diff % 60).toString();

    hours = `0${hours}`;

    if (minutes.length === 1) {
      minutes = `0${minutes}`;
    }

    this.setState({
      hours,
      minutes
    });
  }

  initialSelectSlide() {
    const timer = this.isSafari ? 250 : 0;

    this.initialSelectDebouncer = debouncer(this.initialSelectDebouncer, timer, () => {
      if (this.slidesInViewport.length > 1) {
        this.goToSlide(this.viewportCenterSlide.name, 'top', 300);
      } else {
        this.setState({
          activeSlideName: this.viewportCenterSlide.name
        })
      }
    });
  }

  stopInitialSelectDebouncer() {
    if (this.initialSelectDebouncer) {
      clearTimeout(this.initialSelectDebouncer);
      this.initialSelectDebouncer = null;
    }
  }

  startWheelScrollDebouncer() {
    this.wheelScrollDebouncer = debouncer(this.wheelScrollDebouncer, 50, () => {
      this.lastOffset = null;
      this.currentDelta = null;
      window.removeEventListener('scroll', this.wheelScrollHandler, false);

      this.stopSafariScrollInterval();
    });
  }

  stopWheelScrollDebouncer() {
    if (this.wheelScrollDebouncer) {
      clearTimeout(this.wheelScrollDebouncer);
      this.wheelScrollDebouncer = null;
    }
  }

  startDisableScrollDebouncer(direction) {
    this.lastScrollDirection = direction;
    this.preventScroll = true;
    this.disableScrollDebouncer = debouncer(this.disableScrollDebouncer, 50, () => {
      this.preventScroll = false;
      this.lastScrollDirection = 0;
      this.lastScrollDelta = 0;
    });
  }

  stopDisableScrollDebouncer() {
    this.preventScroll = false;
    this.lastScrollDirection = 0;
    this.lastScrollDelta = 0;

    if (this.disableScrollDebouncer) {
      clearTimeout(this.disableScrollDebouncer);
      this.disableScrollDebouncer = null;
    }
  }

  startSafariScrollInterval(event) {
    this.safariScrollInterval = setInterval(() => {
      this.checkScrollPositionOffset(normalizeWheel(event).pixelY)
    }, 10);
  }

  stopSafariScrollInterval() {
    if (this.safariScrollInterval) {
      clearInterval(this.safariScrollInterval);
      this.safariScrollInterval = null;
    }
  }

  startTouchScrollDebouncer() {
    this.touchScrollDebouncer = debouncer(this.touchScrollDebouncer, 200, () => {
      this.touchScrollDebouncer = null;

      if (this.touchScrolling) {
        return;
      }

      this.afterTouchScroll();
    });
  }

  stopTouchScrollDebouncer() {
    if (this.touchScrollDebouncer) {
      clearTimeout(this.touchScrollDebouncer);
      this.touchScrollDebouncer = null;
    }
  }

  checkScrollPositionOffset(delta) {
    const bottom = delta > 0;
    const offset = Math.floor(bottom ? this.activeSlideScrollOffset.bottom : this.activeSlideScrollOffset.top);

    if (this.isSafari && offset === 0) {
      const nextSlide = bottom ? this.nextSlide : this.prevSlide;
      this.stopSafariScrollInterval();
      this.goToSlide(nextSlide.name);
    }

    if ((bottom && delta > offset) || (!bottom && delta < offset)) {
      const bound = getElementBound(this.activeSlideNode);
      window.scrollTo(0, bottom ? bound.top + bound.height - window.innerHeight : bound.top);
      this.startDisableScrollDebouncer(delta > 0 ? 1 : -1);

      return false;
    }

    return true;
  }

  keydownHandler = event => {
    if (skipKeyTargetsTags.indexOf(event.target.tagName) > -1) {
      return;
    }

    let delta = 0;

    if (event.key === 'ArrowDown') {
      if (event.metaKey) {
        return this.setState({
          activeSlideName: this.slides[this.slides.length - 1].name
        });
      }

      delta = 25;

      if (event.altKey) {
        delta = window.innerHeight;
      }
    }

    if (event.key === 'ArrowUp') {
      if (event.metaKey) {
        return this.setState({
          activeSlideName: this.slides[0].name
        });
      }

      delta = -25;

      if (event.altKey) {
        delta = -window.innerHeight;
      }
    }

    if (event.key === 'PageDown') {
      delta = window.innerHeight;
    }

    if (event.key === 'PageUp') {
      delta = -window.innerHeight;
    }

    if (event.key === 'End') {
      this.setState({
        activeSlideName: this.slides[this.slides.length - 1].name
      })
    }

    if (event.key === 'Home') {
      this.setState({
        activeSlideName: this.slides[0].name
      })
    }

    if (!delta || event.altKey) {
      return;
    }

    const bottom = delta > 0;
    const offset = Math.floor(bottom ? this.activeSlideScrollOffset.bottom : this.activeSlideScrollOffset.top);
    const nextSlide = bottom ? this.nextSlide : this.prevSlide;

    if (this.slideAnimationRuning || this.preventScroll) {
      return preventEvent(event);
    }

    this.lastScrollDelta = delta;

    if (offset === 0) {
      if (nextSlide) this.goToSlide(nextSlide.name);
      return preventEvent(event);
    }

    if (!this.checkScrollPositionOffset(delta)) {
      return preventEvent(event);
    }
  };

  wheelHandler = event => {
    if (this.isSafari && this.safariScrollInterval) {
      return;
    }

    const noScrollContainer = document.querySelector('.noScroll');

    if (noScrollContainer && noScrollContainer.contains(event.target)) {
      return;
    }

    const skipScroll = this.skipScrollContainer.contains(event.target);
    const delta = normalizeWheel(event).pixelY;
    const direction = delta > 0 ? 1 : -1;
    const bottom = delta > 0;

    if (delta === 0) {
      return preventEvent(event);
    }

    const offset = Math.floor(bottom ? this.activeSlideScrollOffset.bottom : this.activeSlideScrollOffset.top);
    const nextSlide = bottom ? this.nextSlide : this.prevSlide;
    const bound = getElementBound(this.activeSlideNode);

    if (this.isSafari && !this.preventScroll) {
      this.stopSafariScrollInterval();
    }

    if (this.slideAnimationRuning) {
      this.lastScrollDelta = delta;
      this.startDisableScrollDebouncer(direction);
      return preventEvent(event);
    }

    if (skipScroll && window.innerWidth > 767) {
      const { offsetHeight, scrollHeight, scrollTop } = this.skipScrollContainer;

      if (bottom && (scrollTop + offsetHeight < scrollHeight) || !bottom && (scrollTop > 0)) {
        this.skipScrollContainer.scrollTop += delta;
        this.lastScrollDirection = direction
        this.lastScrollDelta = delta
        this.startDisableScrollDebouncer(direction);
        return preventEvent(event);
      }
    }

    if (this.preventScroll) {
      if (this.lastScrollDirection === direction && Math.abs(delta) - Math.abs(this.lastScrollDelta) - 10 < 0) {
        this.lastScrollDelta = delta
        this.startDisableScrollDebouncer(direction);
        return preventEvent(event);
      } else {
        this.preventScroll = false;
      }
    }

    this.lastScrollDelta = delta;

    if (offset === 0) {
      if (nextSlide) this.goToSlide(nextSlide.name);
      return preventEvent(event);
    }

    if (!this.checkScrollPositionOffset(delta)) {
      return preventEvent(event);
    }

    if (typeof this.lastOffset !== 'number') {
      this.lastOffset = bottom ? this.activeSlideScrollOffset.bottom : this.activeSlideScrollOffset.top;
    }

    if (typeof this.currentDelta !== 'number') {
      this.currentDelta = delta;
    } else {
      this.currentDelta += delta;
    }

    if ((bottom && this.currentDelta > this.lastOffset) || (!bottom && this.currentDelta < this.lastOffset)) {
      if (nextSlide) {
        this.goToSlide(nextSlide.name);
        return preventEvent(event);
      }
    }

    window.addEventListener('scroll', this.wheelScrollHandler, false);

    if (this.isSafari) {
      this.startSafariScrollInterval(event);
    }
  };

  wheelScrollHandler = event => {
    this.startWheelScrollDebouncer();
  };

  touchstartHandler = event => {
    if (this.slideAnimationRuning) {
      this.stopSlideAnimation();
      this.stopTouchScrollDebouncer();
      window.removeEventListener('scroll', this.touchScrollHandler, false);
    }

    this.touchScrollPosotionStart = window.pageYOffset;
    this.touchScrolling = true;
    window.addEventListener('scroll', this.touchScrollHandler, false);
  };

  touchendHandler = event => {
    this.touchScrolling = false;

    if (!this.touchScrollDebouncer) {
      this.afterTouchScroll();
    }
  };

  touchScrollHandler = event => {
    this.startTouchScrollDebouncer();
  };

  afterTouchScroll() {
    if (this.touchScrollPosotionStart === window.pageYOffset) {
      return;
    }

    window.removeEventListener('scroll', this.touchScrollHandler, false);

    if (this.slidesInViewport.length < 2) {
      return;
    }

    let position = window.pageYOffset + window.innerHeight * 0.5;

    if (position < 0) {
      position = 0;
    }

    if (position > document.body.offsetHeight) {
      position = document.body.offsetHeight;
    }

    const slide = this.findSlideByPosition(position);
    const bound = getElementBound(slide.component.elem);
    const border = Math.abs(bound.top - position) < Math.abs(bound.top + bound.height - position) ? 'top' : 'bottom';

    if (slide && slide.name !== this.state.activeSlideName) {
      this.goToSlide(slide.name, border);
    } else {
      this.goToSlide(this.state.activeSlideName, border);
    }
  }

  findSlideByPosition(position) {
    return this.slidesNodesBorders.find(el => {
      return (position >= el.top && position <= el.bottom);
    }).slide;
  }

  goToSlide(slideName, position, speed) {
    const slide = this.slides.find(slide => slide.name === slideName);
    const isNext = this.activeSlideIndex < this.slides.indexOf(slide);

    if (!position) {
      position = isNext ? 'top' : 'bottom';
    }

    const slideRect = slide.component.elem.getBoundingClientRect();
    const positionY = slideRect[position] + window.pageYOffset - (position === 'top' ? 0 : window.innerHeight);

    this.runSlideAnimation(positionY, 700);
    this.setState({ activeSlideName: slideName, isSliding: true });
  }

  runSlideAnimation(positionY, speed, onFinish) {
    this.slideAnimationRuning = true;

    if (this.isSafari) {
      document.body.style.overflow = 'hidden';

      setTimeout(() => {
        document.body.style.overflow = '';
      }, speed - 300);
    }

    this.scrollAnimationInterval = scrollFromTop(positionY, speed, () => {
      this.scrollAnimationInterval = null;
      this.slideAnimationRuning = false;

      if (typeof onFinish === 'function') {
        onFinish();
      }

      this.setState({ isSliding: false });
    });
  }

  stopSlideAnimation() {;
    this.slideAnimationRuning = false;

    if (this.scrollAnimationInterval) {
      clearInterval(this.scrollAnimationInterval);
      this.scrollAnimationInterval = null;
    }
  }

  isActive = (name) => {
    return this.state.activeSlideName === name;
  };

  navClickHandler = (name) => {
    this.goToSlide(name, 'top', 400);
  };

  phoneChangeHandler = event => {
    const { value } = event.target;

    this.setState({
      phone: value,
      error: this.state.error ? !(/^\+7\d{10}$/.test(value.replace(/[\s_]/gi, ''))) : false
    });
  };

  formSubmitHandler = event => {
    event.preventDefault();

    const phone = this.state.phone.replace(/[\s_]/gi, '');

    if (!(/^\+7\d{10}$/.test(phone))) {
      return this.setState({
        error: true
      });
    } else if (this.state.error) {
      this.setState({
        error: false
      });
    }

    const xhr = new XMLHttpRequest();

    xhr.open('POST', config.subscribeEndpoint);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ phone }));

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && (xhr.status === 204 || xhr.status === 200)) {
        this.state && this.setState({
          success: true
        });

        localStorage.setItem('subscribe', 1);
      }
    };
  };

  render() {
    return (
      <div class={cn('home-page')}>
        {this.slides.map(slide => {
          const { name, content } = slide;
          const isActive = this.isActive(name);
          const SlideComponent = slide.content;

          return (
            <Slide
              key={name}
              ref={el => slide.component = el}
              name={name}
              isActive={isActive}
            >
              <SlideComponent
                activeSlideName={this.state.activeSlideName}
                onNavClick={this.navClickHandler}
                isActive={isActive && !this.state.isSliding}
                slides={this.slides.filter(slide => slide.inNav)}
                hours={this.state.hours}
                minutes={this.state.minutes}
                phone={this.state.phone}
                success={this.state.success}
                error={this.state.error}
                formSubmitHandler={this.formSubmitHandler}
                phoneChangeHandler={this.phoneChangeHandler}
              />
            </Slide>
          );
        })}
      </div>
    );
  }
}
