(function() {
  'use strict';

  angular
    .module('rockauth.facebook')
    .directive('raFacebook', function(){
      return {
        bindToController: true,
        controller: FacebookController,
        controllerAs: 'vm',
        template: templateHTML,
        scope: {
          successCallback: '&',
        }
      };
    });

  FacebookController.$inject = ['raCoreService', '$window', 'FacebookAppId'];

  function FacebookController(service, $window, FacebookAppId){
    var vm = this;
    vm.login = login;
    vm.logout = logout;
    $window.fbAsyncInit = fbInit;

    addFacebookSDK();

    // function successfulLogin(response) {
    //   service.loginWithProvider('facebook', response.authResponse.accessToken, null, vm.successCallback, null);
    // }

    function login(){
      $window.FB.login(function(response) {
        if (response.authResponse) {
          service.loginWithProvider('facebook', response.authResponse.accessToken, null, vm.successCallback, null);          
        } else {
          console.log("Facebook couldn't authenticate you.");
        }
      });

      // $window.FB.getLoginStatus(function(response) {
      //   if (response.authResponse) {
      //     successfulLogin(response);
      //   } else {
      //     $window.FB.login(function(response){
      //       successfulLogin(response);
      //     });
      //   }
      // });
    }

    function logout(){
      service.logout();
    }

    function addFacebookSDK() {
      var id = 'facebook-jssdk';
      var ref = document.getElementsByTagName('script')[0];

      if (document.getElementById(id)) {
        return;
      }

      var js = document.createElement('script');
      js.id = id;
      js.async = true;
      js.src = "//connect.facebook.net/en_US/all.js";

      ref.parentNode.insertBefore(js, ref);
    }

    function fbInit() {
      $window.FB.init({
        appId: FacebookAppId,
        status: true,
        cookie: true,
        xfbml: true,
        version: 'v2.4'
      });
    }
  }
  var templateHTML =
  '<button ng-hide="vm.authed" ng-click="vm.login()">Facebook</button>' +
  '<button ng-show="vm.authed" ng-click="vm.logout()">Logout</button>';
})();
