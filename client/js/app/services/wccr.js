angular.module('wccr-module').factory('wccr',
  function ($http, foodItems, date) {
    var wccr = {};

    wccr.daily = {
      budgeted: 2300,
      total: 0
    };

    wccr.weekly = {
      budgeted: 2300,
      total: 0
    };

    wccr.updateTotals = function() {
      wccr.daily.total = 0 + getTotalCals(foodItems.today);
      wccr.weekly.total = 0 + getTotalCals(foodItems.beforeToday()) + wccr.daily.total;

      var day = date.current.getDay();
      if(day == 0) day = 7;

      wccr.weekly.budgeted = 2300 * day;
    }

    return wccr;
  }
);

function getTotalCals(foodItems) {
  var sum = 0;

  for(var i in foodItems) {
    if(foodItems[i].cal)
      sum += +foodItems[i].cal;
  }

  return sum;
}