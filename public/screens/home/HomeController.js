PPL_Frontend.controller('HomeController',['$scope','$http','HomeDataService','localstorageFactory','$state','ngDialog','Upload','$filter','$timeout',function($scope,$http,HomeDataService,localstorageFactory,$state,ngDialog,Upload,$filter,$timeout){
 console.log("Inside Home Controller");
	 
 /*@@@@@@@@@@@@@@@@@@-------------------Variables Initialisation-----------------------@@@@@@@@@@@@@@@@@@@@@@****/

 $scope.options = {
     ErrorMessage :"",
     showError : false,
     popup : false
 }

 $scope.newPosts ={
   "count" : 0,
   "showNewPost" : false
 }
 
 $scope.skip = 0;
 $scope.limit = 4;

 $scope.posts =[];
 $scope.tempArray = [];
 $scope.featured_array = [];

 $scope.fetching = false;
 $scope.disabled = false;
 $scope.categoryType = "ALL";

 $scope.catgoryMessage = {
     message : "",
     showMess :false
 }

 $scope.filterArray = {
   "latest_first" : "Latest First",
   "oldest_first" : "Oldest First",
   "most_pet" : "Most Pet",
   "most_clicks" : "Most Clicks",
   "most_commented" : "Most Commented",

 }

 $scope.flagCheckboxModel = {
    selected: false
 }   


 $scope.User_logged_in = true;
 
  if(!localstorageFactory.getUserData('userData').email){
    $scope.User_logged_in = false;
  }
 
  $scope.userData = localstorageFactory.getUserData('userData');
  console.log("userData in HomeController" ,$scope.userData);

$scope.flaggedPosts =[];
$scope.tempPreviousPost =[];
$scope.isFlagged = false;

$scope.flaggedList = function($event) {

  $scope.isFlagged = true;
  console.log("")
  if($event==true){
     $scope.tempPreviousPost = $scope.posts;
     $scope.posts =[];
     $scope.tempArray.forEach(function(value){
        if(value.flagcount>0){
          $scope.posts.push(value);
        }
     })
     $scope.flaggedPosts = $scope.posts;
    //alert($event);
  } else{
     $scope.isFlagged = false; 
     //$scope.posts = $scope.setLikeUnlikeFlagUnflagFun($scope.tempPreviousPost);
     console.log("temp prev post at unflag,length,event:" +JSON.stringify($scope.tempPreviousPost),$scope.tempPreviousPost.length,$event)
     $scope.tempPreviousPost.forEach(function(obj){
      var index =  $scope.tempPreviousPost.indexOf(obj);
      var tempObj ={};
    
    if(obj.likeby.indexOf($scope.userData._id)>-1){
      obj["likeOrUnlike"] = "Unlike";
      if(obj.flagby.indexOf($scope.userData._id)>-1){
        obj["flagOrUnflag"] = "Unflag";
        tempObj = obj;
        $scope.tempPreviousPost.splice(index, 1, tempObj);
  
      } else {
        obj["flagOrUnflag"] = "Flag";
        tempObj = obj;
        $scope.tempPreviousPost.splice(index, 1, tempObj);
      }
  
    } else {
      obj["likeOrUnlike"] = "Likes";
      if(obj.flagby.indexOf($scope.userData._id)>-1){
           obj["flagOrUnflag"] = "Unflag";
           tempObj = obj;
           $scope.tempPreviousPost.splice(index, 1, tempObj);
      } else {
           obj["flagOrUnflag"] = "Flag";
           tempObj = obj;
          $scope.tempPreviousPost.splice(index, 1, tempObj);
      }
  
    } 
   
   })
   $scope.posts = $scope.tempPreviousPost;
   $scope.tempArray = $scope.posts;
   console.log("temp.length,$scope.categoryType,Post length at unflag:", $scope.tempArray.length,$scope.categoryType,$scope.posts.length);
   //console.log(">>>>>>>>>>>>>Previoustempost,isFlagged,length:" +JSON.stringify($scope.tempPreviousPost) ,$scope.isFlagged,$scope.tempPreviousPost.length)
  }
   $scope.filterPosts($scope.categoryType);
  //console.log("Flagged Post,length:" +JSON.stringify($scope.posts),$scope.posts.length);
} 


 //Get featuredpost
 $scope.featuredPostLimit = 4;
 $scope.featuredPostBool = true;

 HomeDataService.getFeaturedPosts($scope.featuredPostLimit,$scope.featuredPostBool).then(function(data){
    //console.log("featuredData in Home Controller:" + JSON.stringify(data));
    $scope.featuredposts = data;
    localstorageFactory.setFeaturedData('featuredData',$scope.featuredposts);
    $scope.makeCall();
 },function(err){
    console.log("error:",err);
    $scope.options.showError = true;
    $scope.options.ErrorMessage = err.message
 })


$scope.loadMore = function() {
  $scope.fetching = true;

  HomeDataService.getAllPosts($scope.limit,$scope.skip).then(function(data){
   //console.log(" Posts Data,length On Success:" + JSON.stringify(data),data.length);

    $scope.fetching = false;
    if (data.length>0) {
      //$scope.disabled = false
     /* if($scope.tempPreviousPost.length>0){
          console.log("tempPreviousPost length:",$scope.tempPreviousPost.length);;
          $scope.posts = $scope.tempPreviousPost;
      }*/
      for(var i = 0; i < data.length; i++) {
          if($scope.isFlagged){
            //console.log("is Flagged,previous length,Posts length:",$scope.isFlagged,$scope.tempPreviousPost.length,$scope.posts.length);
            if(data[i].flagcount>0){
              $scope.posts.push(data[i]);
            }
            $scope.tempPreviousPost.push(data[i]);
          }else{
            $scope.posts.push(data[i]);
          } 
          $scope.flaggedPosts = $scope.posts;
        } 
    } else {
        $scope.disabled = true; // Disable further calls if there are no more items
    }
    //console.log("Flagged post second scroll,length:" + JSON.stringify($scope.posts),$scope.posts.length);
    if($scope.isFlagged){
      $scope.skip = $scope.skip + data.length;
    } else{
       $scope.skip = $scope.posts.length;  
    }
                                    //$scope.skip + $scope.limit;
        if (!$scope.$$phase) {
          $scope.$apply();
        }
  
    //$scope.posts = $scope.setLikeUnlikeFlagUnflagFun($scope.posts);

    $scope.posts.forEach(function(obj){
      var index =  $scope.posts.indexOf(obj);
      var tempObj ={};
    
    if(obj.likeby.indexOf($scope.userData._id)>-1){
      obj["likeOrUnlike"] = "Unlike";
      if(obj.flagby.indexOf($scope.userData._id)>-1){
        obj["flagOrUnflag"] = "Unflag";
        tempObj = obj;
        $scope.posts.splice(index, 1, tempObj);
  
      } else {
        obj["flagOrUnflag"] = "Flag";
        tempObj = obj;
        $scope.posts.splice(index, 1, tempObj);
      }
  
    } else {
      obj["likeOrUnlike"] = "Likes";
      if(obj.flagby.indexOf($scope.userData._id)>-1){
           obj["flagOrUnflag"] = "Unflag";
           tempObj = obj;
           $scope.posts.splice(index, 1, tempObj);
      } else {
           obj["flagOrUnflag"] = "Flag";
           tempObj = obj;
          $scope.posts.splice(index, 1, tempObj);
      }
  
    } 
   
   })

    $scope.tempArray = $scope.posts;
    //alert(">>>>>>>>catType:"+$scope.categoryType);
    //alert(">>>>>>>>Length:"+data.length);
    if(data.length>0){
      $scope.filterPosts($scope.categoryType);
    } 
    $scope.newPosts.showNewPost =  false;

  },function(err){
     console.log("error:",err);
     $scope.options.showError = true;
     $scope.options.ErrorMessage = err.message
  })  

};

$scope.setLikeUnlikeFlagUnflagFun = function(array){
  return array.forEach(function(obj){
      var index =  array.indexOf(obj);
      var tempObj ={};
    
    if(obj.likeby.indexOf($scope.userData._id)>-1){
      obj["likeOrUnlike"] = "Unlike";
      if(obj.flagby.indexOf($scope.userData._id)>-1){
        obj["flagOrUnflag"] = "Unflag";
        tempObj = obj;
        array.splice(index, 1, tempObj);
  
      } else {
        obj["flagOrUnflag"] = "Flag";
        tempObj = obj;
        array.splice(index, 1, tempObj);
      }
  
    } else {
      obj["likeOrUnlike"] = "Likes";
      if(obj.flagby.indexOf($scope.userData._id)>-1){
           obj["flagOrUnflag"] = "Unflag";
           tempObj = obj;
           array.splice(index, 1, tempObj);
      } else {
           obj["flagOrUnflag"] = "Flag";
           tempObj = obj;
          array.splice(index, 1, tempObj);
      }
  
    } 
   
   })
 } 

 var catAllObj = {
  "catName" : "ALL",
  "image" : "icon_00.png"
 }
 //Get All category
 HomeDataService.getAllCategories().then(function(data){
    console.log("Catgeory Data in Home Controller:" + JSON.stringify(data));
    data.splice(0,0,catAllObj);
    console.log("Catgeory Data in Home Controller After:" + JSON.stringify(data));
    localstorageFactory.setCategoryData('categoryData',data);
    $scope.categories = data;
   
 },function(err){
    console.log("error:",err);
    $scope.options.showError = true;
    $scope.options.ErrorMessage = err.message
 })


 // new posts
 

 $scope.makeCall = function() {
      /*alert("$scope.categoryType:" +$scope.categoryType);
      alert("Post Array Length:" +$scope.posts.length);*/
     /* var date = new Date();
      var currentTime = date.toISOString();
      console.log("N:" +currentTime);*/
      //console.log("Posts in Make call:" +JSON.stringify($scope.posts));
      
      if($scope.posts.length>0){
          console.log("cat Type:",$scope.categoryType);
          if($scope.categoryType == "Most Commented" || $scope.categoryType == "Most Pet" || $scope.categoryType == "Most Clicks"){
             var date = new Date(new Date - 20000);
             console.log("Date:" ,date);
             var currentTime = date.toISOString();
          } else{
             if($scope.isFlagged){
              console.log("$scope.tempPreviousPost,isFlagged:" +JSON.stringify($scope.tempPreviousPost),$scope.isFlagged);
              var currentTime = $scope.tempPreviousPost[0].postedOn;
            } else {
              var currentTime = $scope.posts[0].postedOn;
            }
         }
      }  

      
      
      HomeDataService.getNewPost($scope.categoryType,currentTime,$scope.isFlagged).then(function(data){
          console.log("New Post Data.length:" +JSON.stringify(data),data.length);
          $scope.newPostsArray =[];
          if(data.length>0){
            $scope.newPosts.count = data.length;
            $scope.newPosts.showNewPost =  true;
            $scope.newPostsArray = data;
          } else {
            $scope.newPosts.count = 0;
            $scope.newPosts.showNewPost =  false;
            $scope.newPostsArray = [];
          }
      },function(err){

      })
           // start next API call after some timeout
      $timeout(function() {
          $scope.makeCall();
      }, 20000);  

}



$scope.newPosts = function(){
 $scope.newPostsArray.forEach(function(value){
   console.log("type of:" +typeof value.featuredPost)
   if(value.featuredPost == true){
      $scope.featured_array.push(value);
   }

   if($scope.isFlagged){
    $scope.tempPreviousPost.push(value); 
    $scope.posts =[];
    $scope.posts = $scope.flaggedPosts;
    if(value.flagcount>0){
      $scope.posts.push(value);
    }
   } else{
    if($scope.categoryType == "Oldest First"){
     $scope.posts.push(value)
    } else{
     $scope.posts.splice(0,0,value);
   }
  }
   
 })

 localstorageFactory.setFeaturedData('featuredData',$scope.featured_array);

 $scope.newPosts.showNewPost =  false;

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

  $scope.gotToProfile = function(){
    console.log("got to myprofile")
    $state.go('myprofile', {userId: $scope.userData._id });
  }
  

  

  /*@@@@@@@@@@@@----------------Filters of Posts various conditions -------------------------------*@@@@@@@@@@@@@@@@****/

  $scope.filterPosts = function(category){
   $scope.FilterSortArray =[];
   if($scope.isFlagged){
     $scope.FilterSortArray =  $scope.flaggedPosts;
   } else {
     $scope.FilterSortArray =  $scope.tempArray;
   }

   $scope.categoryType =  category;
   $scope.catgoryMessage.showMess = false;
   console.log("-------------------------------------------------------------->>>>",$scope.FilterSortArray.length);
   //console.log("Posts temparray,Length,category:"+JSON.stringify($scope.tempArray),$scope.tempArray.length,category);
  
  if(category =="Latest First") {
    $scope.posts = [];
    var temp_catgory_array =[];
    temp_catgory_array = $scope.FilterSortArray;
    $scope.posts = temp_catgory_array; 

  } else if (category =="Oldest First"){
    $scope.posts = [];
    var temp_catgory_array =[];
    $scope.FilterSortArray.forEach(function(value){
      temp_catgory_array.push(value);
    });
    $scope.posts = temp_catgory_array.reverse();

    //console.log("oldest after reverse temparray" + JSON.stringify($scope.FilterSortArray));

  } else if (category == "Most Pet") {
    $scope.posts =[];
    var temp_pet_array = [];
    $scope.FilterSortArray.forEach(function(value){
      temp_pet_array.push(value);
    });

    temp_pet_array.sort(function (a, b) {
     if (a.likecount > b.likecount) {
       return -1;
     }
     if (a.likecount < b.likecount) {
      return 1;
     }
     // a must be equal to b
      return 0;
    }); 

    $scope.posts = temp_pet_array;

  } else if (category == "Most Clicks"){

    $scope.posts =[];
    var temp_most_click_array = [];
    $scope.FilterSortArray.forEach(function(value){
      temp_most_click_array.push(value);
    });

     temp_most_click_array.sort(function (a, b) {
     if (a.clickCount > b.clickCount) {
       return -1;
     }
     if (a.clickCount < b.clickCount) {
      return 1;
     }
     // a must be equal to b
      return 0;
    }); 
    
     $scope.posts = temp_most_click_array;

  } else if (category == "Most Commented"){
    
    $scope.posts =[];
    var temp_most_commented_array = [];
    $scope.FilterSortArray.forEach(function(value){
      temp_most_commented_array.push(value);
    });

    temp_most_commented_array.sort(function (a, b) {
     if (a.commentcount > b.commentcount) {
       return -1;
     }
     if (a.commentcount < b.commentcount) {
      return 1;
     }
     // a must be equal to b
      return 0;
   }); 
   
   $scope.posts = temp_most_commented_array;

  } else{
    console.log("Posts Array inside selected category call:" +JSON.stringify($scope.FilterSortArray));
    $scope.posts = [];
    if(category =="ALL"){
      $scope.posts = $scope.FilterSortArray;
    }
    for(var i=0; i<$scope.FilterSortArray.length;i++){
    if($scope.FilterSortArray[i].catId.catName==category){
      $scope.posts.push($scope.FilterSortArray[i]); 
     }
   }
   if($scope.posts.length<1){
      $scope.catgoryMessage.showMess = true;
      $scope.catgoryMessage.message = "There is no Post of this category";
   }
  }

  }

 /*@@@@@@@@@@@@----------------Like and Unlike Functions-------------------------------*@@@@@@@@@@@@@@@@****/

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
    var index = {};
    $scope.posts.forEach(function(obj){
         if(obj._id == data._id){
             index = $scope.posts.indexOf(obj);
         }    
    })
    var tempObj ={};
    if(data.likeby.indexOf($scope.likeDetails.likeby)>-1){
      data["likeOrUnlike"] = "Unlike";
      if(data.flagby.indexOf($scope.userData._id)>-1){
           data["flagOrUnflag"] = "Unflag";
           tempObj = data;
           $scope.posts.splice(index, 1, tempObj);
      } else {
           data["flagOrUnflag"] = "Flag";
           tempObj = data;
           $scope.posts.splice(index, 1, tempObj);
      }
  
    } else {
  
      data["likeOrUnlike"] = "Likes";
      if(data.flagby.indexOf($scope.userData._id)>-1){
           data["flagOrUnflag"] = "Unflag";
           tempObj = data;
           $scope.posts.splice(index, 1, tempObj);
      } else {
           data["flagOrUnflag"] = "Flag";
           tempObj = data;
           $scope.posts.splice(index, 1, tempObj);
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
      var index = {};
      $scope.posts.forEach(function(obj){
         if(obj._id == data._id){
             index = $scope.posts.indexOf(obj);
         }    
      })
      var tempObj ={};
      console.log("index:",index)
      console.log("tempObj:",tempObj);
      data["likeOrUnlike"] = "Likes"
      if(data.flagby.indexOf($scope.userData._id)>-1){
           data["flagOrUnflag"] = "Unflag";
           tempObj = data;
           $scope.posts.splice(index, 1, tempObj);
      } else {
           data["flagOrUnflag"] = "Flag";
           tempObj = data;
           $scope.posts.splice(index, 1, tempObj);
      }

    },function(err){

    })  

  }

 }

 //Flag or unflag work
  
  $scope.flagOrUnflag = function(selectedPost,flagOrUnflag){
 
  console.log("Selected Post:" +JSON.stringify(selectedPost));
  console.log("flag or flagOrUnflag:" +flagOrUnflag);

  if(flagOrUnflag =="Flag"){
    $scope.flagDetails ={};
    $scope.flagDetails.postid = selectedPost._id,
    $scope.flagDetails.flagby = $scope.userData._id;
    console.log("Flag details:" +JSON.stringify($scope.flagDetails));

    HomeDataService.flagUpdate($scope.flagDetails).then(function(data){
    console.log("Flag Data success:" +JSON.stringify(data));
    var index = {};
    $scope.posts.forEach(function(obj){
         if(obj._id == data._id){
             index = $scope.posts.indexOf(obj);
         }    
    })
    var tempObj ={};
    if(data.flagby.indexOf($scope.flagDetails.flagby)>-1){
      data["flagOrUnflag"] = "Unflag";
      if(data.likeby.indexOf($scope.userData._id)>-1){
           data["likeOrUnlike"] = "Unlike";
           tempObj = data;
           $scope.posts.splice(index, 1, tempObj);
      } else {
           data["likeOrUnlike"] = "Likes";
           tempObj = data;
           $scope.posts.splice(index, 1, tempObj);
      }
  
  
    } else {
  
      data["flagOrUnflag"] = "Flag";
      if(data.likeby.indexOf($scope.userData._id)>-1){
           data["likeOrUnlike"] = "Unlike";
           tempObj = data;
           $scope.posts.splice(index, 1, tempObj);
      } else {
           data["likeOrUnlike"] = "Likes";
           tempObj = data;
           $scope.posts.splice(index, 1, tempObj);
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
      var index = {};
      $scope.posts.forEach(function(obj){
         if(obj._id == data._id){
             index = $scope.posts.indexOf(obj);
         }    
      })
      var tempObj ={};
      console.log("index:",index)
      console.log("tempObj:",tempObj);
      data["flagOrUnflag"] = "Flag"
      if(data.likeby.indexOf($scope.userData._id)>-1){
           data["likeOrUnlike"] = "Unlike";
           tempObj = data;
           $scope.posts.splice(index, 1, tempObj);
      } else {
           data["likeOrUnlike"] = "Likes";
           tempObj = data;
           $scope.posts.splice(index, 1, tempObj);
      }

    },function(err){

    })  

  }

 }

 //single post



 $scope.singlePost = function(postData){
 
  console.log("Post Data:" +JSON.stringify(postData));
  HomeDataService.getSinglePost(postData._id).then(function(data){

   if(data.likeby.indexOf($scope.userData._id)>-1){
      data["likeOrUnlike"] = "Unlike";
      if(data.flagby.indexOf($scope.userData._id)>-1){
        data["flagOrUnflag"] = "Unflag";
      } else{
        data["flagOrUnflag"] = "Flag";
      }
    } else {
      data["likeOrUnlike"] = "Likes";
      if(data.flagby.indexOf($scope.userData._id)>-1){
        data["flagOrUnflag"] = "Unflag";
      } else{
        data["flagOrUnflag"] = "Flag";
      }
    }
    console.log("Single post data success:" +JSON.stringify(data));
  
     $scope.posts.forEach(function(obj){
         if(obj._id == data._id){
             index = $scope.posts.indexOf(obj);
         }    
      })
      var tempObj ={};
      tempObj = data;
      $scope.posts.splice(index, 1, tempObj);

    localstorageFactory.setPostData('postData',data)
    $state.go('post');

  },function(err){

  })  
  
 }

 


 $scope.OK = function(){
      
    $timeout(function() {
        $state.go('login');
    },1000);

 }

 /*****@@@@*****--------------------Upload Image ----------------------------------------*****@@@@*****/

 $scope.uploadPost = function () {
    //delete $scope.categories[0]

    //$scope.selectedCategoryData = $scope.categories[1];

    $scope.showPostimage = false;

    if (!$scope.userData.email) {
       $scope.options.popup = true;
    } else {  

     ngDialog.open({
      template: 'screens/home/post.html',
      className: 'ngDialog-theme-default',
      scope: $scope,
      controller: ['$scope','Upload','HomeDataService','pplconfig','$filter','localstorageFactory', function($scope,Upload,HomeDataService,pplconfig,$filter,localstorageFactory) {
        console.log("Inside Upload post controller:" +JSON.stringify($scope.post));
        console.log("User Data Upload Post Controller:", $scope.userData);

        $scope.post ={
            "postTitle" :"",
            //"catType" : "",
            "creatorName"  : $scope.userData.username,
            "postedOn"     : "",
            "postImage"    : "" 

        }
        
        $scope.upload = function ($files) {
           console.log("files:",$files);
           for (var i = 0; i < $files.length; i++) {
           var file = $files[i]; 
           console.log("file:",file)
           Upload.upload({
               url: pplconfig.url+":3000/imageUpload",
               method: 'POST',
               fields: {'imgType': "post"},
               file: file
          }).progress(function (evt) {
               var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
               console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
          }).success(function (data, status, headers, config) {
               console.log("Data:",data);
               console.log("File path:",data.path);
               $scope.post.postImage = data.path.replace("home/com52/PPL/PPL_SITE/PPL_Backend/fileUpload", '');
               $scope.showPostimage = true;
               console.log("Post Image Path:",$scope.post.postImage);

          }).error(function (data, status, headers, config) {
            console.log('error status: ' + status);
          })
         } 
        };

        $scope.submitPost = function(){
         $scope.options.showError = false;
        
         if(!$scope.post.postTitle){
          console.log("0");
          $scope.options.showError = true;
          $scope.options.ErrorMessage = "Please Enter the Title for Post";
          return;
        } 
        if (!$scope.selectedCategoryData) {
           console.log("1");
           $scope.options.showError = true;
           $scope.options.ErrorMessage = "Please select category";
           return; 
        } if(!$scope.post.postImage){
           $scope.options.showError = true;
           $scope.options.ErrorMessage = "Please upload image for post";
           return; 
        } 
        else {

          $scope.postData = {};
          $scope.postData.postedBy = $scope.userData._id;
          $scope.postData.postTitle = $scope.post.postTitle;
          //$scope.postData.catType = $scope.selectedCategoryData.catName;
          $scope.postData.catId = $scope.selectedCategoryData._id;
          $scope.postData.postImage = $scope.post.postImage;
          
          console.log("Upload Post Requested Data:" +JSON.stringify($scope.postData));

          HomeDataService.createPost($scope.postData).then(function(data){
            console.log("Post Data success:" + JSON.stringify(data));

            $scope.catgoryMessage.showMess = false;

            data["likeOrUnlike"] = "Likes";
            $scope.posts.unshift(data);
            console.log("Posts Array after newly created post:" + JSON.stringify($scope.posts)); 
            $scope.closepopup = true;
            $scope.closeThisDialog($scope.closepopup);

          },function(err){
              console.log("err",err);
              $scope.options.showError = true;
              $scope.options.ErrorMessage = err.data;
          })
         }  

        }
     }]
   }); 

  } //end of else

 };


 $scope.adminPage = function(){
  
   $state.go('adminview');
 }
  

}])


