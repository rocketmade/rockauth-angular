(function () {
  'use strict';

  angular.module('rockauth.core', []);
})();


(function() {
  'use strict';

  angular.module('rockauth.google', [
    'rockauth.core',
    'ngMaterial',
    'ngMessages'
  ]);

}());

(function(){
  'use strict';

  angular
    .module('rockauth.login', [
      'rockauth.core',
      'ngMaterial', 
      'ngMessages'
    ]);
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
      'rockauth.google',
      'rockauth.login',
      'ngMaterial',
      'ngMessages'
    ]);
})();

(function() {
  'use strict';

  angular
    .module('rockauth.core')
    .service('raCoreService', raCoreService);

  function raCoreService($http, BaseAPI, ClientId, ClientSecret, raTokenManager) {
    var vm = this;
    vm.registerWithEmail = registerWithEmail;
    vm.loginWithEmail = loginWithEmail;
    vm.loginWithProvider = loginWithProvider;
    vm.linkProviderWithUser = linkProviderWithUser;
    vm.isAuthenticated = isAuthenticated;
    vm.logout = logout;

    function registerWithEmail(firstName, lastName, email, password, success, failure) {
      return $http.post(BaseAPI + '/me.json', {
        user: {
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
          authentication: {
            client_id: ClientId,
            client_secret: ClientSecret
          }
        }
      }).then(function(response) {
        handleSuccessfulAuthResponse('Successfully registered user', response, success);
      }, function(response) {
        handleFailedAuthResponse('Failed to register user', response, failure);
      });
    }

    function loginWithEmail(email, password, success, failure) {
      return $http.post(BaseAPI + '/authentications.json', {
        authentication: {
          auth_type: 'password',
          client_id: ClientId,
          client_secret: ClientSecret,
          username: email,
          password: password
        }
      }).then(function(response) {
        handleSuccessfulAuthResponse('Successfully logged in with email', response, success);
      }, function(response) {
        handleFailedAuthResponse('Failed to log in with email', response, failure);
      });
    }

    // This is used for both registering a new user with a social provider, or logging in with a social provider
    function loginWithProvider(providerName, token, secret, success, failure) {
      $http.post(BaseAPI + '/authentications.json', {
        authentication: {
          auth_type: 'assertion',
          client_id: ClientId,
          client_secret: ClientSecret,
          provider_authentication: [{
            provider: providerName,
            provider_access_token: token,
            provider_access_token_secret: secret
          }]
        }
      }).then(function(response) {
        handleSuccessfulAuthResponse('Successfully registered provider:' + providerName, response, success);
      }, function(response) {
        handleFailedAuthResponse('Failed to register provider:' + providerName, response, failure);
      });
    }

    // This is used for linking an already existing user with a provider
    function linkProviderWithUser() {
      // TODO: implement this: used for registering an already existing user with a provider
    }

    function isAuthenticated() {
      return raTokenManager.isAuthenticated();
    }

    function logout() {
      // TODO: figure out the best way to logout of rockauth and social providers
      raTokenManager.setToken(null);
    }

    /******************************************
     * helper methods
     ******************************************/

    function handleSuccessfulAuthResponse(message, response, callback) {
      console.log(message);

      var token = extractToken(response);
      raTokenManager.setToken(token);

      if(callback !== null) {
        callback(response.data);
      }
    }

    function handleFailedAuthResponse(message, response, callback) {
      console.log(message);
      if (callback !== null) {
        callback(response);
      }
    }

    function extractToken(response) {
      if (response.data.authentication !== undefined) {
        return response.data.authentication.token;
      } else if (response.data.authentications !== undefined && response.data.authentications.length > 0) {
        return response.data.authentications[0].token;
      } else {
        return null;
      }
    }
  }
})();

