
PPL_Frontend.controller('ChangePasswordController', ["changePwdData","$scope","$sanitize","$state","localstorageFactory","$timeout",function(changePwdData, $scope, $sanitize,$state,localstorageFactory,$timeout) {
  // $scope.errorMessage = "here error accur";
  $scope.change_password_data = {};
  $scope.userData = localstorageFactory.getUserData('userData');
  console.log("User Data in Change Password Controller:" +JSON.stringify($scope.userData));
  
  $scope.options = {
     ErrorMessage :"",
     showError : false,
     "popUp" : false
  }

  $scope.hideErromessOnchange= function(){
        $scope.options.showError = false
  }

  $scope.OK = function(){
      
       $timeout(function() {
            $state.go('login');
       },1000);

  }

  $scope.changePassword = function() {
    console.log("Changepassword is called");

     if($scope.userData){

      $scope.change_password_data.current_password = $sanitize($scope.change_password_data.current_password);
      $scope.change_password_data.new_password = $sanitize($scope.change_password_data.new_password);
      $scope.change_password_data.confirm_password = $sanitize($scope.change_password_data.confirm_password);
      
      var changePasswordData = {"current_password": $scope.change_password_data.current_password,
                                "new_password": $scope.change_password_data.new_password,
                                "confirm_password": $scope.change_password_data.confirm_password}
      changePasswordData["userId"] =  $scope.userData._id;   

      console.log("Change Password requested Data:" +JSON.stringify(changePasswordData));
      if(!changePasswordData.current_password){
        console.log("1");
        $scope.options.showError = true;
        $scope.options.ErrorMessage = "Old Password can not be blank";
        return;
      }                 
      else if (!changePasswordData.new_password || !changePasswordData.confirm_password) {
        console.log("2");
        $scope.options.showError = true;
        if(!changePasswordData.new_password && !changePasswordData.confirm_password){
          $scope.options.ErrorMessage = "New Password and Confirm Password Fields can not be blank"
        }
        else if(!changePasswordData.new_password){
          $scope.options.ErrorMessage = "New password cannot be blank";
        }
        else if(!changePasswordData.confirm_password){
          $scope.options.ErrorMessage = "Confirm password cannot be blank";
        }
        return;
      } else if (changePasswordData.new_password != changePasswordData.confirm_password) {
        console.log("3");
        $scope.options.showError = true;
        $scope.options.ErrorMessage = "Password not matched";
        return;
      } else if(changePasswordData.current_password == changePasswordData.new_password){
        console.log("4");
        $scope.options.showError = true;
        $scope.options.ErrorMessage = "Please enter different value to change password";
        return;
      }else {
        console.log("5");
        changePwdData.changePasswordFn(changePasswordData).then(function(data){
          console.log("change Password result:" +JSON.stringify(data));
          $scope.options.popUp = true;
        },function(err){
          $scope.options.showError = true;
          $scope.options.ErrorMessage = err.data;
        })
      } 
    } else{
       $state.go('login');
    }  
        
  }
}]);

