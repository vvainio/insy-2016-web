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

    $rootScope.package = null;

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
      FirebaseService.createPackage($rootScope.recipient).then(function (pckg) {
        $rootScope.package = FirebaseService.getPackage(pckg.key());
        $state.transitionTo('confirmation');
      });
    };
  })

  .controller('SendConfirmationCtrl', function ($rootScope, $state) {
    if (!$rootScope.currentAccount) {
      $state.transitionTo('auth');
    }

    if (!$rootScope.package) {
      $state.transitionTo('dashboard');
    }
  })

  .controller('ReceiveCtrl', function ($scope, $rootScope, $state, FirebaseService, DataFactory) {
    if (!$rootScope.currentAccount) {
      $state.transitionTo('auth');
    }

    $scope.activePackageRef = null;

    $scope.getAccountDetails = function (pckg, type) {
      return DataFactory.getAccountDetails(pckg, type);
    };

    $scope.setActivePackageRef = function (pckg) {
      var data = { 'is_receiving': true };

      FirebaseService.updatePackage(pckg.$id, data).then(function () {
        $scope.activePackageRef = FirebaseService.getPackageRef(pckg.$id);
      });
    };

    function fetchPickups() {
      DataFactory.pendingPickups().then(function (results) {
        $scope.pendingPickups = results;
      });
    }

    $scope.$watch('activePackageRef', function (ref) {
      if (ref) {
        ref.on('value', function (snapshot) {
          var data = snapshot.val();

          if (data.is_delivered) {
            $scope.activePackageRef = null;
          }
        });
      }
    });

    fetchPickups();
    DataFactory.packages.$watch(fetchPickups);
  });
})();
