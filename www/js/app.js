(function () {
  'use strict';

  angular.module('app', ['ionic', 'firebase', 'app.controllers'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }

      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('/', {
        url: '/',
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .state('auth', {
        url: '/auth',
        templateUrl: 'views/auth.html',
        controller: 'AuthCtrl'
      })
      .state('send', {
        url: '/recipients',
        templateUrl: 'views/send.recipients.html',
        controller: 'SendCtrl'
      });

    $urlRouterProvider.otherwise('/');
  });
})();
