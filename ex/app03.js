// app03.js
var app = angular.module('app', []);

app.controller('MainCtrl', function($scope) {
    $scope.greet = function() {
	$scope.message = "Hello, " + $scope.user.name;
    }
});
