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
          provider_authentication: {
            provider: providerName,
            provider_access_token: token,
            provider_access_token_secret: secret
          }
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

      // Logout of Rockauth
      var token = raTokenManager.getToken();
      $http({
        method: 'DELETE',
        url: BaseAPI + '/authentications.json',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });

      // Logout of Facebook
      FB.api('/me/permissions', 'delete', function(response) {
        console.log(response); // true for successful logout.
      });

      // Logout of Google
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut();

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
