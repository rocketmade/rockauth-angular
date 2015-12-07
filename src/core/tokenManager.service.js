(function() {
  'use strict';

  angular
    .module('rockauth.core')
    .service('raTokenManager', raTokenManager);

  function raTokenManager($window) {
    var vm = this;
    vm.getToken = getToken;
    vm.setToken = setToken;
    vm.isAuthenticated = isAuthenticated;
    vm.isTokenExpired = isTokenExpired;

    var tokenStorageKey = 'rockauth.jwtToken';

    function isAuthenticated() {
      var token = getToken();
      var bool = token !== null && !isTokenExpired(token);
      console.log("coming from tokenManager: " + bool);
      return token !== null && !isTokenExpired(token);
    }

    function setToken(token) {
      if (token === null) {
        $window.localStorage.removeItem(tokenStorageKey);
      } else {
        $window.localStorage[tokenStorageKey] = token;
      }
    }

    function getToken() {
      return $window.localStorage[tokenStorageKey];
    }

    function isTokenExpired(token) {
      if (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        var params = JSON.parse($window.atob(base64));
        return Math.round(new Date().getTime()/1000) >= params.exp;  
      } else {
        return true;
      }
    }
  }
})();
