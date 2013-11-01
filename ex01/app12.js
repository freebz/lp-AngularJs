// app.js
var app = angular.module('app', []);

app.controller('MainCtrl', function($scope, UserInformation) {
    $scope.user = UserInformation;
});

app.controller('SecondCtrl', function($scope, UserInformation) {
    $scope.user = UserInformation;
});

app.factory('UserInformation', function() {
    var user = {
	name: "Angular.js"
    };

    return user;
});
