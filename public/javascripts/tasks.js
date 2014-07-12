var havetodoApp = angular.module('havetodoApp',[]);

havetodoApp.controller('TasksController', function ($scope, $http) {

	$scope.formData = {};

	$http.get('/api/users/tasks')
		.success(function(data) {
			$scope.tasks = data;
			console.log(data);
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	$http.get('/api/users/tasklists')
		.success(function(data) {
			$scope.tasklists = data;
			console.log(data);
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

////////////////////////////////////////////////////////////////////////
// Tasklist
	$scope.createTasklist = function() {
		if($scope.formData.name == undefined || $scope.formData.name.trim() == "")
			return;
		
		$('#CreateTasklistModal').modal('hide')
		
		$http.post('/api/users/tasklists', $scope.formData)
			.success(function(data) {
				$scope.formData.name = undefined;
				$scope.tasklists = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

////////////////////////////////////////////////////////////////////////
// Task
	$scope.createTask = function() {
		if($scope.formData.name == undefined || $scope.formData.name.trim() == "")
			return;
		
		$http.post('/api/users/tasks', $scope.formData)
			.success(function(data) {
				$scope.formData.name = undefined;
				$scope.tasks = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	$scope.deleteTask = function(id) {
		$http.delete('/api/users/tasks/' + id)
			.success(function(data) {
				$scope.tasks = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
	
	$scope.toggleComplete = function(id) {
		$http.post('/api/users/tasks/togglecomplete/' + id)
			.success(function(data) {
				$scope.tasks = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};


});

