(function() {
  'use strict';

  angular
    .module('rockauth.facebook')
    .directive('raFacebook', function(){
      return {
        bindToController: true,
        controller: FacebookController,
        controllerAs: 'vm',
        templateUrl: 'bower_components/rockauth-angular/src/facebook/facebook.html',
        scope: {
          successCallback: '&',
        }
      };
    })

  FacebookController.$inject = ['facebookService', '$window', 'FacebookAppId']

  function FacebookController(service, $window, FacebookAppId){
    var vm = this;
    vm.login = login;
    vm.logout = logout;
    vm.authed = authed;

    (function(d){
    // load the Facebook javascript SDK

    var js, 
    id = 'facebook-jssdk', 
    ref = d.getElementsByTagName('script')[0];

    if (d.getElementById(id)) {
      return;
    }

    js = d.createElement('script'); 
    js.id = id; 
    js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";

    ref.parentNode.insertBefore(js, ref);

  }(document));
    $window.fbAsyncInit = function() {
      FB.init({
        appId: FacebookAppId,
        status: true,
        cookie: true,
        xfbml: true,
        version: 'v2.4'
      });
    }

    function successCallback(response){
      service.saveToken(response.data.authentication.token)
    }

    function failureCallback(response){
      console.log("couldn't authenticate")
    }

    function successfulLogin(response){
      service.login(response.authResponse.accessToken, successCallback, failureCallback);
    }

    function login(){
      FB.getLoginStatus(function(response) {
        if (response.authResponse) {
          successfulLogin(response);
        } else {
          FB.login(function(response){
            successfulLogin(response);
          });
        };
      });
    }

    function logout(){
      service.logout();
    }

    function authed() {
      return service.isAuthed() ? service.isAuthed() : false;
    }
  }
})();