(function() {
  'use strict';

  angular
    .module('rockauth.core')
    .service('raTokenManager', raTokenManager);

  function raTokenManager($window) {
    var vm = this;
    vm.getToken = getToken;
    vm.setToken = setToken;
    vm.isAuthenticated = isAuthenticated;
    vm.isTokenExpired = isTokenExpired;

    var tokenStorageKey = 'rockauth.jwtToken';

    function isAuthenticated() {
      var token = getToken();
      return token !== null && !isTokenExpired(token);
    }

    function setToken(token) {
      if (token === null) {
        $window.localStorage.removeItem(tokenStorageKey);
      } else {
        $window.localStorage[tokenStorageKey] = token;
      }
    }

    function getToken() {
      return $window.localStorage[tokenStorageKey];
    }

    function isTokenExpired(token) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace('-', '+').replace('_', '/');
      var params = JSON.parse($window.atob(base64));
      return Math.round(new Date().getTime()/1000) >= params.exp;
    }
  }
})();



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
      templateUrl: 'bower_components/rockauth-angular/src/google/google.html',
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
}());

(function() {
  'use strict';

  angular
    .module('rockauth.login')
    .directive('raLogin', function() {
      return {
        bindToController: true,
        controller: LoginController,
        controllerAs: 'vm',
        templateUrl: 'bower_components/rockauth-angular/src/login/login.html',
        scope: {
          successCallback: '&',
          failureCallback: '&'
        }
      };
    });

  LoginController.$inject = ['raCoreService'];
  /* @ngInject */
  function LoginController(raCoreService) {
    var vm = this;
    vm.login = login;
    vm.changeValidation = changeValidation;
    vm.emptyErrors = emptyErrors;
    vm.validationShow = false;
    vm.isAuthenticated = isAuthenticated;
    vm.logout = logout;

    function changeValidation() {
      vm.validationShow = true;
    }

    function login() {
      raCoreService.loginWithEmail(vm.email, vm.password, function(data) {
        vm.successCallback(data);
      }, function(response) {
        console.log("Login response:", response.data.error.validation_errors);
        if (response.data.error.validation_errors.username !== null){
          vm.UsernameValidation = response.data.error.validation_errors.username[0];
        }
        if (response.data.error.validation_errors.password !== null){
          vm.PasswordValidation = response.data.error.validation_errors.password[0];
        }
        if (response.data.error.validation_errors.resource_owner !== null){
          vm.UsernameValidation = 'Invalid email or password';
        }
        vm.failureCallback();
      });
    }

    function logout() {
      raCoreService.logout();
    }

    function isAuthenticated() {
      return raCoreService.isAuthenticated();
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
    });

  RegistrationController.$inject = ['raCoreService'];
  /* @ngInject */
  function RegistrationController(raCoreService) {
    var vm = this;
    vm.register = register;
    vm.changeValidation = changeValidation;
    vm.emptyErrors = emptyErrors;
    vm.validationShow = false;

    function changeValidation() {
      vm.validationShow = true;
    }

    function register() {
      raCoreService.registerWithEmail(vm.firstName, vm.lastName, vm.email, vm.password, function(user) {
        vm.successCallback()(user);
      }, function(response) {
        console.log(response.data.error.validation_errors.email);
        if (response.data.error.validation_errors.email !== null){
          vm.emailValidation = response.data.error.validation_errors.email[0];
        }
        if (response.data.error.validation_errors.password !== null){
          vm.passwordValidation = response.data.error.validation_errors.password[0];
        }
        if (response.data.error.validation_errors.first_name !== null) {
          vm.firstNameValidation = response.data.error.validation_errors.first_name[0];
        }
        if (response.data.error.validation_errors.last_name !== null) {
          vm.lastNameValidation = response.data.error.validation_errors.last_name[0];
        }
      });
    }

    function emptyErrors() {
      vm.passwordValidation = null;
      vm.emailValidation = null;
      vm.firstNameValidation = null;
      vm.lastNameValidation = null;
    }
  }
})();
