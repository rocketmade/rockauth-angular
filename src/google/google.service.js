(function() {
  'use strict';

  angular
    .module('rockauth.google')
    .service('raGoogleService', googleService);

  function googleService($http, BaseAPI, ClientId, ClientSecret) {
    var vm = this;
    vm.register = register;
    vm.getToken = getToken;
    vm.signOut = signOut;
    vm.saveToken = saveToken;
    vm.removeToken = removeToken;
    var tokenStorageKey = 'rockauth.jwtToken';

    function register(googleUser) {
      var token;
      token = getToken(googleUser);
      return $http.post(BaseAPI + '/authentications.json', {
        'authentication': {
          'auth_type': "assertion",
          'client_id': ClientId,
          'client_secret': ClientSecret,
          'provider_authentication': [{
            'provider': 'google_plus',
            'provider_access_token': token
          }]
        }
      }).then(function(res) {
        if (res.config.url.indexOf(BaseAPI) === 0) {
          if (res.data.authentication !== undefined) {
            vm.saveToken(res.data.authentication.token);
          } else if (res.data.authentications !== undefined && res.data.authentications.length > 0) {
            vm.saveToken(res.data.authentications[0].token);
          }
        }
      });
    }
    function signOut() {
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function() {
        console.log('User signed out.');
      });
    }
    function getToken(googleUser) {
      var googleToken = googleUser.getAuthResponse().id_token;
      return googleToken;
    }
    function saveToken(token){
      $window.localStorage[tokenStorageKey] = token;
    }
    function removeToken() {
      $window.localStorage.removeItem(tokenStorageKey);
    }
  }
}());