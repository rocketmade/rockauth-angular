(function () {
  'use strict';

  angular.module('rockauth.core', []);
})();


(function(){
  'use strict';

  angular
    .module('rockauth.login', [
      'rockauth.core',
      'ngMaterial', 
      'ngMessages'
    ]);
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
      'rockauth.login',
      'ngMaterial', 
      'ngMessages'
    ]);
})();



(function() {
  'use strict';

  angular
    .module('rockauth.login')
    .directive('raLogin', function() {
      return {
        bindToController: true,
        controller: LoginController,
        controllerAs: 'vm',
        templateUrl: 'bower_components/rockauth-angular/src/login/login.html',
        scope: {
          successCallback: '&',
          failureCallback: '&'
        }
      };
    });

  LoginController.$inject = ['loginService'];
  /* @ngInject */
  function LoginController(service) {
    var vm = this;
    vm.login = login;
    vm.changeValidation = changeValidation;
    vm.emptyErrors = emptyErrors;
    vm.validationShow = false;
    vm.isAuthed = isAuthed;
    vm.logout = logout;

    function changeValidation() {
      vm.validationShow = true;
    }

    function login() {
      service.login(vm.email, vm.password, function() {
        vm.successCallback();
      }, function(response) {
        console.log("Login response:", response.data.error.validation_errors);
        if (response.data.error.validation_errors.username !== null){
          vm.UsernameValidation = response.data.error.validation_errors.username[0];
        }
        if (response.data.error.validation_errors.password !== null){
          vm.PasswordValidation = response.data.error.validation_errors.password[0];
        }
        if (response.data.error.validation_errors.resource_owner !== null){
          vm.UsernameValidation = 'We don\'t have a user with that email...';
        }
        vm.failureCallback();
      });
    }

    function logout() {
      service.logout();
    }

    function isAuthed() {
      return service.isAuthed ? service.isAuthed() : false;
    }


    function emptyErrors() {
      vm.passwordValidation = null;
      vm.usernameValidation  = null;
      vm.emailValidation = null;
    }
  }
})();

(function() {
  'use strict';

  angular
    .module('rockauth.login')
    .service('loginService', loginService);

  function loginService($http, $window, BaseAPI, ClientId, ClientSecret) {
    /* jshint validthis: true */
    var vm = this;
    vm.login = login;
    vm.parseJwt = parseJwt;
    vm.saveToken = saveToken;
    vm.getToken = getToken;
    vm.isAuthed = isAuthed;
    vm.logout = logout;
    var tokenStorageKey = 'rockauth.jwtToken';

    function login(email, password, success, failure) {
      return $http.post(BaseAPI + '/authentications.json', {
        authentication: {
          auth_type: 'password',
          client_id: ClientId,
          client_secret: ClientSecret,
          username: email,
          password: password
        }
      })
      .then(function(res) {
        if (res.config.url.indexOf(BaseAPI) === 0) {
          if (res.data.authentication !== undefined) {
            vm.saveToken(res.data.authentication.token);
          } else if (res.data.authentications !== undefined && res.data.authentications.length > 0) {
            vm.saveToken(res.data.authentications[0].token);
          }
        }
        success();
        console.log("Successful Login");
      }, failure);
    }

    // Add JWT methods here
    function parseJwt(token){
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse($window.atob(base64));
    }

    function saveToken(token){
      $window.localStorage[tokenStorageKey] = token;
    }

    function getToken(){
      return $window.localStorage[tokenStorageKey];
    }

    function isAuthed() {
      var token = vm.getToken();
      if(token) {
        var params = vm.parseJwt(token);
        return Math.round(new Date().getTime()/1000) <= params.exp;
      } else {
        return false;
      }
    }

    function logout() {
      // TODO: add logout request for rockauth
      $window.localStorage.removeItem(tokenStorageKey);
    }
  }
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
