PPL_Frontend.controller('PostController',['$scope','$http','$state','localstorageFactory','PostDataService','$sanitize','HomeDataService',function($scope,$http,$state,localstorageFactory,PostDataService,$sanitize,HomeDataService){
	console.log("Inside PostController");
	 $scope.userData = localstorageFactory.getUserData('userData');
	 $scope.postData = localstorageFactory.getUserData('postData');
	 $scope.categoryData = localstorageFactory.getUserData('categoryData'); 

	 console.log("userData in Postcontroller:" +JSON.stringify($scope.userData));
	 console.log("postData in Postcontroller:" +JSON.stringify($scope.postData));

	 $scope.addComment = {
	 	"commentText" : ""
	 }

	 $scope.addCommentFun = function(){
	 console.log("Inside addCommentFun");	

	 $scope.addComment.commentText = $sanitize($scope.addComment.commentText);
     $scope.addComment.postid = $scope.postData._id;
     $scope.addComment.createdBy = $scope.userData._id;
     
     console.log("Add comment Data Before:" +JSON.stringify($scope.addComment));

	   PostDataService.addComment($scope.addComment).then(function(data){
	 	  console.log("Add comment Data Success:" +JSON.stringify(data));
	 	   localstorageFactory.setPostData('postData',data)
	 	  $scope.postData = data;
	   },function(err){

	   });	

	 }

	$scope.postsShow = 5;

	 $scope.viewMore = function(){
	
	 $scope.postsShow = $scope.postsShow + 5;

	 }

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