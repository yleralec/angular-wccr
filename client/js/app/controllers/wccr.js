angular.module('wccr-module').controller('wccrCtrl',
  function ($scope, wccr, foodItems, calorieTable, date) {

    $scope.date = date;

    $scope.newItem = {};
    $scope.foodItems = foodItems.today;
    $scope.wccr = wccr;

    $scope.calorieTable = {
      list: calorieTable.list,
      map: calorieTable.map
    };

    // update the totals automatically when the foodItems change
    $scope.$watch(function(){return foodItems.today.length;}, wccr.updateTotals);

    addItemWatch($scope.newItem);

    $scope.cols = ['gross', 'tare', 'net', 'calg', 'cal'];
    
    $scope.navClick = function(day) {
      date.changeDay(day);
      foodItems.updateDayOfWeek();
      wccr.updateTotals();
    };

    $scope.prevWeek = function() {
      date.prevWeek();
      foodItems.goPrevWeek();
      wccr.updateTotals();
    };

    $scope.nextWeek = function() {
      date.nextWeek();
      foodItems.goNextWeek();
      wccr.updateTotals();
    };

    $scope.add = function() {

      foodItems.add($scope.newItem);
      $scope.newItem = {};
      wccr.updateTotals();
      addItemWatch($scope.newItem);

      jQuery('thead tr .item').focus();
    };

    function addItemWatch(foodItem) {
      $scope.$watch(function (){
        return foodItem.item;
      }, function(newVal, oldVal) {
        foodItem.calg = $scope.calorieTable.map[newVal] || 0;
        itemChanged(foodItem, 'item');
      });
    }



    $scope.itemClick = function (e) {
      jQuery(e.target).select();
    };

    $scope.itemFocus = function (e) {
      var element = jQuery(e.target);
      if(element.attr('readonly')) {
        element.removeAttr('readonly');
      }
      else {
        element.attr('readonly', 'readonly');
      }
    };

    $scope.itemBlur = function(e, foodItem, who) {
      $scope.itemFocus(e);
      if(who === 'item' && $scope.calorieTable.map[foodItem.item]) {
        foodItem.calg = $scope.calorieTable.map[foodItem.item];
        itemChanged(foodItem, who);
      }
      evaluateItems(foodItem);
      $scope.update(foodItem);
    };

    $scope.itemEnter = function(e, foodItem) {
      var button = jQuery(e.target).parents('tr').find('button')[0];
      jQuery(button).focus();
    };

    $scope.itemChanged = function(foodItem, who) {
      if(who === 'item') {
        if($scope.calorieTable.map[foodItem.item])
          foodItem.calg = $scope.calorieTable.map[foodItem.item];
      } else {
        itemChanged(foodItem, who);
      }
    };

    $scope.update = function(foodItem) {
      foodItems.update(foodItem);
      wccr.updateTotals();
    };

    $scope.remove = function(foodItem) {
      foodItems.remove(foodItem);
      wccr.updateTotals();
    };

    

    $scope.newItemChanged = function(who) {
      itemChanged($scope.newItem, who);
    };

    $scope.newItemEnter = function (who) {
      evaluateItems($scope.newItem);
      $scope.add();
    };

    $scope.newItemBlur = function(who) {
      evaluateItems($scope.newItem);
    };
  }
);

function getDailyTotal(foodItems) {
  var total = 0;

  for(var key in foodItems) {
    total += +foodItems[key].cal;
  }

  return total;
}

function getTodaysFoodItems(allFoodItems, date) {
  var foodItems = [];

  for(var key in allFoodItems) {
    var currDate = new Date(+allFoodItems[key].date);
    if(datesEqual(currDate, date)) {
      foodItems.push(allFoodItems[key]);
    }
  }

  return foodItems;
}

function getFoodItemsBeforeToday(allFoodItems, monday, date) {
  var foodItems = [];

  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);

  monday.setHours(0);
  monday.setMinutes(0);
  monday.setSeconds(0);

  for(var key in allFoodItems) {
    var currDate = new Date(+allFoodItems[key].date);
    if(currDate > monday && currDate < date) {
      foodItems.push(allFoodItems[key]);
    }
  }

  return foodItems;
}

function datesEqual(date1, date2) {
  return date1.getYear() === date2.getYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

function itemChanged(item, who) {
  switch(who) {
  case "item":
    updateItem(item);
    break;
  case "gross":
    updateGross(item);
    break;
  case "tare":
    updateTare(item);
    break;
  case "net":
    updateNet(item);
    break;
  case "calg":
    updateCalg(item);
    break;
  case "cal":
    updateCal(item);
    break;
  }
}

function evaluateItems(item) {
  for(var key in item) {
    if(key === "calg")
      item[key] = evaluate(item[key]).toFixed(2);
    else if(['gross', 'tare', 'net', 'cal'].indexOf(key) !== -1)
      item[key] = evaluate(item[key]).toFixed(0);
  }
}

function evaluate(value) {
  value = "" + value;
  if(value.match(/^(\d?(\.\d+)?)+([-+*\/](\d?(\.\d+)?)+)*$/))
    return +eval(value);
  else
    return 0;
}

function updateItem(item) {
  if(item.net && item.calg) {
    item.cal = (evaluate(item.net) * evaluate(item.calg)).toFixed(0);
  }
}

function updateGross(item) {
  if(item.tare)
    item.net = (evaluate(item.gross) - evaluate(item.tare)).toFixed(0);
  else
    item.net = (evaluate(item.gross)).toFixed(0);

  if(item.net && item.calg) {
    item.cal = (evaluate(item.net) * evaluate(item.calg)).toFixed(0);
  }
}

function updateTare(item) {
  if(item.gross) {
    item.net = (evaluate(item.gross) - evaluate(item.tare)).toFixed(0);

    if(item.calg)
      item.cal = (evaluate(item.net) * evaluate(item.calg)).toFixed(0);
  }
  else if(item.net) {
    item.gross = (evaluate(item.net) + evaluate(item.tare)).toFixed(0);
  }
}

function updateNet(item) {
  if(item.tare) {
    item.gross = (evaluate(item.net) + evaluate(item.tare)).toFixed(0);
  } else {
    item.gross = evaluate(item.net).toFixed(0);
  }

  if(item.calg) {
    item.cal = (evaluate(item.net) * evaluate(item.calg)).toFixed(0);
  }
}

function updateCalg(item) {
  if(item.net) {
    item.cal = (evaluate(item.net) * evaluate(item.calg)).toFixed(0);
  } else if(item.cal && item.calg && item.calg !== 0) {
    item.net = (evaluate(item.cal) / evaluate(item.calg)).toFixed(0);

    if(item.tare) {
      item.gross = (evaluate(item.net) + evaluate(item.tare)).toFixed(0);
    } else {
      item.gross = (evaluate(item.net)).toFixed(0);
    }
  }
}

function updateCal(item) {
  if(item.calg && item.calg !== 0) {
    item.net = (evaluate(item.cal) / evaluate(item.calg)).toFixed(0);

    if(item.tare) {
      item.gross = (evaluate(item.net) + evaluate(item.tare)).toFixed(0);
    } else {
      item.gross = (evaluate(item.net)).toFixed(0);
    }
  }
}