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
          successCallback: '&'
        }
      };
    })

  FacebookController.$inject = ['facebookService', '$window']

  function FacebookController(service, $window){
    var vm = this;
    vm.login = login;
    vm.logout = logout;
    vm.authed = false;

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
        appId: '1011964755522543',
        status: true,
        cookie: true,
        xfbml: true,
        version: 'v2.4'
      })
    }

    function loginCallback(response) {
      if (response) {
        service.login(response.accessToken);
      } else {
        FB.login();
      }

    }

    function login(){
      FB.getLoginStatus(function(response) {
        if (response.authResponse) {
          vm.authed = true;
          console.log(response.authResponse.accessToken);
          service.login(response.authResponse.accessToken);
        } else {
          FB.login(function(response){
            vm.authed = true;
            console.log(response.authResponse.accessToken);
            service.login(response.authResponse.accessToken);
          })
        }
      })
    }

    function logout(){
      FB.logout();
      vm.authed = false;
    }
  }
})();