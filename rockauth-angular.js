(function () {
  'use strict';

  angular.module('rockauth.core', []);
})();

(function(){
  'use strict';

  angular
    .module('rockauth.facebook', [
      'rockauth.core'
    ])
})();

(function(){
  'use strict';

  angular
    .module('rockauth.registration', [
      'rockauth.core',
      'ngMaterial', 
      'ngMessages'
    ]);
})();

(function () {
  'use strict';

  angular
    .module('rockauth', [
      'rockauth.core',
      'rockauth.registration',
      'rockauth.facebook',
      'ngMaterial', 
      'ngMessages'
    ]);
})();

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
    vm.authed = service.isAuthed();

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
  }
})();
(function() {
  'use strict';

  angular
    .module('rockauth.facebook')
    .service('facebookService', facebookService);

  function facebookService($http, $window, BaseAPI, ClientId, ClientSecret){
    var vm = this;
    vm.saveToken = saveToken;
    vm.getToken = getToken;
    vm.parseJWT = parseJWT;
    vm.isAuthed = isAuthed;
    vm.login = login;
    vm.logout = logout;

    function saveToken(token) {
      console.log("Saved token: " + token);
      $window.localStorage['JWT'] = token;
    }

    function getToken() {
      return $window.localStorage['JWT'] = token;
    }

    function parseJWT(token) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse($window.atob(base64));
    }

    function isAuthed() {
      var token = $window.localStorage['JWT'];
      if (token) {
        var params = vm.parseJWT(token);
        return Math.round(new Date().getTime() / 1000) <= params.exp;
      } else {
        return false;
      }
    }

    function login(ProviderAccessToken, success, failure) {
      return $http.post(BaseAPI + '/authentications.json', {
        authentication: {
          auth_type: 'assertion',
          client_id: ClientId,
          client_secret: ClientSecret,
          provider_authentication: {
            provider: 'facebook',
            provider_access_token: ProviderAccessToken,
          }
        }
      }).then(success, failure);
    }

    function logout(success, failure){
      return $http({
        method: 'DELETE',
        url: BaseAPI + '/authentications.json',
        headers: {
          'Authorization': 'Bearer ' + $window.localStorage['JWT']
        }
      }).then(success, failure);
      console.log("Removing token: " + vm.getToken());
      $window.localStorage.removeItem('JWT');
    }
  }
})();



(function() {
  'use strict';

  angular
    .module('rockauth.registration')
    .directive('raRegistration', function() {
      return {
        bindToController: true,
        controller: RegistrationController,
        controllerAs: 'vm',
        templateUrl: 'bower_components/rockauth-angular/src/registration/registration.html',
        scope: {
          successCallback: '&'
        }
      };
    })

  RegistrationController.$inject = ['registrationService'];
  /* @ngInject */
  function RegistrationController(service) {
    var vm = this;
    vm.register = register;
    vm.changeValidation = changeValidation;
    vm.emptyErrors = emptyErrors;
    vm.validationShow = false;

    function changeValidation() {
      vm.validationShow = true;
    };

    function register() {
      service.register(vm.email, vm.password, function(user) {
        alert("SUCCESS!");
      }, function(response) {
        console.log(response.data.error.validation_errors.email);
        if (response.data.error.validation_errors.email != null){
          vm.emailValidation = response.data.error.validation_errors.email[0];
        }
        if (response.data.error.validation_errors.password != null){
          vm.passwordValidation = response.data.error.validation_errors.password[0];
        }
      });
    }

    function emptyErrors() {
      vm.passwordValidation = null;
      vm.usernameValidation  = null;
      vm.emailValidation = null;
    }
  }
})();

(function() {
  'use strict';

  angular
    .module('rockauth.registration')
    .service('registrationService', registrationService);

  function registrationService($http, BaseAPI, ClientId, ClientSecret) {
    var vm = this;
    vm.register = register;

    function register(email, password, success, failure) {
      return $http.post(BaseAPI + '/me.json', {
        user: {
          email: email,
          password: password,
          authentication: {
            client_id: ClientId,
            client_secret: ClientSecret
          }
        }
      }).then(success, failure);
    }
  }
})();
