import { h, Component } from 'preact';
import cn from 'classnames';

import { appRulesUrl, appOfertaUrl } from '../../utils';

export class Footer extends Component {
  render() {
    return (
      <div class="footer">
        <div class="container">
          <ul class="footer-nav">
          {/*
            <li><a href="/">Медиакит для рекламодателя</a></li>
            <li><a href="/">Поддержка пользователей</a></li>
            <li><a href="/">Пользовательское соглашение</a></li>
          */}
            <li>
              <a target="_blank" rel="noopener noreferrer" href={appRulesUrl}>
                Правила
              </a>
            </li>

            <li>
              <a target="_blank" rel="noopener noreferrer" href={appOfertaUrl}>
                Договор оферты
              </a>
            </li>
          </ul>

          <p class="copyright">
            © 2017, ООО «ТД МЕДИА», ИНН 7710497171, ОГРН 1157746502650, +7 (495) 150 4342,{' '}
            <a href="mailto:info@td-media.ru">info@td-media.ru</a>
          </p>
        </div>
      </div>
    );
  }
}

export default Footer;
