(function () {
  'use strict';

  angular
    .module('rockauth', [
      'rockauth.core',
      'rockauth.registration',
      'rockauth.google',
      'rockauth.login',
      'ngMaterial',
      'ngMessages'
    ]);
})();
