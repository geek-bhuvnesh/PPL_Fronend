PPL_Frontend.controller('RegisterController',['$scope','$http','$sanitize','SignUpDataFactory','$state','localstorageFactory','$timeout',function($scope,$http,$sanitize,SignUpDataFactory,$state,localstorageFactory,$timeout){
	console.log("Inside RegisterController");
   
    $scope.loginData ={
        "firstname" : "",
        "lastname" : "",
        "email" : "",
        "password" : "",
        "confirmPassword" :"",
        "termsagreement" :"",
        "popUp" : false
    };
    $scope.options = {
        ErrorMessage :"",
        showError : false
    }

    $scope.checkbox = {
    	buttonClicked :false
    }	

    $scope.hideErromessOnchange= function(){
        $scope.options.showError = false;
        $scope.checkbox.buttonClicked = false;
    }

    $scope.OK = function(){
      
       $timeout(function() {
            $state.go('login');
       },1000);

    }

   /* $scope.closePopUP = function(){
      $scope.loginData.popUp = false;
    }*/

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
          console.log("1");
          //alert("User Name must contain 3 charatcer and Max 10 char:");
          $scope.options.showError = true;
          $scope.options.ErrorMessage = "First name must contain 3 charatcer and Max 10 charachters";
          return;
        }
        
        if(!validator.isEmail($scope.loginData.email)){
          console.log("2");
          $scope.options.showError = true;
          $scope.options.ErrorMessage = "Please enter Email id";
          return;
        }
        if(!$scope.loginData.termsagreement){
          console.log("3");
          $scope.checkbox.buttonClicked = true;
          return;
        } 
        if ($scope.loginData.password.length < 8) {
          console.log("4");
          $scope.options.showError = true;
          $scope.options.ErrorMessage = "password must contain more than 8 charachters";
          return;
        }  
        if($scope.loginData.password != $scope.loginData.confirmPassword) {
          console.log("5");
          $scope.options.showError = true;
          $scope.options.ErrorMessage = "These passwords don't match. Try again";
          return;
        }  
        else {
          console.log("6");
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
            $scope.loginData.popUp = true;
            //$state.go('verifyloading');
            /*$rootScope.verifiedUser = false;*/
            localstorageFactory.setVerified("verifiedUser",false);
            //$state.go('login');
            
           },function(err){
             console.log("err.data:",err.data);
             $scope.options.showError = true; 
             $scope.options.ErrorMessage = err.data;
         })
        }

    }

}])