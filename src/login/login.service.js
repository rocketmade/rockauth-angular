(function() {
  'use strict';

  angular
    .module('rockauth.login')
    .service('loginService', loginService);

  function loginService($http, $window, BaseAPI, ClientId, ClientSecret) {
    var vm = this;
    vm.login = login;
    vm.parseJwt = parseJwt;
    vm.saveToken = saveToken;
    vm.getToken = getToken;
    vm.isAuthed = isAuthed;
    vm.logout = logout;

    function login(email, password, success, failure) {
      return $http.post(BaseAPI + '/authentications.json', {
        authentication: {
          auth_type: 'password',
          client_id: ClientId,
          client_secret: ClientSecret,
          username: email,
          password: password
        }
      })
      .then(function(res) {
        if (res.config.url.indexOf(BaseAPI) === 0) {
          if (res.data.authentication != undefined) {
            vm.saveToken(res.data.authentication.token);
          } else if (res.data.authentications != undefined && res.data.authentications.length > 0) {
            vm.saveToken(res.data.authentications[0].token);
          }
        } 
        success();
        console.log("Successful Login");
      }, failure);
    }

    // Add JWT methods here
    function parseJwt(token){
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse($window.atob(base64));
    };

    function saveToken(token){
      $window.localStorage['rockauthJwtToken'] = token;
    };

    function getToken(){
      return $window.localStorage['rockauthJwtToken'];
    };

    function isAuthed() {
      var token = vm.getToken();
      if(token) {
        var params = vm.parseJwt(token);
        return Math.round(new Date().getTime()/1000) <= params.exp;
      } else {
        return false;
      }
    }

    function logout() {
      $window.localStorage.removeItem('rockauthJwtToken');
    }
  }
})();