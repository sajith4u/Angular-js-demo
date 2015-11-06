var chatMeApp = angular.module('chatMeApp',[]);

chatMeApp.config(['$routeProvider',function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/list', {
                templateUrl : 'pages/friend-list.html',
                controller  : 'mainController'
            })

            // route for the about page
            .when('/login', {
                templateUrl : 'pages/login-chat-me.html',
                controller  : 'LoginController'
            })

            // route for the contact page
            .when('/register', {
                templateUrl : 'pages/register-chat-me.html',
                controller  : 'registerController'
            }).
            otherwise({
	       redirectTo: '/list'
            });
    }]);

chatMeApp.controller('mainController', function($scope) {

        // create a message to display in our view
    $scope.message = 'This is Friend List Controller';
});

chatMeApp.controller('LoginController', function($scope) {

        // create a message to display in our view
    $scope.message = 'This is Login Controller Page';
});

chatMeApp.controller('registerController', function($scope) {

        // create a message to display in our view
    $scope.message = 'This is Register Controller Page';
});
