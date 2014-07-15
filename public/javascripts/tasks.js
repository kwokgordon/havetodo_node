havetodoApp.controller('TasksController', function ($scope, $http) {

	$scope.formData = {};
	$scope.taskTitle = "";
	$scope.tasklist = "";

	$http.get('/api/users/tasks')
		.success(function(data) {
			$scope.tasklist = data.tasklist;
			$scope.taskTitle = data.taskTitle;
			$scope.tasks = data.tasks;
			console.log(data);
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	$http.get('/api/users/tasklists')
		.success(function(data) {
			$scope.tasklists = data.tasklists;
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
		
		$('#CreateTasklistModal').modal('hide');
		
		$http.post('/api/users/tasklists', $scope.formData)
			.success(function(data) {
				$scope.formData = {};
				$scope.tasklists = data.tasklists;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
	
	$scope.tasklists_tasks = function(id) {
		$http.get('/api/users/tasklists/' + id)
			.success(function(data) {
				$scope.tasklist = data.tasklist;
				$scope.taskTitle = data.taskTitle;
				$scope.tasks = data.tasks;
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
		
		$http.post('/api/users/tasks/' + $scope.tasklist, $scope.formData)
			.success(function(data) {
				$scope.formData = {};
				$scope.tasks = data.tasks;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	$scope.deleteTask = function(id) {
		$http.delete('/api/users/tasks/' + id)
			.success(function(data) {
				$scope.tasks = data.tasks;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
	
	$scope.toggleComplete = function(id) {
		$http.post('/api/users/tasks/togglecomplete/' + id)
			.success(function(data) {
				$scope.tasks = data.tasks;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

///////////////////////////////////////////////////////////////
// Other

	$('#CreateTasklistModal').on('shown.bs.modal', function () {
	    $(this).find("[autofocus]:first").focus();
	    $scope.formData.color = getRandomColor();
	});
	
	function getRandomColor() {
	    var letters = '0123456789ABCDEF'.split('');
	    var color = '#';
	    for (var i = 0; i < 6; i++ ) {
	        color += letters[Math.floor(Math.random() * 16)];
	    }
	    return color;
	}
});

