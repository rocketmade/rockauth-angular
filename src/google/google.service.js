(function() {

  angular
    .module('rockauth.google')
    .service('raGoogleService', googleService);

  function googleService($http, BaseAPI, ClientId, ClientSecret) {
    var vm = this;
    vm.register = register;
    vm.getToken = getToken;

    function register(googleUser) {
      var token;
      token = getToken(googleUser);
      return $http.post(BaseAPI + '/me.json', {
        'user': {
          'authentication': {
            'auth_type': "assertion",
            'client_id': ClientId,
            'client_secret': ClientSecret
          },
          'provider_authentication': [{
            'provider': 'google_plus',
            'provider_access_token': token
          }]
        }

      });
    }

    function getToken(googleUser) {
      var googleToken = googleUser.getAuthResponse().id_token;
      console.log(googleToken);
      return googleToken;
    }
  }

}());