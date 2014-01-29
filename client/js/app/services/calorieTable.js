angular.module('wccr-module').factory('calorieTable',
  function ($http) {

    var calorieTable = {
      list: [],
      map: {},
      add: add,
      update: update,
      remove: remove
    };

    $http.get('/calorieTable').then(function (resp) {
      if(resp.data.success)  {
        makeMapAndList(resp.data.calorieTable.rows, calorieTable);
      }
      else
        console.log("Can't get calorie Table.");
    });

    function add(item) {
      post(item);

      calorieTable.list.push(item.item);
      calorieTable.map[item.item] = item.calg;
    }

    function update(item) {
      post(item);

      calorieTable.map[item.item] = item.calg;
    }

    function remove(item) {
      $http.delete('/calorieTable/'+item._id+'/'+item._rev).then(function (resp) {
        if(resp.data.success) {
          console.log(item);
          calorieTable.list.splice(item.item, 1);
          delete calorieTable.map[item.item];
        } else {
          console.log('remove failed', item);
        }
      });
    }

    function post(item) {
      $http.post('/calorieTable', item).then(function (resp) {
        if(resp.data.success) {
          item._id = resp.data.id;
          item._rev = resp.data.rev;
        } else {
          console.log('Failed', item);
        }
      })
    }

    return calorieTable;
  }
);


function makeMapAndList(calorieTableData, calorieTable) {
  for(var key in calorieTableData) {
    var item = calorieTableData[key].value;
    calorieTable.map[item.item] = item.calg;
    calorieTable.list.push(item.item);
  }
}