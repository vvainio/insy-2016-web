(function () {
  'use strict';

  angular.module('app.controllers', [])

  .controller('HomeCtrl', function ($scope) {
    $scope.foo = 'bar';
  })

  .controller('AuthCtrl', function ($scope) {
    $scope.foo = 'bar';
  });
})();
