(function() {
  'use strict';

  angular
    .module('rockauth.registration')
    .service('registrationService', registrationService);

  function registrationService($http, BaseAPI, ClientId, ClientSecret) {
    var vm = this;
    vm.register = register;

    function register(email, password, success, failure) {
      return $http.post(BaseAPI + '/me.json', {
        user: {
          email: email,
          password: password,
          authentication: {
            client_id: ClientId,
            client_secret: ClientSecret
          }
        }
      }).then(success, failure);
    }
  }
})();
