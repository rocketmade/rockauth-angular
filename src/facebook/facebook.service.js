(function() {
  'use strict';

  angular
    .module('rockauth.facebook')
    .service('facebookService', facebookService);

  function facebookService($http, $window, BaseAPI, ClientId, ClientSecret){
    var vm = this;
    vm.saveToken = saveToken;
    vm.getToken = getToken;
    vm.parseJWT = parseJWT;
    vm.isAuthed = isAuthed;
    vm.login = login;
    vm.logout = logout;

    function saveToken(token) {
      console.log("Saved token: " + token);
      $window.localStorage['JWT'] = token;
    }

    function getToken() {
      return $window.localStorage['JWT'] = token;
    }

    function parseJWT(token) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse($window.atob(base64));
    }

    function isAuthed() {
      var token = $window.localStorage['JWT'];
      if (token) {
        var params = vm.parseJWT(token);
        return Math.round(new Date().getTime() / 1000) <= params.exp;
      } else {
        return false;
      }
    }

    function login(ProviderAccessToken, success, failure) {
      return $http.post(BaseAPI + '/authentications.json', {
        authentication: {
          auth_type: 'assertion',
          client_id: ClientId,
          client_secret: ClientSecret,
          provider_authentication: {
            provider: 'facebook',
            provider_access_token: ProviderAccessToken,
          }
        }
      }).then(success, failure);
    }

    function logout(success, failure){
      return $http({
        method: 'DELETE',
        url: BaseAPI + '/authentications.json',
        headers: {
          'Authorization': 'Bearer ' + $window.localStorage['JWT']
        }
      }).then(success, failure);
      console.log("Removing token: " + vm.getToken());
      $window.localStorage.removeItem('JWT');
    }
  }
})();