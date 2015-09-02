PPL_Frontend.controller('HomeController',['$scope','$http','HomeDataService','localstorageFactory','$state',function($scope,$http,HomeDataService,localstorageFactory,$state){
	console.log("Inside Controller");
	/*$http.get('http://localhost:8000/home').success(function(data){
        console.log("Data:",data);
	});
*/

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
/*$(document).ready(function() {
	$('#rght_cat_bg').click(function() {
			$('.rght_list').toggle("slide");
	});
});
$(document).ready(function() {
	$('#opn_cat_bg').click(function() {
			$('.sub_dwn').toggle("slide");
	});
});
*/



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