var sampleApp = angular.module('sampleApp', ['ngRoute']);

sampleApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/list', {
    templateUrl: 'pages/list.html',
    controller: 'FriendListController'
      }).
      when('/login', {
    templateUrl: 'pages/login.html',
    controller: 'LoginController'
      }).
      when('/register', {
    templateUrl: 'pages/register.html',
    controller: 'RegisterController'
      }).
      otherwise({
    redirectTo: '/list'
      });
}]);


sampleApp.controller('FriendListController', function($scope) {    
    $scope.message = 'This is Add new order screen';    
});
sampleApp.controller('LoginController', function($scope) {
    $scope.message = 'This is Show orders screen';
});
sampleApp.controller('RegisterController', function($scope) {
    $scope.message = 'This is Show orders screen';
});
