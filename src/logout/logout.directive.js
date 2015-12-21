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

      // Logout of Facebook
      FB.api('/me/permissions', 'delete', function(response) {
        console.log(response); // true for successful logout.
      });

      // Logout of Google
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut();  
    }
  }

  var templateHTML ='<br><button ng-show="vm.isAuthed()" ng-click="vm.logout()">Logout</button>';
})();