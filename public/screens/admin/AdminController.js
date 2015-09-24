PPL_Frontend.controller('AdminController',['$scope','$http','$state','$sanitize','$timeout','localstorageFactory',function($scope,$http,$state,$sanitize,$timeout,localstorageFactory){
	console.log("Inside AdminController");
  
  $scope.userData = localstorageFactory.getUserData('userData');
  $scope.categoryArrayData = localstorageFactory.getCategoryData('categoryData'); 
  console.log("categoryData in Admin:" +JSON.stringify($scope.categoryArrayData));  
  
     
}])