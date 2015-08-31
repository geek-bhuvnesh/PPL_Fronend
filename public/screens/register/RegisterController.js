PPL_Frontend.controller('RegisterController',['$scope','$http','$sanitize','SignUpDataFactory','$state','localstorageFactory',function($scope,$http,$sanitize,SignUpDataFactory,$state,localstorageFactory){
	console.log("Inside RegisterController");
   
    $scope.loginData ={
        "firstname" : "",
        "lastname" : "",
        "email" : "",
        "password" : "",
        "termsagreement" :""
    };
    $scope.options = {
        ErrorMessage :"",
        showError : false
    }

    $scope.checkbox = {
    	buttonClicked :false
    }	

    //$scope.loginPopUp = true;
    $scope.Signup = function(){
        //console.log("submit signup data");
    
        //$rootScope.$broadcast('loading:show');
        $scope.loginData.firstname = $sanitize($scope.loginData.firstname);
        console.log("$scope.loginData.name:", $scope.loginData.firstname);

        $scope.loginData.lastname = $sanitize($scope.loginData.lastname);
        $scope.loginData.email = $sanitize($scope.loginData.email);           
        $scope.loginData.password = $sanitize($scope.loginData.password);
        $scope.loginData.confirmPassword = $sanitize($scope.loginData.confirmPassword);


        if(!validator.isByteLength($scope.loginData.firstname,3,10)){
          //alert("User Name must contain 3 charatcer and Max 10 char:");
          console.log("1");
          $scope.options.showError = true;
          $scope.options.errorMessage = "First Name must contain 3 charatcer and Max 10 char:";
          return;
        }
        
        if(!validator.isEmail($scope.loginData.email)){
          console.log("2");
          $scope.options.showError = true;
          $scope.options.errorMessage = "Please Enter valid Email:";
          return;
        }
        if(!$scope.loginData.termsagreement){
          console.log("0");
          $scope.checkbox.buttonClicked = true;
          return;
        } 
        if ($scope.loginData.password != $scope.loginData.confirmPassword) {
        	console.log("3");
            alert("These passwords don't match. Try again");
        } else if ($scope.loginData.password.length < 8) {
            alert("password must contain more than 8 charachters:")
        }else {
          console.log("4");
          $scope.signUpDetails = {
          	    firstname : $scope.loginData.firstname,
                lastname: $scope.loginData.lastname,
                email: $scope.loginData.email,
                password: $scope.loginData.password,
                confirm_password : $scope.loginData.confirmPassword
          };
          console.log("Sign up Details:" + JSON.stringify($scope.signUpDetails));
          
          SignUpDataFactory.registerUser($scope.signUpDetails).then(function(data){
            console.log("Singup Data:" ,JSON.stringify(data));
            //$state.go('verifyloading');
            /*$rootScope.verifiedUser = false;*/
            localstorageFactory.setVerified("verifiedUser",false);
            $state.go('login');
            
           },function(err){
            if (err.status == 400) {
             $scope.passwordErrorMessage = err.data;
          }
         })
        }

    }

}])