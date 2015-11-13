(function() {
  'use strict';

  angular
    .module('rockauth.google')
    .directive('raGoogle', raGoogle);

  function raGoogle() {
    return {
      bindToController: true,
      controller: GoogleAuthController,
      controllerAs: 'vm',
      templateUrl: 'bower_components/rockauth-angular/src/google/google.html',
      scope: {
        successCallback: '&'
      }
    };
  }

  GoogleAuthController.$inject = ['$window', 'raCoreService'];

  function GoogleAuthController($window, raCoreService) {
    var vm = this;

    $window.rockauthGoogleOnSignIn = onSignIn;
    vm.signOut = signOut;

    function onSignIn(googleUser) {
      var token = googleUser.getAuthResponse().id_token;
      raCoreService.loginWithProvider('google_plus', token, null, vm.successCallback, null);
    }

    function signOut() {
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function() {
        console.log('User signed out of google');
      });
      raCoreService.logout();
    }
  }
}());
