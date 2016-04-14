(function () {
  'use strict';

  angular.module('app.services', [])

  .service('FirebaseService', function ($rootScope, $firebaseAuth, $firebaseArray) {
    var rootRef = new Firebase('https://insy-2016-web.firebaseio.com/');
    var firebaseAuth = $firebaseAuth(rootRef);

    // authentication
    this.authenticate = function (accountId) {
      accountId = parseInt(accountId).toString();

      return firebaseAuth.$authWithPassword({
        email: accountId + '@example.com',
        password: accountId
      });
    };

    this.getAuth = function () {
      return firebaseAuth.$waitForAuth();
    };

    this.logout = function () {
      firebaseAuth.$unauth();
    };
  });
})();
