var servicesModule = angular.module('myApp.services', []);

servicesModule.factory('errorService', function() {
    return {
	errorMessage: null,
	setError: function(msg) {
	    this.errorMessage = msg;
	},
	clear: function() {
	    this.errorMessage = null;
	}
    };
});

// USAGE: <div alert-bar alertMessage="myMessageVar"></div>
angular.module('myApp.directives', []).
directive('alertBar', ['$parse', function($parse) {
    return {
	restrict: 'A',
	template: '<div class="alert alert-error alert-bar"' +
	    'ng-show="errorMessage">' +
	    '<button type="button" class="close" ng-click="hideAlert()">' +
	    'x</button>' +
	    '{{errorMessage}}</div>',
	
	link: function(scope, elem, attrs) {
	    var alertMessageAttr = attrs['alertmessage'];
	    scope.errorMessage = null;
	    
	    scope.$watch(alertMessageAttr, function(newVal) {
		scope.errorMessage = newVal;
	    });
	    scope.hideAlert = function() {
		scope.errorMessage = null;
		// Also clear the error message on the bound variable.
		// Do this so that if the same error happens again
		// the alert bar will be shown again next time.
		$parse(alertMessageAttr).assign(scope, null);
	    };
	}
    };
}]);

app.controller('RootController',
	       ['$scope', 'ErrorService', function($scope, ErrorService) {
    $scope.errorService = ErrorService;
});

servicesModule.config(function ($httpProvider) {
    $httpProvider.responseInterceptors.push('errorHttpInterceptor');
});

// register the interceptor as a service
// intercepts ALL angular ajax HTTP calls
servicesModule.factory('errorHttpInterceptor',
    function ($q, $location, ErrorService, $rootScope) {
  return function (promise) {
    return promise.then(function (response) {
      return response;
    }, function (response) {
      if (response.status === 401) {
	$rootScope.$broadcast('event:loginRequired');
      } else if (response.status >= 400 && response.status < 500) {
	ErrorService.setError('Server was unable to find' +
          ' what you were looking for... Sorry!!');
      }
      return $q.reject(response);
    });
  };
});

$scope.$on('event:loginRequired', function() {
    $location.path('/login');
});

// This factory is only evaluated once, and authHttp is memorized. That is,
// future requests to authHttp service return the same instance of authHttp
servicesModule.factory('authHttp', function($http, Authentication) {
    var authHttp = {};
    
    // Append the right header to the request
    var extendHeaders = function(config) {
	config.headers = config.headers || {};
	config.headers['Authorizations'] = Authentication.getTokenType() +
	    ' ' + Authentication.getAccessToken();
    };

    // Do this for each $http call
    angular.forEach(['get', 'delete', 'head', 'jsonp'], function(name) {
	authHttp[name] = function(url, config) {
	    config = config || {};
	    extendHeaders(config);
	    return $http[name](url, config);
	};
    });

    angular.forEach(['post', 'put'], function(name) {
	authHttp[name] = function(url, data, config) {
	    config = config || {};
	    extendHeaders(config);
	    return $http[name](url, data, config);
	};
    });

    return authHttp;
});
