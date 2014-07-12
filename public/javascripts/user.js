havetodoApp.controller('UserController', function ($scope, $http) {

	$scope.formData = {};

////////////////////////////////////////////////////////////////////////

	$scope.signup = function() {
		$scope.message = [];
		$scope.error = [];

		$http.post('/signup', $scope.formData)
			.success(function(data) {
				$scope.formData = {};
				$scope.message = data.message;
				$scope.error = data.error;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
	
	$scope.login = function() {
		$scope.message = [];
		$scope.error = [];

		$http.post('/login', $scope.formData)
			.success(function(data) {
				$scope.formData = {};
				$scope.message = data.message;
				$scope.error = data.error;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
});

