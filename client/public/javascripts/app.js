angular.module('nodeExpense', [])

.controller('mainController', function($scope, $http) {

    $scope.formData = {};
    $scope.expenseData = {};

    // Get all expenses
    $http.get('/api/v1/expenses')
        .success(function(data) {
            $scope.expenseData = data;
            console.log(data);
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });

    // Create a new expense
    $scope.createexpense = function(expenseID) {
        $http.post('/api/v1/expenses', $scope.formData)
            .success(function(data) {
                $scope.formData = {};
                $scope.expenseData = data;
                console.log(data);
            })
            .error(function(error) {
                console.log('Error: ' + error);
            });
    };

    // Delete a expense
    $scope.deleteexpense = function(expenseID) {
        $http.delete('/api/v1/expenses/' + expenseID)
            .success(function(data) {
                $scope.expenseData = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

});
