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
