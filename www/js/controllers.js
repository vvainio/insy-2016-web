(function () {
  'use strict';

  angular.module('app.controllers', [])

  .controller('AuthCtrl', function ($rootScope, $scope, $state, FirebaseService) {
    if ($rootScope.currentAccount) {
      $state.transitionTo('dashboard');
    }

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

  .controller('DashboardCtrl', function ($rootScope, $scope, $state, FirebaseService, DataFactory) {
    if (!$rootScope.currentAccount) {
      $state.transitionTo('auth');
    }

    DataFactory.account().then(function (result) {
      $scope.account = result;
    });

    $scope.getAccountDetails = function (pckg, type) {
      return DataFactory.getAccountDetails(pckg, type);
    };

    $scope.deletePackage = function (pckg) {
      FirebaseService.deletePackage(pckg.$id);
    };

    function loadPackages() {
      function fetchPendingDeliveries() {
        DataFactory.pendingDeliveries().then(function (results) {
          $scope.pendingDeliveries = results;
        });
      }

      function fetchPendingPickups() {
        DataFactory.pendingPickups().then(function (results) {
          $scope.pendingPickups = results;
        });
      }

      return (function () {
        fetchPendingDeliveries();
        fetchPendingPickups();
      })();
    }

    loadPackages();
    DataFactory.packages.$watch(loadPackages);
  })

  .controller('SendRecipientCtrl', function ($scope, $rootScope, $state, DataFactory) {
    if (!$rootScope.currentAccount) {
      $state.transitionTo('auth');
    }

    DataFactory.recipients().then(function (results) {
      $scope.recipients = results;
    });

    $scope.setRecipient = function (account) {
      $rootScope.recipient = account;
    };
  })

  .controller('SendVerifyCtrl', function ($scope, $rootScope, $state, FirebaseService) {
    if (!$rootScope.currentAccount) {
      $state.transitionTo('auth');
    }

    if (!$rootScope.recipient) {
      $state.transitionTo('dashboard');
    }

    $scope.createPackage = function () {
      FirebaseService.createPackage($rootScope.recipient).then(function () {
        $state.transitionTo('confirmation');
      });
    };
  })

  .controller('ReceiveCtrl', function ($scope, $rootScope, $state, FirebaseService, DataFactory) {
    if (!$rootScope.currentAccount) {
      $state.transitionTo('auth');
    }

    $scope.isCollecting = false;

    $scope.getAccountDetails = function (pckg, type) {
      return DataFactory.getAccountDetails(pckg, type);
    };

    $scope.collect = function (pckg) {
      var data = { 'is_delivered': true };
      FirebaseService.updatePackage(pckg.$id, data);
    };

    function fetchPickups() {
      DataFactory.pendingPickups().then(function (results) {
        $scope.pendingPickups = results;
      });
    }

    fetchPickups();
    DataFactory.packages.$watch(fetchPickups);
  });
})();
