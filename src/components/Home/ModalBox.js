import { h, Component } from 'preact';

export default class ModalBox extends Component {
  componentDidMount() {
    const app = document.querySelector('.root');
    const scrollBarWidth = window.innerWidth - app.offsetWidth;

    if (scrollBarWidth > 0) {
      app.style.paddingRight = `${scrollBarWidth}px`;
    }

    document.body.style.overflow = 'hidden';

    this.outsideClickHandler = (event) => {
      if (this.modalBox && this.modalBox.contains(event.target)) {
        return;
      }

      this.props.close(event);
    };

    setTimeout(() => {
      window.addEventListener('click', this.outsideClickHandler, false);
    }, 0);
  }

  componentWillUnmount() {
    const app = document.querySelector('.root');

    window.removeEventListener('click', this.outsideClickHandler, false);
    app.style.paddingRight = '';
    document.body.style.overflow = '';
  }

  render() {
    return (
      <div class="modal-layer noScroll">
        <div ref={el => this.modalBox = el} class="modal-box">
          {this.props.children}
        </div>
      </div>
    );
  }
}
