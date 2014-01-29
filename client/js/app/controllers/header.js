angular.module('wccr-module').controller('headerCtrl',
  function ($scope, nav, date) {
    $scope.nav = nav;
    $scope.date =  date.pageDate;
  }
);

