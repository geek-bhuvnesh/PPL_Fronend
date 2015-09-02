PPL_Frontend.controller('HomeController',['$scope','$http','HomeDataService','localstorageFactory','$state',function($scope,$http,HomeDataService,localstorageFactory,$state){
 console.log("Inside Controller");
	
 $scope.User_logged_in = true;
 console.log("1:",localstorageFactory.getUserData('userData').email);
 if(!localstorageFactory.getUserData('userData').email){
 	  console.log("2");
    $scope.User_logged_in = false;
    //$state.go('login');
 }
 console.log("is User_logged_in:" +$scope.User_logged_in);
 $scope.userData = localstorageFactory.getUserData('userData');
 console.log("userData in HomeController" ,$scope.userData);

 HomeDataService.getAllCategories().then(function(data){
  console.log("Catgeory Data in Home Controller:" + JSON.stringify(data));
  $scope.categories = data;

 },function(err){

 })

 $scope.logout = function(){
    console.log("Logout called");

    HomeDataService.logout().then(function(data){
      console.log("Logout Data:" ,data);
      localstorageFactory.removeUser("userData");
      $state.go('login');	

    },function(err){

    })

  }

}])