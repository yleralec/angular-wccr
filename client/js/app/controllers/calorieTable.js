angular.module('wccr-module').controller('calorieTableCtrl',
  function ($scope, $http, calorieTable) {
    $scope.calorieTable = [];
    $scope.size = 0;
    $scope.start = 0;
    $scope.limit = 20;
    $scope.limitOptions = [20,50,100];
    $scope.goto = '';

    $scope.goTo = function() {
      $scope.start = $scope.goto;
      $scope.start = $scope.start - $scope.start % $scope.limit;
      updateCalorieTable();
      $scope.goto = '';
    };

    $http.get('/calorieTableInfo').then(function (resp) {
      $scope.size = resp.data.doc_count;
    });

    updateCalorieTable();

    $scope.$watch('limit', function(oldVal, newVal) {
      $scope.start -= $scope.start % $scope.limit;

      updateCalorieTable();
    });

    $scope.prev = function() {
      $scope.start-= $scope.limit;

      if($scope.start < 0) $scope.start = 0;

      updateCalorieTable();
    };

    $scope.next = function() {
      $scope.start+= $scope.limit;
      
      if($scope.start > $scope.size) $scope.start-= $scope.limit;

      updateCalorieTable();
    };

    $scope.new = function() {
      if($scope.newItem) {

        calorieTable.add($scope.newItem);
        $scope.calorieTable.push($scope.newItem);

        $scope.newItem = {};
        $('#newItem').focus();
      }
    };

    $scope.update = function(item) {
      calorieTable.update(item);
    };

    $scope.remove = function(item) {
      calorieTable.remove(item);

      $scope.calorieTable.splice($scope.calorieTable.indexOf(item), 1);
    };

    function updateCalorieTable() {
      $scope.calorieTable.length = 0;
      getCalorieTable($scope.start, $scope.limit);
    }

    function getCalorieTable(skip, limit) {
      $http.get('/calorieTable'+'?'+'skip='+skip+'&'+'limit='+limit).then(function (resp) {
        if(resp.data.success)  {
          var table = resp.data.calorieTable.rows;

          for(var i in table) {
            $scope.calorieTable.push(table[i].value);
          }
        }
        else
          console.log("Can't get calorie Table.");
      });
    }
  }
);

