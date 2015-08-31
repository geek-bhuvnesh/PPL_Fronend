PPL_Frontend.controller('VerifyController', ['$scope', '$http', '$state', '$stateParams','VerifyUserFactory','$rootScope','localstorageFactory', function($scope, $http, $state, $stateParams,VerifyUserFactory,$rootScope,localstorageFactory) {
   
    console.log("Email id in  verify controller:" + $stateParams.email);
    console.log("verification code in verify controller:" + $stateParams.verification_code);


    $scope.verifyUserDeatils = {
        email: $stateParams.email,
        verification_code: $stateParams.verification_code,
    };
    console.log("Verify User Deatils:" + JSON.stringify($scope.verifyUserDeatils));
          
    VerifyUserFactory.verifyUser($scope.verifyUserDeatils).then(function(data){
            console.log("verifyUserDeatils Data:" ,JSON.stringify(data));
            //$rootScope.verifiedUser = true;
            localstorageFactory.setVerified("verifiedUser",true);
            
           },function(err){
            if (err.status == 400) {
             
          }
      })
    }]);