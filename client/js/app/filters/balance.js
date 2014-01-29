angular.module('wccr-module').filter('balance',
  function () {
    return function (number) {
      number = Math.ceil(number);

      if(+number < 0)
        return "(" + (-number) + ")";
      else 
        return number;
    };
  }
);