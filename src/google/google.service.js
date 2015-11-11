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