(function() {
  'use strict';

  angular
    .module('rockauth.instagram')
    .directive('raInstagram', function() {
      return {
        bindToController: true,
        controller: InstagramController,
        controllerAs: 'vm',
        templateUrl: 'bower_components/rockauth-angular/src/instagram/instagram.html',
        scope: {
          successCallback: '&'
        }
      };
    });

    InstagramController.$inject = ['raCoreService', '$http', '$window', '$stateParams', '$location'];

    function InstagramController(service, $http, $window, $stateParams, $location) {
      var vm = this;
      vm.login = login;

      var baseURL = 'https://instagram.com/oauth/authorize/';
      baseURL += '?client_id=12a028ac085c4570b04610d1d7178a34';
      baseURL += '&redirect_uri=http://localhost:3001';
      baseURL += '&response_type=token';

      if($stateParams.token){
        var token = $stateParams.token.split('=')[1];
        service.loginWithProvider('instagram', token, null, vm.successCallback, null);
        $location.path('/');        
      }

      function login() {
        window.open(baseURL, '_self');
      }

    }
})();