PPL_Frontend.controller('ResetPasswordController',['$scope','$http','$state','$stateParams','$sanitize','resetPwdData','$timeout',function($scope,$http,$state,$stateParams,$sanitize,resetPwdData,$timeout){
	console.log("Inside ResetPasswordController");

    $scope.reset ={
    	password : "",
    	confirm_password :""
    }
    $scope.options = {
        ErrorMessage :"",
        showError : false,
        "popUp" : false
    }

    console.log("state params:" ,$stateParams);
    console.log("state params email:" ,$stateParams.email);
    console.log("state params token:" ,$stateParams.reset_pass_token);
   
    $scope.OK = function(){
      
       $timeout(function() {
            $state.go('login');
       },1000);

    }

    $scope.resetPassword = function() {
      $scope.options.showError = false;
      console.log("ResetPassword is called");

      $scope.reset.password = $sanitize($scope.reset.password);
      $scope.reset.confirm_password = $sanitize($scope.reset.confirm_password);

      if($scope.reset.password.length<8){
         $scope.options.showError = true;
         $scope.options.ErrorMessage = "Password must contain more than 8 charachters:";
         return;
      }

      var resetPasswordData = {"password": $scope.reset.password, "confirm_password": $scope.reset.confirm_password, "reset_pass_token": $stateParams.reset_pass_token, "email": $stateParams.email};
      console.log("login details are after reset Password: " + JSON.stringify(resetPasswordData) );
    
      if (resetPasswordData.password && resetPasswordData.confirm_password) {
        if(resetPasswordData.password == resetPasswordData.confirm_password) {

      	resetPwdData.resetPasswordFn(resetPasswordData).then(function(data){
            console.log("Reset Password Data on success:" + JSON.stringify(data));
            $scope.options.popUp = true;
            //$state.go('login');
          },function(err){
          	$scope.options.showError = true;
            $scope.options.ErrorMessage = err.data;
          })
       } else {
       	 $scope.options.showError = true;
         $scope.options.ErrorMessage = "400_password_not_matched";
       }
     } else {
       $scope.options.showError = true;	
       $scope.options.ErrorMessage = "password_and_confirm_password_cannot_blank";
     } 
  } 


}])