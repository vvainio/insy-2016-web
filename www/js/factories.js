(function () {
  'use strict';

  angular.module('app.factories', [])

  .factory('DataFactory', function ($q, $rootScope, FirebaseService) {
    this.accounts = function () {
      return FirebaseService.getAccounts();
    };

    this.packages = function () {
      return FirebaseService.getPackages();
    };

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

    this.pendingDeliveries = function (packages) {
      return packages.filter(function (pckg) {
        var isCorrectSender = pckg.sender === currentAccountId();
        return isCorrectSender && !pckg.is_delivered && !pckg.is_sending;
      });
    };

    this.pendingPickups = function (packages) {
      return packages.filter(function (pckg) {
        var isCorrectRecipient = pckg.recipient === currentAccountId();
        return isCorrectRecipient && !pckg.is_sending && !pckg.is_delivered;
      });
    };

    this.recipients = function () {
      return this.accounts().$loaded(function (accounts) {
        return accounts.filter(function (account) {
          return account.$id !== currentAccountId();
        });
      });
    };

    this.getAccountDetails = function (accounts, pckg, type) {
      return accounts.find(function (account) {
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
