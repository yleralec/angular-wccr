var nav = [
  {
    name: 'WCCR',
    url: '/',
    ctrl: 'wccrCtrl',
    tmpl: 'views/wccr.html'
  },
  {
    name: 'Monday',
    active: '',
    url: '/monday',
    ctrl: 'wccrCtrl',
    tmpl: 'views/wccr.html'
  },
  {
    name: 'Tuesday',
    active: '',
    url: '/tuesday',
    ctrl: 'wccrCtrl',
    tmpl: 'views/wccr.html'
  },
  {
    name: 'Wednesday',
    active: '',
    url: '/wednesday',
    ctrl: 'wccrCtrl',
    tmpl: 'views/wccr.html'
  },
  {
    name: 'Thursday',
    active: '',
    url: '/thursday',
    ctrl: 'wccrCtrl',
    tmpl: 'views/wccr.html'
  },
  {
    name: 'Friday',
    active: '',
    url: '/friday',
    ctrl: 'wccrCtrl',
    tmpl: 'views/wccr.html'
  },
  {
    name: 'Saturday',
    active: '',
    url: '/saturday',
    ctrl: 'wccrCtrl',
    tmpl: 'views/wccr.html'
  },
  {
    name: 'Sunday',
    active: '',
    url: '/sunday',
    ctrl: 'wccrCtrl',
    tmpl: 'views/wccr.html'
  },
  {
    name: 'Weekly',
    active: '',
    url: '/weekly',
    ctrl: 'weeklyCtrl',
    tmpl: 'views/weekly.html'
  },
  {
    name: 'CalorieTable',
    active: '',
    url: '/calorieTable',
    ctrl: 'calorieTableCtrl',
    tmpl: 'views/calorieTable.html'
  }
];

angular.module('wccr-module').factory('nav',
  function () {
    return nav;
  }
);
