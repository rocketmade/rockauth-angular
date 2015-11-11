(function() {
  'use strict';

  angular
    .module('rockauth.registration')
    .service('registrationService', registrationService);

  function registrationService($http, BaseAPI, ClientId, ClientSecret) {
    /* jshint validthis: true */
    var vm = this;
    vm.register = register;

    function register(firstName, lastName, email, password, success, failure) {
      return $http.post(BaseAPI + '/me.json', {
        user: {
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
          authentication: {
            client_id: ClientId,
            client_secret: ClientSecret
          }
        }
      }).then(function(response) {
        success(response.data);
      }, failure);
    }
  }
})();
