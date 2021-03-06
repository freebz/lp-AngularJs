var appModule = angular.module('app', []);

appModule.directive('ngbkFocus', function() {
    return {
	link: function(scope, element, attrs, controller) {
	    element[0].focus();
	}
    };
});

function SomeController($scope) {
    $scope.message = { text: 'nothing clicked yet' };
    
    $scope.clickUnfocused = function() {
	$scope.message.text = 'unfocused button clicked';
    };

    $scope.clickFocused = function() {
	$scope.message.text = 'focus button clicked';
    }
}

//var appModule = angular.module('app', ['directives']);
