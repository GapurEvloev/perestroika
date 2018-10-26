const preactCliSwPrecachePlugin = require('preact-cli-sw-precache');

export default function (config) {
  const precacheConfig = {
    staticFileGlobs: [], //empty array so nothing will be a precached at all
    clientsClaim: true, // this sw will now control all tabs of your site open
    skipWaiting: true // as soon as your browsers looks at this it unregister already registered sw.js and makes this one main
  };

  return preactCliSwPrecachePlugin(config, precacheConfig);
}
