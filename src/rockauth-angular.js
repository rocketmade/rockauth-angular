(function () {
  'use strict';

  angular
    .module('rockauth', [
      'rockauth.core',
      'rockauth.registration',
      'rockauth.facebook',
      'rockauth.google',
      'rockauth.instagram',
      'rockauth.login',
      'rockauth.logout',
      'ngMessages',
      'ngMaterial'
    ]);
})();
