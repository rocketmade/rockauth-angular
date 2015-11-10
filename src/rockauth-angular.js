(function () {
  'use strict';

  angular
    .module('rockauth', [
      'rockauth.core',
      'rockauth.registration',
      'rockauth.login',
      'ngMaterial', 
      'ngMessages'
    ]);
})();
