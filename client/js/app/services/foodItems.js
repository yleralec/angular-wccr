angular.module('wccr-module').factory('foodItems',
  function ($http, date) {

    var foodItems = {};

    foodItems.lastWeek = [];
    foodItems.thisWeek = [];
    foodItems.nextWeek = [];
    foodItems.today = [];

    get(date.monday, date.sunday, 'thisWeek');
    get(dateAdd(date.monday,7), dateAdd(date.sunday,7), 'nextWeek');
    get(dateAdd(date.monday,-7), dateAdd(date.sunday,-7), 'lastWeek');

    function get(startDate, endDate, week) {
      $http.get('/foodItem' + 
          '?start=' + date.toJSON(startDate) + 
          '&end=' + date.toJSON(endDate)
      ).then(function(resp) {
        if(resp.data.success) {
          for(var i in resp.data.foodItems) {
            var foodItem = resp.data.foodItems[i];
            foodItems[week].push(foodItem);
            updateTodaysFoodItems();
          }
        }  
      });
    }

    function dateAdd(date, add) {
      var newDate = new Date(date);
      newDate.setDate(newDate.getDate() + add);
      return newDate;
    }

    foodItems.goPrevWeek = function() {
      foodItems.nextWeek = foodItems.thisWeek;
      foodItems.thisWeek = foodItems.lastWeek;
      get(dateAdd(date.monday,-7), dateAdd(date.sunday,-7), 'lastWeek');
      foodItems.updateDayOfWeek();
    };

    foodItems.goNextWeek = function() {
      foodItems.lastWeek = foodItems.thisWeek;
      foodItems.thisWeek = foodItems.nextWeek;
      get(dateAdd(date.monday,7), dateAdd(date.sunday,7), 'nextWeek');
      foodItems.updateDayOfWeek();
    };

    foodItems.add = function(foodItem) {
      foodItem.date = date.currentJSON();

      foodItems.today.push(foodItem);
      foodItems.thisWeek.push(foodItem);
      post(foodItem);      
    }

    foodItems.remove = function(foodItem) {
      foodItems.thisWeek.splice(foodItems.thisWeek.indexOf(foodItem), 1);
      foodItems.today.splice(foodItems.today.indexOf(foodItem), 1);
      remove(foodItem);
    }    

    foodItems.update = function(foodItem) {
      put(foodItem);
    }

    
    function post(foodItem) {
      $http.post('/foodItem', foodItem).then(function (resp) {
        if(resp.data.success) {
          foodItem._id = resp.data.id;
          foodItem._rev = resp.data.rev;
        } else {
          console.log("FoodItem post failed.");
        }
      });
    }

    function put(foodItem) {
      $http.put('/foodItem/'+foodItem._id, foodItem).then(function (resp) {
        if(resp.data.success) {
          foodItem._id = resp.data.id;
          foodItem._rev = resp.data.rev;
        } else {
          console.log("FoodItem put failed.");
        }
      })
    }

    function remove(foodItem) {
      $http.delete('/foodItem/' + foodItem._id + '/' + foodItem._rev).then(function (resp) {
        if(resp.data.success) {
          // console.log('Food Item removed.', foodItem);
        } else {
          console.log("FoodItem remove failed.");
        }
      })
    }

    foodItems.updateDayOfWeek = function() {
      updateTodaysFoodItems();
    }

    function updateTodaysFoodItems() {
      foodItems.today.length = 0;

      for(var i in foodItems.thisWeek) {
        var foodItem = foodItems.thisWeek[i];
        var currDate = toDate(foodItem.date);
        if(datesEqual(currDate, date.current)) {
          foodItems.today.push(foodItem);
        }
      }
    }

    foodItems.beforeToday = function() {
      var items = [];

      for(var i in foodItems.thisWeek) {
        var foodItem = foodItems.thisWeek[i];
        var currDate = toDate(foodItem.date);
        if(currDate > date.monday && currDate < date.current) {
          items.push(foodItem);
        }
      }

      return items;
    };


    return foodItems;
  }
);

function toDate(dateString) {
  // if(dateString.match(/\d{4}-(\d{1}|\d{2})-\d{1}/)) {
    var splitDate = dateString.split('-');
    var date = new Date();

    date.setFullYear(splitDate[0]);
    date.setMonth(+splitDate[1] - 1);
    date.setDate(splitDate[2]);

    return date;

  // } else {
  //   return "Invalid date format";
  // }
}

function datesEqual(date1, date2) {
  return date1.getYear() === date2.getYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}