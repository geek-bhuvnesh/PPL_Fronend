PPL_Frontend.controller('PostController',['$scope','$http','$state','localstorageFactory','PostDataService','$sanitize','HomeDataService','$filter','$timeout',function($scope,$http,$state,localstorageFactory,PostDataService,$sanitize,HomeDataService,$filter,$timeout){
	 console.log("Inside PostController");
	 $scope.userData = localstorageFactory.getUserData('userData');
	 $scope.postData = localstorageFactory.getPostData('postData');
	 $scope.categoryArrayData = localstorageFactory.getCategoryData('categoryData'); 
	 $scope.featuredPostsData = localstorageFactory.getFeaturedData('featuredData'); 


     /*if(!$scope.postData.hasOwnProperty("likeOrUnlike") && !$scope.postData.hasOwnProperty("flagOrUnflag")){
      console.log("1");	
      $scope.postData["likeOrUnlike"] = "Likes";
      $scope.postData["flagOrUnflag"] = "Flag";
     } else if($scope.postData.hasOwnProperty("likeOrUnlike") && $scope.postData.hasOwnProperty("flagOrUnflag")) {
      console.log("2");	
      $scope.postData["likeOrUnlike"] = "Unlike";
      $scope.postData["flagOrUnflag"] = "Unflag";
     } else if($scope.postData.hasOwnProperty("likeOrUnlike") && !$scope.postData.hasOwnProperty("flagOrUnflag") ){
      console.log("3");	
      $scope.postData["likeOrUnlike"] = "Unlike";
      $scope.postData["flagOrUnflag"] = "Flag";
     } else if(!$scope.postData.hasOwnProperty("likeOrUnlike") && $scope.postData.hasOwnProperty("flagOrUnflag")){
      console.log("4");	
      $scope.postData["likeOrUnlike"] = "Like";
      $scope.postData["flagOrUnflag"] = "Unflag";
     }

*/
  
   /*console.log("Comments Length:" ,$scope.postData.comments.length);
	 console.log("userData in Postcontroller:" +JSON.stringify($scope.userData));
	 console.log("postData in Postcontroller:" +JSON.stringify($scope.postData));
	 console.log("categoryData in Postcontroller:" +JSON.stringify($scope.categoryArrayData));*/
	 console.log("featuredArrayData in Postcontroller,length:" +JSON.stringify($scope.featuredPostsData) ,$scope.featuredPostsData.length);

	 $scope.addComment = {
	 	"commentText" : ""
	 }

	 $scope.addCommentFun = function(){
	 console.log("Inside addCommentFun");	

	 $scope.addComment.commentText = $sanitize($scope.addComment.commentText);
     $scope.addComment.postid = $scope.postData._id;
     $scope.addComment.createdBy = $scope.userData._id;

	   PostDataService.addComment($scope.addComment).then(function(data){
	 	  console.log("Add comment Data Success:" +JSON.stringify(data));
	 	   localstorageFactory.setPostData('postData',data)
	 	   $scope.postData = data;
	   },function(err){

	   });	

	 }

	$scope.postsShow = 2;

	 $scope.viewMore = function(){
	
	 $scope.postsShow = $scope.postsShow + 2;
   $scope.getNewComments();

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
  var getCommentsLength = 100;

  $scope.getNewComments = function() {
       
      //console.log("Id,ExistCommLength,limit BEFORE:" ,$scope.postData._id,$scope.postData.commentcount,getCommentsLength); 
      PostDataService.getNewComments($scope.postData._id,$scope.postData.commentcount,getCommentsLength).then(function(data){
          console.log("New Comments Array Data:" +JSON.stringify(data));
          console.log("length:" ,data.comments.length);
          if(data.comments.length>0){
            $scope.postData["comments"] = data.comments
            $scope.postData["commentcount"] = data.comments.length;
          } else {
            $scope.newCommentsArray.count = 0;
            $scope.newCommentsArray = [];
          }
      },function(err){

      })
           // start next API call after some timeout
      $timeout(function() {
          $scope.getNewComments();
      }, 20000);  

 }

 $scope.gotToProfile = function(){
    console.log("got to myprofile")
    $state.go('myprofile', {userId: $scope.userData._id });
  }
  

   //Like or unlike work

 $scope.likeOrUnlike = function(selectedPost,likeOrUnlike){
  console.log("selectedPost:" +JSON.stringify(selectedPost));
  console.log("like or unlike:" +likeOrUnlike);

  if(likeOrUnlike =="Likes"){
    $scope.likeDetails ={};
    $scope.likeDetails.postid = selectedPost._id,
    $scope.likeDetails.likeby = $scope.userData._id;
    console.log("Like details:" +JSON.stringify($scope.likeDetails));

    HomeDataService.likeUpdate($scope.likeDetails).then(function(data){
    console.log("Like Data success:" +JSON.stringify(data));
   
    if(data.likeby.indexOf($scope.likeDetails.likeby)>-1){
      data["likeOrUnlike"] = "Unlike";
      if(data.flagby.indexOf($scope.userData._id)>-1){
           data["flagOrUnflag"] = "Unflag";
           $scope.postData = data;
      } else {
           data["flagOrUnflag"] = "Flag";
           $scope.postData = data;
      }
  
    } else {
  
      data["likeOrUnlike"] = "Likes";
      if(data.flagby.indexOf($scope.userData._id)>-1){
           data["flagOrUnflag"] = "Unflag";
           $scope.postData = data;
      } else {
           data["flagOrUnflag"] = "Flag";
           $scope.postData = data;
      }
  
    }

    },function(err){

    })
  } else if(likeOrUnlike =="Unlike"){
    $scope.unlikeDetails ={};
    $scope.unlikeDetails.postid = selectedPost._id,
    $scope.unlikeDetails.likeby = $scope.userData._id;
    console.log("unlike details:" +JSON.stringify($scope.unlikeDetails));

    HomeDataService.unlikeUpdate($scope.unlikeDetails).then(function(data){
      console.log("Unlike Data success:" +JSON.stringify(data));
      data["likeOrUnlike"] = "Likes"
      if(data.flagby.indexOf($scope.userData._id)>-1){
           data["flagOrUnflag"] = "Unflag";
           $scope.postData = data;
      } else {
           data["flagOrUnflag"] = "Flag";
           $scope.postData = data;
      }

    },function(err){

    })  

  }

 }

 //Flag or unflag work
  
  $scope.flagOrUnflag = function(selectedPost,flagOrUnflag){
  console.log("selectedPost:" +JSON.stringify(selectedPost));
  console.log("flag or flagOrUnflag:" +flagOrUnflag);

  if(flagOrUnflag =="Flag"){
    $scope.flagDetails ={};
    $scope.flagDetails.postid = selectedPost._id,
    $scope.flagDetails.flagby = $scope.userData._id;
    console.log("Flag details:" +JSON.stringify($scope.flagDetails));

    HomeDataService.flagUpdate($scope.flagDetails).then(function(data){
    console.log("Flag Data success:" +JSON.stringify(data));
  
    if(data.flagby.indexOf($scope.flagDetails.flagby)>-1){
      data["flagOrUnflag"] = "Unflag";
      if(data.likeby.indexOf($scope.userData._id)>-1){
           data["likeOrUnlike"] = "Unlike";
           $scope.postData = data;
      } else {
           data["likeOrUnlike"] = "Likes";
           $scope.postData = data;
      }
  
  
    } else {
  
      data["flagOrUnflag"] = "Flag";
      if(data.likeby.indexOf($scope.userData._id)>-1){
           data["likeOrUnlike"] = "Unlike";
           $scope.postData = data;
      } else {
           data["likeOrUnlike"] = "Likes";
          $scope.postData = data;
      }
  
    }

    },function(err){

    })
  } else if(flagOrUnflag =="Unflag"){
    $scope.unflagDetails ={};
    $scope.unflagDetails.postid = selectedPost._id,
    $scope.unflagDetails.flagby = $scope.userData._id;
    console.log("unflag details:" +JSON.stringify($scope.unflagDetails));

    HomeDataService.unflagUpdate($scope.unflagDetails).then(function(data){
      console.log("unflag Data success:" +JSON.stringify(data));
     
      data["flagOrUnflag"] = "Flag"
      if(data.likeby.indexOf($scope.userData._id)>-1){
           data["likeOrUnlike"] = "Unlike";
           $scope.postData = data;
      } else {
           data["likeOrUnlike"] = "Likes";
           $scope.postData = data;
      }

    },function(err){

    })  

  }

 }





}])