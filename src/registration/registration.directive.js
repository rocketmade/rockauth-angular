(function() {
  'use strict';

  angular
    .module('rockauth.registration')
    .directive('raRegistration', function() {
      return {
        bindToController: true,
        controller: RegistrationController,
        controllerAs: 'vm',
        template: templateHTML,
        scope: {
          successCallback: '&'
        }
      };
    });

  RegistrationController.$inject = ['raCoreService'];
  /* @ngInject */
  function RegistrationController(raCoreService) {
    var vm = this;
    vm.register = register;
    vm.changeValidation = changeValidation;
    vm.emptyErrors = emptyErrors;
    vm.validationShow = false;

    function changeValidation() {
      vm.validationShow = true;
    }

    function register() {
      raCoreService.registerWithEmail(vm.firstName, vm.lastName, vm.email, vm.password, function(user) {
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

  templateHTML =
  '<div ng-app="rockauth.registration">' +
  '<form name="userForm" class="md-inline-form" ng-hide="vm.isAuthenticated()" novalidate ng-submit="loginform.$valid">' +
    '<md-input-container>' +
      '<label>First Name</label>' +
      '<input type="name" ng-model="vm.firstName" name="firstName" required>{{ vm.firstNameValidation }}' +
      '<div ng-messages="userForm.firstName.$error" ng-show="vm.validationShow">' +
        '<div ng-message="required">This is required.</div>' +
      '</div>' +
    '</md-input-container>' +
    '<md-input-container>' +
      '<label>Last Name</label>' +
      '<input type="name" ng-model="vm.lastName" name="lastName" required>{{ vm.lastNameValidation }}' +
      '<div ng-messages="userForm.lastName.$error" ng-show="vm.validationShow">' +
        '<div ng-message="required">This is required.</div>' +
      '</div>' +
    '</md-input-container>' +
    '<md-input-container>' +
      '<label>Email</label>' +
      '<input type="email" ng-model="vm.email" name="email" required>{{ vm.emailValidation }}' +
      '<div ng-messages="userForm.email.$error" ng-show="vm.validationShow">' +
        '<div ng-message="required">This is required.</div>' +
        '<div ng-message="email">Please enter a valid email address.</div>' +
      '</div>' +
    '</md-input-container>' +
    '<md-input-container>' +
      '<label>Password</label>' +
      '<input type="password" ng-model="vm.password" name="password" ng-minlength="8" required>{{ vm.passwordValidation }}' +
      '<div ng-messages="userForm.password.$error" ng-show="vm.validationShow">' +
        '<div ng-message="required">This is required.</div>' +
        '<div ng-message="minlength">Password needs to be at least 8 characters.</div>' +
      '</div>' +
    '</md-input-container>' +
    '<br/>' +
    '<md-button class="md-raised md-primary" ng-click="vm.changeValidation(); userForm.$valid && vm.register(); vm.emptyErrors(); vm.clearInputs();">Register</md-button>' +
  '</form>' +
    '<md-button class="md-raised md-primary" ng-click="vm.logout()" ng-show="vm.isAuthenticated()">Logout</md-button>' +
  '</div>';

})();
