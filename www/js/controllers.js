(function () {
  'use strict';

  angular.module('app.controllers', [])

  .controller('AuthCtrl', function ($rootScope, $scope, $state, FirebaseService) {
    if ($rootScope.currentAccount) {
      $state.transitionTo('dashboard');
    }

  .controller('AuthCtrl', function ($scope, $state) {
    $scope.authForm = {};
    $scope.isAuthenticating = false;
    $scope.regex = /^[0-9]{5}$/;

    $scope.didInputAccountId = function () {
      $scope.isAuthenticating = true;

      FirebaseService.authenticate($scope.authForm.accountId)
        .then(function () {
          $state.transitionTo('dashboard');
        })
        .finally(function () {
          $scope.authForm.accountId = undefined;
          $scope.isAuthenticating = false;
        });
    };
  })

  .controller('SendCtrl', function () {});
})();
