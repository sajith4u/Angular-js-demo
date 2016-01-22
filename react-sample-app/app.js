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

    $scope.eventTypes = [{
        id: 1,
        name: "Payments Events"
    }, {
        id: 2,
        name: "App Downloads"
    }, {
        id: 3,
        name: "App Subscription"
    }, {
        id: 4,
        name: "Green Profile"
    }, {
        id: 5,
        name: "Gold Profile"
    }];

    $scope.aggregationTypes = [{
        id: 1,
        name: "Total Amount"
    }, {
        id: 2,
        name: "Total Count"
    }, {
        id: 3,
        name: "First Time"
    }];

    $scope.conditions = [{
        id: 1,
        name: "Less_than"
    }, {
        id: 2,
        name: "grater_than"
    }, {
        id: 3,
        name: "Equals"
    }];

    $scope.conditionBlock = [];

    var equalBlockTemplate = {
        "EQ": {
            "RHS": {}
        }
    };

    var graterThanBlockTemplate = {
        "GT": {
            "RHS": {}
        }
    };

    var lessThanBlockTemplate = {
        "LT": {
            "RHS": {}
        }
    };

    var applyBlockTemplate = {
        "APPLY": {
            "type": {}
        }
    };

    var inBlockTemplate = {
        "IN": {}
    };

    $scope.rules = [{id: 1}];
    $scope.logs = [];

    $scope.download = function () {
        console.log("Length : " + $scope.rules.length);
        angular.forEach($scope.rules, function (item) {
            var condition = item.condition;
            var eventType = item.eventType;
            var aggregationType = item.aggregationType;
            var value = item.value;
            var id = item.id;
            console.log("Id :" + id)
            var finalObj;
            inBlockTemplate.IN.type = "BasicEvent";
            inBlockTemplate.IN.out = aggregationType;
            inBlockTemplate.IN.refId = 8;

            if (condition == "Equals") {
                equalBlockTemplate.EQ.RHS.value = value;
                equalBlockTemplate.EQ.RHS.unit = "int";
                finalObj = $.extend(true, {}, inBlockTemplate, equalBlockTemplate);
                console.log("Result 1 : " + finalObj.EQ.RHS.value)
            } else if (condition == "grater_than") {
                graterThanBlockTemplate.GT.RHS.value = value;
                graterThanBlockTemplate.GT.RHS.unit = "int";
                finalObj = $.extend(true, {}, inBlockTemplate, graterThanBlockTemplate);
                console.log("Result 2 : " + finalObj.GT.RHS.value)
            } else {
                lessThanBlockTemplate.LT.RHS.value = value;
                lessThanBlockTemplate.LT.RHS.unit = "int";
                finalObj = $.extend(true, {}, inBlockTemplate, lessThanBlockTemplate);
                console.log("Result 3 : " + finalObj.LT.RHS.value)
            }
            var json = {
                "IN": {
                    "type": "eventType",
                    "out": aggregationType,
                    "refId": 8
                },
                "GT": {
                    "RHS": {
                        "value": value,
                        "unit": "int"
                    }
                }
            };

            $scope.logs.push(finalObj);
        });
    }

    $scope.addRuleBlock = function () {
        var newRule = $scope.rules.length + 1;
        $scope.rules.push({id: newRule});
    };

    $scope.removeRuleBlock = function (blockNumber) {
        $scope.rules.splice(blockNumber - 1, 1);
    };


// Full Rule Block
    $scope.ruleFullBlock = [{id: 1}];
    $scope.addFullRuleBlock = function () {
        var newRule = $scope.ruleFullBlock.length + 1;
        $scope.ruleFullBlock.push(newRule);
    };

    $scope.removeFullRuleBlock = function (blockNumber) {
        var removeItem = $scope.ruleFullBlock.length - 1;
        $scope.ruleFullBlock.splice(blockNumber - 1, 1);
    };

})
;

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
