PPL_Frontend.controller('ForgetPasswordController',['$scope','$http','$state','$sanitize','forgetPwdData','$timeout',function($scope,$http,$state,$sanitize,forgetPwdData,$timeout){
	console.log("Inside ForgetPasswordController");
    
    $scope.forgetPassword = {
        "email" : "",
        "popUp" : false
    };
   
    $scope.OK = function(){
      
       $timeout(function() {
            $state.go('login');
       },2000);

    }

    $scope.closePopUP = function(){
    	$scope.forgetPassword.popUp = false;
    }

    $scope.forgetPassword = function() {
    
    console.log("ForgetPassword is called");

	var email = $sanitize($scope.forgetPassword.email);

    if(email) {
  	forgetPwdData.forgetPasswordFn(email).then(function(data){
       console.log("Forget Password Result:",data);
       $scope.forgetPassword.popUp = true;

      },function(err){
        $scope.errorMessage = err.data;
      })
    } else {
      $scope.errorMessage = 'Please enter a valid Emailid';
    } 
  } 
     
}])