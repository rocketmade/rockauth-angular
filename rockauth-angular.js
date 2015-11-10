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
(function() {
  'use strict';

  angular
    .module('rockauth.facebook')
    .service('facebookService', facebookService);

  function facebookService($http, BaseAPI, ClientId, ClientSecret){
    var vm = this;
    vm.login = login;

    function login(ProviderAccessToken, success, failure) {
      return $http.post(BaseAPI + '/authentications.json', {
        authentications: {
          auth_type: 'assertion',
          client_id: ClientId,
          client_secret: ClientSecret,
          provider_authentication: {
            provider: 'facebook',
            provider_access_token: ProviderAccessToken
          }
        }
      }).then(success, failure);
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
