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
            when('/farm', {
                templateUrl: 'pages/productList.html',
                controller: 'FarmAppController'
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
    }, {
        id: 4,
        name: " Night-Time-calls (filter)"
    }, {
        id: 5,
        name: " Pizza_lovers (Alias)"
    }, {
        id: 4,
        name: "IN"
    }, {
        id: 5,
        name: "NOT_IN"
    }];

    $scope.basicAggregationTypes = [{
        id: 1,
        name: "Total Amount"
    }, {
        id: 2,
        name: "Total Count"
    }, {
        id: 3,
        name: "First Time"
    }];

    $scope.subAliasTypes = [{
        id: 1,
        name: "High"
    }, {
        id: 2,
        name: "Medium"
    }, {
        id: 3,
        name: "Low"
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
    }, {
        id: 4,
        name: "subProfile"
    }, {
        id: 5,
        name: "subProfile2"
    }];

    $scope.subProfiles = [{
        id: 1,
        name: "subProfile1"
    }, {
        id: 2,
        name: "subProfile2"
    }, {
        id: 3,
        name: "subProfile3"
    }];


    $scope.conditionBlock = [];

    var equalBlockTemplate = {
        "EQ": {
            "RHS": {}, "LHS": {}
        }
    };

    var graterThanBlockTemplate = {
        "GT": {
            "RHS": {}, "LHS": {}
        }
    };

    var lessThanBlockTemplate = {
        "LT": {
            "RHS": {}, "LHS": {}
        }
    };

    var applyBlockTemplate = {
        "APPLY": {}
    };

    var applyBlockTemplateForAlias = {
        "APPLY": {}
    };

    var inBlockTemplate = {
        "IN": {
            "AND": []
        }
    };

    var profileInBlockTemplate = {
        "IN": {}
    };

    var notInBlockTemplate = {
        "NOT_IN": {}
    };


    $scope.rules = [{id: 1}];
    /**
     * This Method Called When Show Json Button Called
     * @param value
     */
    $scope.showJson = function (value) {
        $scope.anConditionBlock = [];

        $scope.logs = [];
        if (value == 'show') {
            if ($scope.rules.length >= 1) {
                angular.forEach($scope.rules, function (item) {
                        var condition = item.condition;
                        var eventType = item.eventType;
                        var aggregationType = item.aggregationType;
                        var value = item.value;
                        var id = item.id;
                        var finalObj;

                        if (eventType.indexOf("Profile") != -1) {
                            if (aggregationType == "IN") {
                                profileInBlockTemplate.IN.type = "Profile";
                                profileInBlockTemplate.IN.profileId = 7586;
                                profileInBlockTemplate.IN.subProfileId = 7852;
                                profileInBlockTemplate.IN.isImmediate = false;
                                finalObj = profileInBlockTemplate;
                            } else if (aggregationType == "NOT_IN") {
                                notInBlockTemplate.NOT_IN.type = "Profile";
                                notInBlockTemplate.NOT_IN.profileId = 7586;
                                notInBlockTemplate.NOT_IN.subProfileId = 7852;
                                notInBlockTemplate.NOT_IN.isImmediate = false;
                                finalObj = notInBlockTemplate;
                            } else {
                                finalObj = 'Not Supported';
                            }

                        } else {
                            inBlockTemplate.IN.type = "BasicEvent";
                            inBlockTemplate.IN.out = aggregationType;
                            inBlockTemplate.IN.refId = 8;
                            if (aggregationType.indexOf("filter") != -1) {
                                applyBlockTemplate.APPLY.type = "Filter";
                                applyBlockTemplate.APPLY.eventId = 8;
                                applyBlockTemplate.APPLY.refId = 145;

                                applyBlockTemplate.APPLY.out = {
                                    "1": {
                                        "type": "int",
                                        "field": "total_count"
                                    }
                                };

                                equalBlockTemplate.EQ.LHS.value = 1;
                                equalBlockTemplate.EQ.LHS.type = "reference";
                                graterThanBlockTemplate.GT.LHS.value = 1;
                                graterThanBlockTemplate.GT.LHS.type = "reference";
                                lessThanBlockTemplate.LT.LHS.value = 1;
                                lessThanBlockTemplate.LT.LHS.type = "reference";

                                if (condition == "Equals") {
                                    equalBlockTemplate.EQ.RHS.value = value;
                                    equalBlockTemplate.EQ.RHS.unit = "int";
                                    applyBlockTemplate.APPLY.AND = [equalBlockTemplate];
                                    finalObj = applyBlockTemplate;
                                } else if (condition == "grater_than") {
                                    graterThanBlockTemplate.GT.RHS.value = value;
                                    graterThanBlockTemplate.GT.RHS.unit = "int";
                                    applyBlockTemplate.APPLY.AND = [graterThanBlockTemplate];
                                    finalObj = applyBlockTemplate;
                                } else {
                                    lessThanBlockTemplate.LT.RHS.value = value;
                                    lessThanBlockTemplate.LT.RHS.unit = "int";
                                    applyBlockTemplate.APPLY.AND = [lessThanBlockTemplate];
                                    finalObj = applyBlockTemplate;
                                }

                            } else if (aggregationType.indexOf("Alias") != -1) {

                                applyBlockTemplateForAlias.APPLY.type = "Alias";
                                applyBlockTemplateForAlias.APPLY.eventId = 8;
                                applyBlockTemplateForAlias.APPLY.aliasId = 55;
                                applyBlockTemplateForAlias.APPLY.aliasRepresentId = 99;

                                applyBlockTemplateForAlias.APPLY.out = {
                                    "1": {
                                        "type": "int",
                                        "field": "total_count"
                                    }
                                };

                                equalBlockTemplate.EQ.LHS.value = 1;
                                equalBlockTemplate.EQ.LHS.type = "reference";
                                graterThanBlockTemplate.GT.LHS.value = 1;
                                graterThanBlockTemplate.GT.LHS.type = "reference";
                                lessThanBlockTemplate.LT.LHS.value = 1;
                                lessThanBlockTemplate.LT.LHS.type = "reference";

                                if (condition == "Equals") {
                                    equalBlockTemplate.EQ.RHS.value = value;
                                    equalBlockTemplate.EQ.RHS.unit = "int";
                                    applyBlockTemplateForAlias.APPLY.AND = [equalBlockTemplate];
                                    finalObj = applyBlockTemplateForAlias;
                                } else if (condition == "grater_than") {
                                    graterThanBlockTemplate.GT.RHS.value = value;
                                    graterThanBlockTemplate.GT.RHS.unit = "int";
                                    applyBlockTemplateForAlias.APPLY.AND = [graterThanBlockTemplate];
                                    finalObj = applyBlockTemplateForAlias;
                                } else {
                                    lessThanBlockTemplate.LT.RHS.value = value;
                                    lessThanBlockTemplate.LT.RHS.unit = "int";
                                    applyBlockTemplateForAlias.APPLY.AND = [lessThanBlockTemplate];
                                    finalObj = applyBlockTemplateForAlias;
                                }

                            } else {
                                var type = '';
                                if (aggregationType == 'First Time') {
                                    type = "date";
                                } else {
                                    type = "int";

                                }
                                inBlockTemplate.IN.out = {
                                    "1": {
                                        "type": type,
                                        "field": aggregationType
                                    }
                                };

                                equalBlockTemplate.EQ.LHS.value = 1;
                                equalBlockTemplate.EQ.LHS.type = "reference";
                                graterThanBlockTemplate.GT.LHS.value = 1;
                                graterThanBlockTemplate.GT.LHS.type = "reference";
                                lessThanBlockTemplate.LT.LHS.value = 1;
                                lessThanBlockTemplate.LT.LHS.type = "reference";

                                if (condition == "Equals") {
                                    equalBlockTemplate.EQ.RHS.value = value;
                                    equalBlockTemplate.EQ.RHS.unit = "int";
                                    inBlockTemplate.IN.AND = [equalBlockTemplate];
                                    finalObj = inBlockTemplate;
                                } else if (condition == "grater_than") {
                                    graterThanBlockTemplate.GT.RHS.value = value;
                                    graterThanBlockTemplate.GT.RHS.unit = "int";
                                    inBlockTemplate.IN.AND = [graterThanBlockTemplate];
                                    finalObj = inBlockTemplate;
                                } else {
                                    lessThanBlockTemplate.LT.RHS.value = value;
                                    lessThanBlockTemplate.LT.RHS.unit = "int";
                                    inBlockTemplate.IN.AND = [lessThanBlockTemplate];
                                    finalObj = inBlockTemplate;
                                }
                            }

                        }


                        $scope.logs.push(finalObj);
                    }
                )
                ;
            }
            else {
                $scope.logs.push("Empty Rules");
            }
        }
        else {
            $scope.logs.push();
        }
    }

    $scope.$watchCollection('rules', function handleRuleChange(newNames, oldNames) {

    }, true);
    /**
     *  This Method Trigger When Event Type changes
     * @param blockNumber
     */
    $scope.eventTypeChange = function (blockNumber) {
        console.log("Event Type chnage Called {}", blockNumber);
        var eventType = $scope.rules[blockNumber - 1].eventType;
        if (eventType.indexOf("Profile") != -1) {
            if ($scope.aggregationTypes.length < 6) {
                console.log("called")
                var inBlock = {
                    id: 6,
                    name: "IN"
                };
                var notIn = {
                    id: 7,
                    name: "NOT_IN"
                };
                $scope.aggregationTypes.push(inBlock);
                $scope.aggregationTypes.push(notIn);

            }

            console.log("Profile OK")

        } else {

        }

    }
    /**
     *  This Function Add Rule Block(Condition Block)
     */
    $scope.addRuleBlock = function () {
        var newRule = $scope.rules.length + 1;
        this.showJson('show');
        $scope.rules.push({id: newRule});
    };

    $scope.removeRuleBlock = function (blockNumber) {
        $scope.rules.splice(blockNumber - 1, 1);
    };


    /**
     *  Add Full Rule Block (Logic Block)
     * @type {{id: number}[]}
     */
    $scope.ruleFullBlock = [{id: 1}];
    $scope.addFullRuleBlock = function () {
        var newRule = $scope.ruleFullBlock.length + 1;
        $scope.ruleFullBlock.push({id: newRule});
    };

    /**
     *  Remove Parent Rule Block
     * @param blockNumber
     */
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

sampleApp.controller('FarmAppController', function ($scope, $http, $location, $routeParams) {

});
