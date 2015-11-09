(function() {
  'use strict';

  angular
    .module('rockauth.facebook')
    .service('facebookService', facebookService);

  function facebookService($http, BaseAPI, ClientId, ClientSecret){
    var vm = this;
    vm.register = register;

    function register() {
      return $http.post(BaseAPI + 'authentications.json', {
        authentications: {
          auth_type: 'assertion',
          client_id: ClientId,
          client_secret: ClientSecret,
          provider_authentication: {
            provider: 'facebook',
            provider_access_token: ''
          }
        }
      }).then(success, failure);
    }
  }
})();