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

    // accounts endpoint
    this.getAccounts = function () {
      return $firebaseArray(rootRef.child('accounts'));
    };

    // packages endpoint
    this.createPackage = function (recipient) {
      return rootRef.child('packages').push({
        'is_delivered': false,
        'sender': $rootScope.currentAccount.uid,
        'recipient': recipient.$id
      });
    };

    this.getPackages = function () {
      return $firebaseArray(rootRef.child('packages'));
    };

    this.updatePackage = function (id, data) {
      return rootRef.child('packages').child(id).update(data);
    };

    this.deletePackage = function (id) {
      return rootRef.child('packages').child(id).remove();
    };
  });
})();
