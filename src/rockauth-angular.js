(function () {
  'use strict';

  angular
    .module('rockauth', [
      'rockauth.core',
      'rockauth.registration',
      'rockauth.facebook',
      'rockauth.google',
      'rockauth.login',
      'ngMessages',
      'ngMaterial'
    ]);
})();
