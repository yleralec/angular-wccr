angular.module('wccr-module').directive('header',
  function () {

    return {
      templateUrl: 'views/header.html',
      controller: 'headerCtrl'
    };
  }
);
