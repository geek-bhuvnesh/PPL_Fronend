PPL_Frontend.controller('MyProfileController',['$scope','$http','localstorageFactory','$sanitize','Upload','pplconfig','editProfileFactory','MyProfile','$filter',function($scope,$http,localstorageFactory,$sanitize,Upload,pplconfig,editProfileFactory,MyProfile,$filter){
	console.log("Inside profileController");

	$scope.userData = localstorageFactory.setUserData('userData',MyProfile);

	console.log("User Data in Profile controller:" +JSON.stringify($scope.userData));
    console.log("My Profile:" +JSON.stringify(MyProfile));
    console.log("Date type:" + typeof MyProfile.dob);

	$scope.myProfileData = {};
	$scope.myProfileData["photo"] = MyProfile.photo;
	$scope.myProfileData["name"] = MyProfile.username;
	$scope.myProfileData["email"] = MyProfile.email;
    $scope.myProfileData["dob"] =  MyProfile.dob;

    //moment(MyProfile.dob);
    $scope.myProfileData["contact_no"] = MyProfile.contact_no;
    $scope.myProfileData["userId"] = MyProfile._id;
     console.log("My Profile dob:" +$scope.myProfileData.dob);
     console.log("My Profile Data:" +JSON.stringify($scope.myProfileData));

	$scope.options = {
        ErrorMessage :"",
        showError : false,
        editProPopUp : false
    }

    $scope.upload = function ($files) {
      console.log("files:",$files);
       for (var i = 0; i < $files.length; i++) {
        var file = $files[i]; 
        console.log("file:",file)
        Upload.upload({
            url: pplconfig.url+":3000/imageUpload",
            method: 'POST',
            fields: {'imgType': "user"},
            file: file
        }).progress(function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
        }).success(function (data, status, headers, config) {
            console.log("Data:",data);
            console.log("File path:",data.path);
            //$scope.myProfileData.photo = data.path.replace("home/com52/PPL/PPL_SITE/PPL_Backend/fileUpload", '');
           //$scope.myProfileData.photo = data.path;
            console.log("Photo:" +$scope.myProfileData.photo);
        }).error(function (data, status, headers, config) {
            console.log('error status: ' + status);
            $scope.options.showError = true;
            $scope.options.ErrorMessage = data;
        })
       } 
    };
    

	$scope.editProfilePopUp = function(){
		$scope.options.editProPopUp = true;
        $scope.myProfileData.dob = $filter("date")($scope.myProfileData.dob, 'yyyy-MM-dd');
    
	}
   
   $scope.editProfile = function(){

       editProfileFactory.editProfileFn($scope.myProfileData).then(function(data){
            console.log("Edit profile Success data:" +JSON.stringify(data));
            $scope.options.editProPopUp = false;

        },function(err){

   }) 
   }
  
   $scope.closeEditProfilePopUp = function(){
     $scope.options.editProPopUp = false;

   }

}])