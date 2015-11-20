(function() {
  'use strict';

  angular
    .module('rockauth.login')
    .directive('raLogin', function() {
      return {
        bindToController: true,
        controller: LoginController,
        controllerAs: 'vm',
        template: templateHTML,
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

  templateHTML = 
  '<div ng-app="rockauth.login">'
  + '<form layout="column" ng-cloak class="md-inline-form" name="userForm" ng-hide="vm.isAuthenticated()" novalidate ng-submit="loginform.$valid">'
    + '<md-input-container>'
      + '<label>Email</label>'
      + '<input type="email" ng-model="vm.email" name="email" required> {{vm.UsernameValidation}}{{vm.emailValidation}}<br>'
      + '<div ng-messages="userForm.email.$error">'
        + '<div ng-message="required">This is required.</div>'
        + '<div ng-message="email">Enter a valid email.</div>'
      + '</div>'
    + '</md-input-container>'
    + '<md-input-container>'
      + '<label>Password</label>'
      + '<input type="password" ng-model="vm.password" name="password" ng-minlength="8" ng-maxlength="30" required> {{vm.passwordValidation}}<br>'
      + '<div ng-messages="userForm.password.$error">'
        + '<div ng-message="required">This is required.</div>'
        + '<div ng-message="minlength">Your password must be between 8 and 30 characters</div>'
        + '<div ng-message="maxlength">Your password must be between 8 and 30 characters</div>'
      + '</div>'
    + '</md-input-container>'
    + '<md-button class="md-raised md-primary" ng-click="vm.changeValidation(); userForm.$valid && vm.login(); vm.emptyErrors()" ng-hide="vm.isAuthenticated()">Login</md-button>'
  + '</form>'
  + '<md-button ng-click="vm.logout()" class="md-raised md-primary" ng-show="vm.isAuthenticated()">Logout</md-button>'
  + '</div>'

})();
