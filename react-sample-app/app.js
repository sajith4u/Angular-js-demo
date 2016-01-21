var sampleApp = angular.module('sampleApp', ['ngRoute', 'LocalStorageModule']);

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
            when('/rules', {
                templateUrl: 'pages/ruleBlocks.html',
                controller: 'RuleController'
            }).
            when('/products', {
                templateUrl: 'pages/products.html',
                controller: 'ProductsController'
            }).
            otherwise({
                redirectTo: '/list'
            });
    }]).config(['localStorageServiceProvider', function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('ls');
}]);


sampleApp.controller('FriendListController', function ($scope, $http, $location, localStorageService) {

    function getItem(key) {
        return localStorageService.get(key);
    }

    $scope.getFriendList = function () {
        var URL = "http://127.0.0.1:9000/student/list";
        var config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getItem("token")
            }
        }

        $http.get(URL, config)
            .success(function (data, status, headers, config) {
                console.log("Successfully get Data : " + data.Status);
                console.log("Http Status : " + status);
                $scope.Response = data.Status;
                $scope.friend_list = data.list;
                console.log("Links :" + data.list[0].links[0].href)
            })
            .error(function (data, status, header, config) {
                console.log("Failed to login");
                $scope.Response = data.Status + " : Status Code : " + status + "  Please Login Again";
            });
    }

    $scope.friendDetails = function () {

    }


});
sampleApp.controller('LoginController', function ($scope, $http, $location, localStorageService) {
    $scope.message = 'This is Show orders screen';

    function submit(key, val) {
        return localStorageService.set(key, val);
    }

    $scope.SendData = function () {
        var URL = "http://127.0.0.1:9000/student/login";
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
                    $location.path("/list")
                    submit("token", data.token);
                } else {
                }
            })
            .error(function (data, status, header, config) {
                console.log("Failed to login");
                $scope.Response = "Login Failed";
            });
    }
});
sampleApp.controller('RegisterController', function ($scope) {
    $scope.message = 'This is Show orders screen';
});

sampleApp.controller('RuleController', function ($scope) {
    console.log("Initial load Rules")
    $scope.rules = [{}];
    $scope.ruleFullBlock = [{}];

    $scope.addRuleBlock = function () {
        var newRule = $scope.rules.length + 1;
        $scope.rules.push(
            {'id': 'choice' + newRule}
        );
    };

    $scope.addFullRuleBlock = function () {
        console.log("------ Add Rule Block------")
        var newRule = $scope.ruleFullBlock.length + 1;
        $scope.ruleFullBlock.push(
            {'id': 'choice' + newRule}
        );
    };

    $scope.removeFullRuleBlock = function () {
        console.log("------ Remove Rule Block------")
        var removeItem = $scope.ruleFullBlock.length - 1;
        $scope.rules.splice(removeItem);
    };

    $scope.removeRuleBlock = function () {
        var removeItem = $scope.rules.length - 1;
        $scope.rules.splice(removeItem);
    };

});

sampleApp.controller('ProductsController', function ($scope, $http) {
    var URL = "http://localhost:9090/api/products";
    var config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    $http.get(URL, config)
        .success(function (data, status, headers, config) {
            console.log("Http Status : " + status);
            console.log("Data : " + data);
            $scope.product_list = data.product;
        })
        .error(function (data, status, header, config) {
            console.log("Failed to login");
            $scope.Response = data.Status + " : Status Code : " + status + "  Please Login Again";
        });

});
sampleApp.controller('ChatController', function ($scope, $http, $location, $routeParams) {
    $scope.message = 'This is Show orders screen';
    $scope.chatterName = $routeParams.userName;

});
