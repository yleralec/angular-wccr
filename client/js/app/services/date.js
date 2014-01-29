angular.module('wccr-module').factory('date', 
	function (nav) {

		var date = {};

		date.current = clearTime(new Date());
		date.monday = getMonday(date.current);
		date.sunday = getSunday(date.current);

		date.currentJSON = function() {
			return toJSON(date.current);
		}

		date.dayOfWeek = JSDateToDay(date.current);

		date.prevWeek = function() {
      date.current.setDate(date.current.getDate() - 7);
      date.monday.setDate(date.monday.getDate() - 7);
      date.sunday.setDate(date.sunday.getDate() - 7);
    }

    date.nextWeek = function() {
      date.current.setDate(date.current.getDate() + 7);
      date.monday.setDate(date.monday.getDate() + 7);
      date.sunday.setDate(date.sunday.getDate() + 7);
    }

    date.days = [
    	'Monday','Tuesday', 'Wednesday', 
    	'Thursday', 'Friday', 'Saturday', 'Sunday'
    ];	

    date.activeDay = { 
      Monday: false, Tuesday: false, Wednesday: false, 
      Thursday: false, Friday: false, Saturday: false, Sunday: false
    };  

    date.activeDay[date.dayOfWeek] = true;

    date.changeDay = function(day) {
    	date.activeDay[date.dayOfWeek] = false;
    	date.dayOfWeek = day;
    	date.activeDay[date.dayOfWeek] = true;

      date.current = new Date(date.monday);
      date.current.setDate(date.current.getDate() + dayToNumber(day) - 1);
    };

    date.toJSON = toJSON;
    date.toDate = toDate;
    date.getMonday = getMonday;
    date.getSunday = getSunday;

    return date;
	}
);

function dayToNumber(day) {
	switch(day.toLowerCase()) {
	case "monday":
		return 1;
		break;
	case "tuesday":
		return 2;
		break;
	case "wednesday":
		return 3;
		break;
	case "thursday":
		return 4;
		break;
	case "friday":
		return 5;
		break;
	case "saturday":
		return 6;
		break;
	case "sunday":
		return 7;
		break;
	}
}

function JSDateToDay(date) {
  var number = date.getDay();
  switch(number) {
  case 1:
    return "Monday";
    break;
  case 2:
    return "Tuesday";
    break;
  case 3:
    return "Wednesday";
    break;
  case 4:
    return "Thursday";
    break;
  case 5:
    return "Friday";
    break;
  case 6:
    return "Saturday";
    break;
  case 0:
    return "Sunday";
    break;
  }
}

function toJSON(date) {
	return date.getFullYear() + '-' + pad2Digits(date.getMonth()+1) + '-' + pad2Digits(date.getDate());
}

function pad2Digits(value) {
  if(+value < 10) {
    return '0' + value;
  }

  return '' + value;
}

function toDate(dateString) {
	if(dateString.match(/\d{4}-\d{2}-\d{2}/)) {
		var splitDate = dateString.split('-');
		var date = new Date();

		date.setFullYear(splitDate[0]);
		date.setMonth(+splitDate[1] - 1);
		date.setDate(splitDate[2]);

		return date;

	} else {
		return "Invalid date format";
	}
}

function getMonday(date) {
  var newDate = clearTime(new Date(date));

  if(newDate.getDay() < 1) {
    newDate.setDate(newDate.getDate() - 6);
  } else if(newDate.getDay() == 1) {
    return newDate;
  } else if(newDate.getDay() > 1) {
    newDate.setDate(newDate.getDate() - newDate.getDay() + 1);
  }

  return newDate;
}

function getSunday(date) {
  var newDate = clearTime(new Date(date));

  if(newDate.getDay() < 1) {
    return newDate;
  } else if(newDate.getDay() == 1) {
    newDate.setDate(newDate.getDate() + 6);
  } else if(newDate.getDay() > 1) {
    newDate.setDate(newDate.getDate() + 6 - newDate.getDay() + 1);
  }

  return newDate;
}

function clearTime(date) {
	date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  return date;
}