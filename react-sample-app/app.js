var sampleApp = angular.module('sampleApp', ['ngRoute']);

sampleApp.config(['$routeProvider',
    function ($routeProvider) {
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
            when('/chat', {
                templateUrl: 'pages/chat.html',
                controller: 'ChatController'
            }).
            otherwise({
                redirectTo: '/list'
            });
    }]);


sampleApp.controller('FriendListController', function ($scope) {
    $scope.message = 'This is Add new order screen';
    $scope.friend_list = [
        {name: "Nimesh Pathirana", status: "ACTIVE"},
        {name: "Sajith Vijesekara", status: "OFF_LINE"},
        {name: "Buddika Umesh", status: "ACTIVE"},
        {name: "User 5", status: "ACTIVE"},
        {name: "User 6", status: "OFF_LINE"},
        {name: "User 7", status: "ACTIVE"}
    ];
});
sampleApp.controller('LoginController', function ($scope, $http, $location) {
    $scope.message = 'This is Show orders screen';

    $scope.SendData = function () {
        console.log("-------------------- Called -----------------")
        var URL = "http://127.0.0.1:4738/student/login";
        var parameters = ({
            userName: $scope.userName,
            password: $scope.password
        });
        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        $http.post(URL, parameters, config)
            .success(function (data, status, headers, config) {
                console.log("Successfully send Data : " + data.token);
                $scope.Response = data.STATUS;
                var responseCode = data.STATUS;
                if (responseCode == "S1000") {
                    console.log("------- Success response ---------")
                    $location.path("/list")
                } else {
                    console.log("------- Failure response ---------")
                }
            })
            .error(function (data, status, header, config) {
                console.log("Failed to login");
                $scope.Response = data;
            });
    }
});
sampleApp.controller('RegisterController', function ($scope) {
    $scope.message = 'This is Show orders screen';
});
sampleApp.controller('ChatController', function ($scope) {
    $scope.message = 'This is Show orders screen';
});
