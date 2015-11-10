(function() {
  'use strict';

  angular
    .module('rockauth.facebook')
    .service('facebookService', facebookService);

  function facebookService($http, BaseAPI, ClientId, ClientSecret){
    var vm = this;
    vm.login = login;

    function login(ProviderAccessToken, success, failure) {
      return $http.post(BaseAPI + '/authentications.json', {
        authentications: {
          auth_type: 'assertion',
          client_id: ClientId,
          client_secret: ClientSecret,
          provider_authentication: {
            provider: 'facebook',
            provider_access_token: ProviderAccessToken
          }
        }
      }).then(success, failure);
    }
  }
})();