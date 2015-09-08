PPL_Frontend.controller('HomeController',['$scope','$http','HomeDataService','localstorageFactory','$state','ngDialog','Upload','$filter',function($scope,$http,HomeDataService,localstorageFactory,$state,ngDialog,Upload,$filter){
 console.log("Inside Controller");
	

 $scope.options = {
     ErrorMessage :"",
     showError : false
 }

 $scope.User_logged_in = true;
 console.log("1:",localstorageFactory.getUserData('userData').email);
 if(!localstorageFactory.getUserData('userData').email){
 	  console.log("2");
    $scope.User_logged_in = false;
    //$state.go('login');
 }
 console.log("is User_logged_in:" +$scope.User_logged_in);
 
 $scope.userData = localstorageFactory.getUserData('userData');
 console.log("userData in HomeController" ,$scope.userData);

 $scope.tempArray = [];
 //Get All posts
 HomeDataService.getAllPosts().then(function(data){
   console.log("Posts Data in Home Controller before:" + JSON.stringify(data));

   data.forEach(function(obj){
    var index =  data.indexOf(obj);
    var tempObj ={};
    if(obj.likeby.indexOf($scope.userData._id)>-1){
      obj["likeOrUnlike"] = "Unlike";
      tempObj = obj;
      data.splice(index, 1, tempObj);
  
    } else {
      obj["likeOrUnlike"] = "Likes";
      tempObj = obj;
      data.splice(index, 1, tempObj);
    }
   
   })
   $scope.posts = data.reverse();
   $scope.tempArray = $scope.posts;
 },function(err){
   console.log("error:",err);
   $scope.options.showError = true;
   $scope.options.ErrorMessage = err.message
 })

 
 //Get All category
 HomeDataService.getAllCategories().then(function(data){
  console.log("Catgeory Data in Home Controller:" + JSON.stringify(data));
  $scope.categories = data;

 },function(err){
   console.log("error:",err);
   $scope.options.showError = true;
   $scope.options.ErrorMessage = err.message
 })

 $scope.logout = function(){
    console.log("Logout called");

    HomeDataService.logout().then(function(data){
      console.log("Logout Data:" ,data);
      localstorageFactory.removeUser("userData");
      $state.go('login');	

    },function(err){

    })

  }
  
  

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
  $scope.filterPosts = function(category){
   $scope.catgoryMessage.showMess = false;
   console.log("category:",category);
  if(category =="Latest First") {
    $scope.posts = [];
    var temp_catgory_array =[];
    temp_catgory_array = $scope.tempArray;
    $scope.posts = temp_catgory_array; 

  } else if (category =="Oldest First"){
    $scope.posts = [];
    var temp_catgory_array =[];
    $scope.tempArray.forEach(function(value){
      temp_catgory_array.push(value);
    }) ;
    $scope.posts = temp_catgory_array.reverse();

    console.log("oldest after reverse temparray >>>>>>>>>>>" + JSON.stringify($scope.tempArray));

  } else if (category == "Most Pet") {

  } else if (category == "Most Clicks"){

  } else if (category == "Most Commented"){

  } else{
    console.log("$scope.post in inside category click--------------" +JSON.stringify($scope.tempArray));
    $scope.posts = [];
    if(category =="ALL"){
      $scope.posts = $scope.tempArray;
    }
    for(var i=0; i<$scope.tempArray.length;i++){
    if($scope.tempArray[i]["catType"]==category){
      $scope.posts.push($scope.tempArray[i]); 
     }
   }
   if($scope.posts.length<1){
      $scope.catgoryMessage.showMess = true;
      $scope.catgoryMessage.message = "There is no Post of this category";
   }
  }

  }


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
      tempObj = data;
      $scope.posts.splice(index, 1, tempObj);
  
    } else {
  
      data["likeOrUnlike"] = "Likes";
      tempObj = data;
      $scope.posts.splice(index, 1, tempObj);
  
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
      tempObj = data;
      $scope.posts.splice(index, 1, tempObj);

    },function(err){

    })  

  }

 }





 $scope.uploadPost = function () {
     $scope.showPostimage = false;

    console.log("<<<<<<<<<<<<<<<<<<<",$scope.userData);
    if(!$scope.userData.email){
      alert("You are not logged in,please first login");
      //$state.go('login');
    } else {  

     console.log("upload post function:");
     ngDialog.open({
      template: 'screens/home/post.html',
      className: 'ngDialog-theme-default',
      scope: $scope,
      controller: ['$scope','Upload','HomeDataService','pplconfig','$filter', function($scope,Upload,HomeDataService,pplconfig,$filter) {


        console.log(">>>>>>>>>", $scope.userData);
        $scope.post ={
            "postTitle" :"",
            "catType" : "",
            /*"creatorImage" : $scope.userData.image,*/
            "creatorName"  : $scope.userData.username,
            "postedOn"     : "",
            "postImage"    : "" 

        }
        console.log("inside post controller:" +JSON.stringify($scope.post));

        /*$scope.onFileSelect = function($files) {
        console.log("image:", $files);
        $scope.upload = $upload.upload({
            url: '/imageUpload',
            method: 'POST',
            data: {
                email_id: $scope.userId
            },
            file: $files[0],
            alias: "file"
        }).progress(function(evt) {
            console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
        }).success(function(data, status, headers, config) {
            console.log("Image Data: ", data);
            if (status == 200 && data) {
                console.log(data.path);
                $scope.ProfileValues.image = data.path.replace("public", '');
            }
         });
      }
    */
    /*var host = 'http://localhost'*/
    // upload on file select or drop

    $scope.upload = function ($files) {
      console.log("files:",$files);
       for (var i = 0; i < $files.length; i++) {
        console.log("----------------------");
        var file = $files[i]; 
        console.log("file:",file)
        Upload.upload({
            url: pplconfig.url+":3000/imageUpload",
            method: 'POST',
            fields: {'username': $scope.username},
            file: file
        }).progress(function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
        }).success(function (data, status, headers, config) {
            console.log("Data:",data);
            console.log("----------------------");
            console.log("File path:",data.path);
            $scope.post.postImage = data.path.replace("fileUpload", '');
            $scope.showPostimage = true;
            //$scope.post.postImage = data.path;

            console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
        }).error(function (data, status, headers, config) {
            console.log('error status: ' + status);
        })
       } 
    };
    
        // controller logic
        console.log("<<<<<<<<<<<$scope.categories:" +JSON.stringify($scope.categories));
        
        $scope.submitPost = function(){
         /* alert(">>>>>" + JSON.stringify($scope.selectedCategoryData));*/
        $scope.options.showError = false;
        
        if(!$scope.post.postTitle){
          console.log("0");
          $scope.options.showError = true;
          $scope.options.ErrorMessage = "Title is mandatory";
          return;
        } 
        if (!$scope.selectedCategoryData) {
           console.log("1");
           $scope.options.showError = true;
           $scope.options.ErrorMessage = "Please select category";
           return; 
        } if(!$scope.post.postImage){
           $scope.options.showError = true;
           $scope.options.ErrorMessage = "upload Image is mandatory";
           return; 
        } else {

          $scope.postData = {};
          $scope.postData.postedBy = $scope.userData._id;
          $scope.postData.postTitle = $scope.post.postTitle;
          $scope.postData.catType = $scope.selectedCategoryData.catName;
          $scope.postData.postImage = $scope.post.postImage;
          
          console.log("$scope.postData:" +JSON.stringify($scope.postData));
          HomeDataService.createPost($scope.postData).then(function(data){
            console.log("Post Data:" + JSON.stringify(data));
            $scope.catgoryMessage.showMess = false;

            //var timestamp1 = new Date(data.postedOn)
            /*var filterdatetime = $filter('date')(data.postedOn);

            alert("filterdatetime:" +filterdatetime);*/
            $scope.posts.unshift(data);
            console.log("--------------------------------------------:");
            console.log("Posts after new post:" + JSON.stringify($scope.posts)); 
            $scope.closepopup = true;
            $scope.closeThisDialog($scope.closepopup);

          },function(err){
              console.log("err>>>>>>>>>",err);
              $scope.options.showError = true;
              $scope.options.ErrorMessage = err.data;
          })
         }  

        }
     }]
   }); 

  } //end of else

 };
  

}])


/*PPL_Frontend.filter('date', function($filter)
{

 return function(input)
 {
  //console.log("input:",input);
  if(input == null)
  { 
      return ""; 
  } 
  var _date = $filter('date')(new Date(input), 'dd MMM yyyy');
  console.log("")
  //return 
  _date.toUpperCase();

 };
});
*/
/*PPL_Frontend.controller('numbersController',function($scope){
   //infinite scrolling
    console.log("$scope.posts in number controller:" ,$scope.posts);
    $scope.postsArray = [];
    $scope.counter = 0;

    $scope.loadMore = function () {

        for (var i = 0; i < 25; i++) {
            $scope.postsArray.push(++$scope.counter);
        };
    }
    $scope.loadMore();
});
*/

