(function() {
  'use strict';

  angular
    .module('rockauth.logout')
    .directive('raLogout', function() {
      return {
        bindToController: true,
        controller: LogoutController,
        controllerAs: 'vm',
        template: templateHTML,
        scope: {
          successCallback: '&',
          failureCallback: '&'
        }
      };
    });

  LogoutController.$inject = ['raCoreService'];

  function LogoutController(service) {
    var vm = this;
    vm.logout = logout;
    vm.isAuthed = service.isAuthenticated;

    function logout() {
      service.logout();
    }
  }

  var templateHTML ='<br><button ng-show="vm.isAuthed()" ng-click="vm.logout()">Logout</button>';
})();
