(function () {
  'use strict';

  angular.module('app.controllers', [])

  .controller('HomeCtrl', function ($scope) {
    $scope.foo = 'bar';
  })

  .controller('AuthCtrl', function ($scope, $state) {
    $scope.authForm = {};
    $scope.regex = /^[0-9]{5}$/;

    $scope.didInputPin = function () {
      if ($scope.authForm.pin === 12345) {
        $state.go('send');
      }

      $scope.authForm.pin = undefined;
    };
  })

  .controller('SendCtrl', function () {});
})();
