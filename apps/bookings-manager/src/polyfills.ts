/*
 * Polyfill stable language features.
 * It's recommended to use @babel/preset-env and browserslist
 * to only include the polyfills necessary for the target browsers.
 */
import 'core-js/stable';

import 'regenerator-runtime/runtime';

/**
 * This file contains polyfills loaded on all browsers
 **/

function polyfillGlobal() {
  if (typeof global !== 'undefined') return global;
  //eslint-disable-next-line
  Object.defineProperty(Object.prototype, 'global', {
    //eslint-disable-next-line
    get: function() {
      delete (Object as any).prototype.global;
      this.global = this;
    },
    configurable: true
  });
  return global;
}
polyfillGlobal();
