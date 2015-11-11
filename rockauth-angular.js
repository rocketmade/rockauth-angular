(function () {
  'use strict';

  angular.module('rockauth.core', []);
})();


(function() {

  angular.module('rockauth.google', [
    'rockauth.core',
    'ngMaterial',
    'ngMessages'
  ]);

}());

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
      'rockauth.google',
      'ngMaterial', 
      'ngMessages'
    ]);
})();



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
(function() {

  angular
    .module('rockauth.google')
    .service('raGoogleService', googleService);

  function googleService($http, BaseAPI, ClientId, ClientSecret) {
    var vm = this;
    vm.register = register;
    vm.getToken = getToken;
    vm.signOut = signOut;

    function register(googleUser) {
      var token;
      token = getToken(googleUser);
      return $http.post(BaseAPI + '/authentications.json', {
        'authentication': {
          'auth_type': "assertion",
          'client_id': ClientId,
          'client_secret': ClientSecret,
          'provider_authentication': [{
            'provider': 'google_plus',
            'provider_access_token': token
          }]
        }
      });
    }

    function signOut() {
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function() {
        console.log('User signed out.');
      });
    }

    function getToken(googleUser) {
      var googleToken = googleUser.getAuthResponse().id_token;
      console.log(googleToken);
      return googleToken;
    }

  }

}());



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
