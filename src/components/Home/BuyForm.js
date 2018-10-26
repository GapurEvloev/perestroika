import { h, Component } from 'preact';
import InputMask from 'react-input-mask';
import cn from 'classnames';

import config from '../../config';
import { appRegistartionUrl, trackOutboundLink } from '../../utils';

export class BuyForm extends Component {
  render() {
    const { hours, minutes, phone, success, error, formSubmitHandler, phoneChangeHandler } = this.props;
    const query = typeof window !== 'undefined' && window.location.search;
    const registrationUrl = `${appRegistartionUrl}${query}`;

    let discount = false;
    let price = config.seasonPrice;
    if (hours || minutes) {
      discount = true;
      price = config.seasonDiscountPrice;
    }

    return (
      <div class="buy-form">
        <div class="sale-block">
          {(!!discount) &&
            <p class="old-price">
              <span>{config.seasonPrice} Р</span>
            </p>
          }

          <p>Оплата прямо сейчас за</p>

          <h3>{price} <span class="rubl">Р</span></h3>

          {(!!discount) &&
            <p>
              Осталось{' '}
              <div class="counter">
                <span class="hours">{hours}</span>
                <span class="colon">:</span>
                <span class="minutes">{minutes}</span>
              </div>
            </p>
          }

          <a
            href={registrationUrl}
            class="btn"
            onClick={trackOutboundLink.bind(this, { event_аction: 'paymentButtonClick' })}
          >
            Оплатить
          </a>
        </div>

        {(!success) &&
          <form onSubmit={formSubmitHandler} class="subscribe-block">
            <p>В рассрочку</p>

            <h3>65 <span class="rubl">Р</span>/день</h3>

            <p>со счета мобильного телефона</p>

            <InputMask
              mask="+7 999 999 99 99"
              maskChar='_'
              alwaysShowMask
              class={cn({ error })}
              value={phone}
              onChange={phoneChangeHandler}
            />

            <button type="submit" class="btn">
              Подписаться
            </button>
          </form>
        }

        {(success) &&
          <div class="subscribe-block success">
            <h3>{config.subscribeSuccessMsg}</h3>
          </div>
        }
      </div>
    );
  }
}

export default BuyForm;
