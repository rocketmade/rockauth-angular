(function() {

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

  GoogleAuthController.$inject = ['$window', 'raGoogleService'];

  function GoogleAuthController($window, googleService) {
    var vm = this;

    $window.rockauthGoogleOnSignIn = onSignIn;
    vm.signOut = signOut;
    vm.showSignInButton = true;

    function onSignIn(googleUser) {
      if (googleUser) {
        googleService.register(googleUser);
        vm.showSignInButton = false;
      }
    }

    function signOut() {
      googleService.signOut();
      vm.showSignInButton = true;
    }
  }

}());