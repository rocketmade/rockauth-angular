(function(){
  'use strict';

  angular
    .module('rockauth.twitter')
    .directive('raTwitter', raTwitter);

  function raTwitter() {
    return {
      bindToController: true,
      controller: TwitterAuthController,
      controllerAs: 'vm',
      templateUrl: 'bower_components/rockauth-angular/src/twitter/twitter.html',
      scope: {
        successCallback: '&'
      }
    };
  }

  TwitterAuthController.$inject = ['$q', 'raTwitterService'];

  function TwitterAuthController($q, twitterService) {
    var vm = this;

    vm.connect = connect;
    vm.twitterConnection = false;

    twitterService.initialize();

    function connect() {
      twitterService.connectTwitter().then(function() {
        if (twitterService.isReady()) {
          vm.twitterConnection = true;
        }
      }, console.log('something went wrong'));
    }




  }
})();