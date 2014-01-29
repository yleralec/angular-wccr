var myApp = angular.module('wccr-module').directive('ngEnter', function ($parse) {
  return function (scope, elem, attr) {
    var enterFn = $parse(attr['ngEnter']);
    elem.bind('keyup', function (event) {
      if(event.which === 13)
        enterFn(scope, {$event:event});
    });
 };
});

var myApp = angular.module('wccr-module').directive('ngFocus', function ($parse) {
  return function (scope, element, attr) {
    var focusFn = $parse(attr['ngFocus']);
    element.bind('focus', function (event) {
      scope.$apply(function() {
        focusFn(scope, {$event:event});
      });
    });
  };
});

var myApp = angular.module('wccr-module').directive('ngBlur', function ($parse) {
  return function (scope, element, attr) {
    var blurFn = $parse(attr['ngBlur']);
    element.bind('blur', function (event) {
      scope.$apply(function() {
        blurFn(scope, {$event:event});
      });
    });
  };
});

var myApp = angular.module('wccr-module').directive('ngEnterBlur', function ($parse) {
  return function (scope, elem, attr) {
    var func = $parse(attr['ngEnterBlur']);
    elem.bind('keyup', function (event) {
      if(event.which === 13)
        func(scope, {$event:event});
    });
    elem.bind('blur', function (event) {
      func(scope, {$event:event});
    });
 };
});