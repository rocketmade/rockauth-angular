(function () {
  'use strict';

  angular.module('rockauth.core', []);
})();


(function(){
  'use strict';

  angular
    .module('rockauth.registration', [
      'rockauth.core',
      'ngMaterial', 
      'ngMessages'
    ]);
})();


(function () {
  'use strict';

  angular
    .module('rockauth', [
      'rockauth.core',
      'rockauth.registration',
      'ngMaterial', 
      'ngMessages'
    ]);
})();



(function() {
  'use strict';

  angular
    .module('rockauth.registration')
    .directive('raRegistration', function() {
      return {
        bindToController: true,
        controller: RegistrationController,
        controllerAs: 'vm',
        templateUrl: 'bower_components/rockauth-angular/src/registration/registration.html',
        scope: {
          successCallback: '&'
        }
      };
    });

  RegistrationController.$inject = ['registrationService'];
  /* @ngInject */
  function RegistrationController(service) {
    var vm = this;
    vm.register = register;
    vm.changeValidation = changeValidation;
    vm.emptyErrors = emptyErrors;
    vm.validationShow = false;

    function changeValidation() {
      vm.validationShow = true;
    }

    function register() {
      service.register(vm.firstName, vm.lastName, vm.email, vm.password, function(user) {
        vm.successCallback()(user);
      }, function(response) {
        console.log(response.data.error.validation_errors.email);
        if (response.data.error.validation_errors.email !== null){
          vm.emailValidation = response.data.error.validation_errors.email[0];
        }
        if (response.data.error.validation_errors.password !== null){
          vm.passwordValidation = response.data.error.validation_errors.password[0];
        }
        if (response.data.error.validation_errors.first_name !== null) {
          vm.firstNameValidation = response.data.error.validation_errors.first_name[0];
        }
        if (response.data.error.validation_errors.last_name !== null) {
          vm.lastNameValidation = response.data.error.validation_errors.last_name[0];
        }
      });
    }

    function emptyErrors() {
      vm.passwordValidation = null;
      vm.emailValidation = null;
      vm.firstNameValidation = null;
      vm.lastNameValidation = null;
    }
  }
})();

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



