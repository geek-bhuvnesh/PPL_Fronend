PPL_Frontend.controller('ForgetPasswordController',['$scope','$http','$state','$sanitize','forgetPwdData','$timeout',function($scope,$http,$state,$sanitize,forgetPwdData,$timeout){
	console.log("Inside ForgetPasswordController");
    
    $scope.forgetPassword = {
        "email" : "",
        "popUp" : false
    };

    $scope.options = {
     ErrorMessage :"",
     showError : false
   }
   
    $scope.OK = function(){
      
       $timeout(function() {
            $state.go('login');
       },1000);

    }

    $scope.closePopUP = function(){
    	$scope.forgetPassword.popUp = false;
    }

   $scope.forgetPassword = function() {
    $scope.options.showError = false;
   console.log("ForgetPassword is called");

	 var email = $sanitize($scope.forgetPassword.email);

    if(email) {
  	forgetPwdData.forgetPasswordFn(email).then(function(data){
       console.log("Forget Password Result:",data);
       $scope.forgetPassword.popUp = true;

      },function(err){
        $scope.options.showError = true;
        $scope.options.ErrorMessage = err.data;
      })
    } else {
      $scope.options.showError = true;
      $scope.options.ErrorMessage = 'Please enter a valid Emailid';
    } 
  } 
     
}])