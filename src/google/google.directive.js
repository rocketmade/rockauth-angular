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

  GoogleAuthController.$inject = ['raGoogleService'];

  function GoogleAuthController(googleService) {
    var vm = this;

    vm.onSignIn = onSignIn;

    function onSignIn(googleUser) {
      googleService.register(googleUser);

    }
  }

}());