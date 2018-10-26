const defaultConfig = {
  appDomain: 'app.perestroika.fit',
  appProtocol: 'https',
  appRegistartionPath: 'pay',
  appSeasonsPath: 'seasons',
  appRulesPath: 'rules',
  appOfertaPath: 'oferta',
  appFaqPath: 'faq',
  subscribeEndpoint: '/api/subscribe/',
  subscribeSuccessMsg: 'Заявка принята!',
  seasonId: '1',
  aboutVideoId: 'bU0ccNXN3d4',
  videoLessonsVideoId: 'mdZT2pWKpXE',
  discountCookieHours: 2,
  seasonPrice: 1999,
  seasonDiscountPrice: 1499
};

function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item) && item !== null);
}

function mergeDeep(target, source) {
  const output = Object.assign({}, target);

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }

  return output;
}

let config;

if (typeof window !== 'undefined') {
  config = mergeDeep(defaultConfig, window.__config);
} else {
  config = mergeDeep(defaultConfig, {
    appDomain: process.env.APP_DOMAIN,
    appProtocol: process.env.APP_PROTOCOL,
    appRegistartionPath: process.env.APP_REGISTARTION_PATH,
    appSeasonsPath: process.env.APP_SEASON_PATH,
    appRulesPath: process.env.APP_RULES_PATH,
    appOfertaPath: process.env.APP_OFERTA_PATH,
    appFaqPath: process.env.APP_FAQ_PATH,
    seasonId: process.env.SEASON_ID,
    aboutVideoId: process.env.ABOUT_VIDEO_ID,
    videoLessonsVideoId: process.env.VIDEO_LESSONS_VIDEO_ID,
    discountCookieHours: process.env.DISCOUNT_COOKIE_HOURS
  });
}

export default config;
