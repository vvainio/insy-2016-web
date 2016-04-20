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

  .controller('DashboardCtrl', function ($rootScope, $scope, $state, FirebaseService) {
    if (!$rootScope.currentAccount) {
      $state.transitionTo('auth');
    }

    $rootScope.account = {};
    $rootScope.accounts = {};
    $rootScope.sentPackages = {};
    $rootScope.receivedPackages = {};

    FirebaseService.getAccounts().$loaded(function (accounts) {
      accounts.forEach(function (account) {
        var accountId = account.$id;

        if (accountId === $rootScope.currentAccount.uid) {
          $rootScope.account = account;
        }

        $rootScope.accounts[accountId] = account;
      });

      FirebaseService.getPackages().$loaded(function (pckgs) {
        var accountId = $rootScope.currentAccount.uid;

        pckgs.forEach(function (pckg) {
          if (pckg.sender === accountId) {
            $rootScope.sentPackages[pckg.$id] = pckg;
          }

          if (pckg.recipient === accountId) {
            $rootScope.receivedPackages[pckg.$id] = pckg;
          }
        });
      });
    });

    $scope.deletePackage = function (key) {
      FirebaseService.deletePackage(key);
    };
  })

  .controller('SendRecipientCtrl', function ($scope, $rootScope, $state, FirebaseService) {
    if (!$rootScope.currentAccount) {
      $state.transitionTo('auth');
    }

    $scope.accounts = FirebaseService.getAccounts();

    $scope.setRecipient = function (key, account) {
      $rootScope.recipient = account;
      $rootScope.recipient.id = key;
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

  .controller('ReceiveCtrl', function ($scope, $rootScope, $state, FirebaseService) {
    if (!$rootScope.currentAccount) {
      $state.transitionTo('auth');
    }

    $scope.packages = $rootScope.receivedPackages;
    $scope.isCollecting = false;

    $scope.collect = function (key) {
      var data = { 'is_delivered': true };
      FirebaseService.updatePackage(key, data);
    };
  });
})();
