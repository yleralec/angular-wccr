angular.module('wccr-module').controller('weeklyCtrl',
  function ($scope, $http, date) {
    $scope.weeks = [];

    $http.get('/weekly').then(function(resp) {
      var weekly = resp.data.weekly;
      for(var i in weekly) {
        $scope.weeks.push({
          monday: date.toDate(weekly[i].key),
          sunday: date.getSunday(date.toDate(weekly[i].key)),
          cal: weekly[i].value
        });
      }
    });
  }
);