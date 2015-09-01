PPL_Frontend.controller('LoginController',['$scope','$http','$state','$rootScope','localstorageFactory','LoginDataService','$sanitize', function($scope,$http,$state,$rootScope,localstorageFactory,LoginDataService,$sanitize){
	console.log("Inside LoginController");
	console.log("1:" + $rootScope.verifiedUser);
	console.log("localstorageFactory.getVerified(verifiedUser):" + localstorageFactory.getVerified("verifiedUser"));
    //var userData = localstorageFactory.getObject("userData");

    $scope.loginData ={
        "email" : "",
        "password" : "",
        "rememberme" :""
    };
    $scope.options = {
        ErrorMessage :"",
        showError : false
    }

    $scope.checkbox = {
    	buttonClicked :false
    }	

	/*if(localstorageFactory.getVerified("verifiedUser")) {*/

	  $scope.validateLogin = function () {
	  console.log("Inside validate Login method:");	
       
      if(validator.isEmail($scope.loginData.email)){
 
        if (!$scope.loginData.password && !$scope.loginData.email) {
            $scope.options.showError = true;
            $scope.options.ErrorMessage = "Username(Email Id) and Password are Required:";
            return ;

        } else if(!$scope.loginData.rememberme){
          $scope.checkbox.buttonClicked = true;
          return;

        } else {

            $scope.loginData.email = $sanitize($scope.loginData.email);
            $scope.loginData.password = $sanitize($scope.loginData.password);
            var userLoginData = {"email":$scope.loginData.email,"password":$scope.loginData.password};
           
            LoginDataService.fetchLoginData(userLoginData).then(function (data) {
                console.log("Data Login:" + JSON.stringify(data));
                console.log(">:" + data.verified);
                console.log("> type:" + typeof data.verified);
                if(data.verified == "true"){
                   $scope.options.showError = false;
                   localstorageFactory.setUserData('userData',data)
                   $state.go('home');
                } else {
                   $scope.options.showError = true;
                   console.log("email address is not valid:");
                   $scope.options["ErrorMessage"] = "User is not verified,please verify before login";
                }  
               
            },function (err) {
               $scope.options.showError = true;
               console.log("err:",err);
               $scope.options["ErrorMessage"] = err.data;
            })

        }

      } else {
          $scope.options.showError = true;
          console.log("email address is not valid:");
          $scope.options["ErrorMessage"] = "Please Enter valid Email address";
      }

     }       //close validateLogin function 
   
  
   

}])