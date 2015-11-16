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

  LoginController.$inject = ['raCoreService'];
  /* @ngInject */
  function LoginController(raCoreService) {
    var vm = this;
    vm.login = login;
    vm.changeValidation = changeValidation;
    vm.emptyErrors = emptyErrors;
    vm.validationShow = false;
    vm.isAuthenticated = isAuthenticated;
    vm.logout = logout;

    function changeValidation() {
      vm.validationShow = true;
    }

    function login() {
      raCoreService.loginWithEmail(vm.email, vm.password, function(data) {
        vm.successCallback(data);
      }, function(response) {
        console.log("Login response:", response.data.error.validation_errors);
        if (response.data.error.validation_errors.username !== null){
          vm.UsernameValidation = response.data.error.validation_errors.username[0];
        }
        if (response.data.error.validation_errors.password !== null){
          vm.PasswordValidation = response.data.error.validation_errors.password[0];
        }
        if (response.data.error.validation_errors.resource_owner !== null){
          vm.UsernameValidation = 'Invalid email or password';
        }
        vm.failureCallback();
      });
    }

    function logout() {
      raCoreService.logout();
    }

    function isAuthenticated() {
      return raCoreService.isAuthenticated();
    }

    function emptyErrors() {
      vm.passwordValidation = null;
      vm.usernameValidation  = null;
      vm.emailValidation = null;
    }
  }
})();
