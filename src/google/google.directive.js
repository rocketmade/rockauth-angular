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
      template: templateHTML,
      scope: {
        successCallback: '&'
      }
    };
  }

  GoogleAuthController.$inject = ['$window', 'raCoreService', 'GoogleAppId'];

  function GoogleAuthController($window, raCoreService, googleAppId) {
    var vm = this;

    $window.rockauthGoogleOnSignIn = onSignIn;
    vm.signOut = signOut;

    addGoogleAppIdMetaTag();

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

    function addGoogleAppIdMetaTag() {
      var meta = document.createElement('meta');
      meta.httpEquiv = 'X-UA-Compatible';
      meta.name = 'google-signin-client_id';
      meta.content = googleAppId;
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
  }

  var templateHTML = 
  '<div ng-app="rockauth.google">'
  + '<div class="g-signin2" data-onsuccess="rockauthGoogleOnSignIn"></div>'
  + '<md-button class="md-raised" ng-click="vm.signOut()">Sign Out</md-button>'
  + '<script src="https://apis.google.com/js/platform.js" async defer></script>'
  + '</div>'
}());
