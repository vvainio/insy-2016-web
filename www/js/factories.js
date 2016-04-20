(function () {
  'use strict';

  angular.module('app.factories', [])

  .factory('DataFactory', function ($q, $rootScope, FirebaseService) {
    this.accounts = FirebaseService.getAccounts();
    this.packages = FirebaseService.getPackages();

    function accountsForLogin() {
      return FirebaseService.getAccounts();
    }

    function currentAccountId() {
      return $rootScope.currentAccount.uid;
    }

    this.account = function () {
      return accountsForLogin().$loaded(function (accounts) {
        return accounts.find(function (account) {
          return account.$id === currentAccountId();
        });
      });
    };

    this.pendingDeliveries = function () {
      return this.packages.$loaded(function(packages) {
        return packages.filter(function (pckg) {
          return !pckg.is_delivered && pckg.sender === currentAccountId();
        });
      });
    };

    this.pendingPickups = function () {
      return this.packages.$loaded(function(packages) {
        return packages.filter(function (pckg) {
          return !pckg.is_delivered && pckg.recipient === currentAccountId();
        });
      });
    };

    this.recipients = function () {
      return this.accounts.$loaded(function (accounts) {
        return accounts.filter(function (account) {
          return account.$id !== currentAccountId();
        });
      });
    };

    this.getAccountDetails = function (pckg, type) {
      return this.accounts.find(function (account) {
        return account.$id === pckg[type];
      });
    };

    return {
      account: this.account,
      accounts: this.accounts,
      getAccountDetails: this.getAccountDetails,
      packages: this.packages,
      pendingDeliveries: this.pendingDeliveries,
      pendingPickups: this.pendingPickups,
      recipients: this.recipients
    };
  });
})();
