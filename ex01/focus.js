// focus.js
var app = angular.module('app', []);

app.directive('focus', function() {
    return {
	link: function(scope, element, attrs) {
	    element[0].focus();
	}
    };
});
