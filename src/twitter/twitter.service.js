(function(){
  'use strict';

  angular
    .module('rockauth.twitter')
    .service('raTwitterService', twitterService);

  function twitterService($http, $q, BaseAPI, ClientId, ClientSecret) {
    /* jshint validthis: true */
    var vm = this;
    var authorizationResult = false;

    vm.authenticate = authenticate;
    vm.getToken = getToken;
    vm.initialize = initialize;
    vm.isReady = isReady;
    vm.connectTwitter = connectTwitter;
    vm.clearCache = clearCache;

    function authenticate(twitterUser) {
      var token = getToken(twitterUser);
      return $http.post(BaseAPI + '/authentications.json', {
        'authentication': {
          'auth_type': "assertion",
          'client_id': ClientId,
          'client_secret': ClientSecret,
          'provider_authentication': [{
            'provider': 'twitter',
            'provider_access_token': token
          }]
        }
      });
    }
    function getToken(twitterUser) {
      return 'token';
    }
  }
})();