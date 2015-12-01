(function() {
  'use strict';

  angular
    .module('rockauth.instagram')
    .directive('raInstagram', function() {
      return {
        bindToController: true,
        controller: InstagramController,
        controllerAs: 'vm',
        template: templateHTML,
        scope: {
          successCallback: '&'
        }
      };
    }); 

  InstagramController.$inject = [
    'raCoreService', 
    '$http',
    '$window',
    '$stateParams',
    '$location',
    'InstagramRedirectURI',
    'InstagramClientId'
  ];

  function InstagramController(service, $http, $window, $stateParams, $location, InstagramRedirectURI, InstagramClientId) {
    var vm = this;
    vm.login = login;

    var baseURL = 'https://instagram.com/oauth/authorize/';
    baseURL += '?client_id=' + InstagramClientId;
    baseURL += '&redirect_uri=' + InstagramRedirectURI;
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

  var templateHTML = 
  '<br><button class="myButton" ng-click="vm.login()">Instagram</button>'+
  '<style>'+
  '.myButton {'+
  ' border-radius: 5px;'+
  ' border: none;'+
  ' color: rgba(255,255,255,0.87);'+
  ' background-color: rgb(63,81,181);'+
  ' padding: 6px 10px;'+
  '}';
})();