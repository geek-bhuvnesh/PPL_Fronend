PPL_Frontend.factory("logout", ["$resource","pplconfig",function($resource,pplconfig) {
    return $resource(pplconfig.url+":3000/logout", {
   }, {});
}]);

PPL_Frontend.factory("allCategories", ["$resource","pplconfig",function($resource,pplconfig) {
    return $resource(pplconfig.url+":3000/getAllCategories", {
   }, {});
}]);

PPL_Frontend.factory("allposts", ["$resource","pplconfig",function($resource,pplconfig) {
    return $resource(pplconfig.url+":3000/getAllPosts", {
   }, {});
}]);

PPL_Frontend.factory("post",["$resource","pplconfig",function($resource,pplconfig) {
   console.log("pplconfig.url:",pplconfig.url);

    return $resource(pplconfig.url +":3000/post", {      
   },{
     save: {method:'POST', withCredentials:true}
   });
}]);

PPL_Frontend.factory("like",  ["$resource","pplconfig",function($resource,pplconfig) {
     return $resource(pplconfig.url+":3000/like/:postid",{ postid: "@postid"},
      {
       update: {
           method: "PUT"
       }
   });
}]);


PPL_Frontend.factory("unlike",  ["$resource","pplconfig",function($resource,pplconfig) {
     return $resource(pplconfig.url+":3000/unlike/:postid",{ postid: "@postid"},
      {
       update: {
           method: "PUT"
       }
   });
}]);

PPL_Frontend.factory("getPost", ["$resource","pplconfig",function($resource,pplconfig) {
    return $resource(pplconfig.url+":3000/getPost/:postid", {
       postid: '@postid',
   }, {
       update: {
           method: "PUT"
       }
     });
}]);

PPL_Frontend.factory("HomeDataService", ["$http", "$q", "logout","allCategories","allposts","post","like","unlike","getPost", function($http, $q, logout,allCategories,allposts,post,like,unlike,getPost) {
   var userData = {}; 
   var likeUnlikeData = {};
   var postData = {};
   var selected;
   return {
       logout: function() {
           console.log("Logout factory");
           var defer = $q.defer();
           try {
               logout
                   .get(function(resp) {
                      userData = resp;
                      defer.resolve(resp);
                   },function(err) {
                       userData = {};
                       defer.reject({});
                       console.log(err);
                   });
           } catch (e) {
               console.log(e.stack);
               defer.reject({});
           }
           return defer.promise;
       },
       getAllCategories: function(){
         console.log("ALL Categories factory");
           var defer = $q.defer();
           try {
               allCategories
                   .query(function(resp) {
                      userData = resp;
                      defer.resolve(resp);
                   },function(err) {
                       userData = {};
                       defer.reject({});
                       console.log(err);
                   });
           } catch (e) {
               console.log(e.stack);
               defer.reject({});
           }
           return defer.promise;
       },
       getAllPosts: function(){
         console.log("ALL Posts factory");
           var defer = $q.defer();
           try {
               allposts
                   .query(function(resp) {
                      userData = resp;
                      defer.resolve(resp);
                   },function(err) {
                       userData = {};
                       defer.reject({});
                       console.log(err);
                   });
           } catch (e) {
               console.log(e.stack);
               defer.reject({});
           }
           return defer.promise;
       }, 
       createPost: function(postData) {
          console.log("User Login Data Factory:" + JSON.stringify(postData));
           var defer = $q.defer();
           try {
               post
                  .save({
                        postedBy : postData.postedBy,
                        postTitle: postData.postTitle,
                        catType : postData.catType,
                        postImage : postData.postImage
                   }, function(resp) {
                       console.log("response post in factory:" +JSON.stringify(resp));
                       userData = resp;
                       defer.resolve(resp);
                   }, function(err) {
                       userData = {};
                       defer.reject(err);
                       console.log(err);
                   });
           } catch (e) {
               console.log(e.stack);
               userData = {};
               defer.reject({});
           }
           return defer.promise;
       },
      likeUpdate : function(likeData){
         var defer = $q.defer();
         console.log("---Like data START factory", likeData)
           try {
                like
                   .update({
                    "postid":likeData.postid,
                    "likeby":likeData.likeby
                   }, function(resp) {
                       likeUnlikeData = resp;
                       defer.resolve(likeUnlikeData);
                   }, function(err) {
                       likeUnlikeData = {};likeUnlikeData
                       defer.reject(err);
                       console.log(err);
                   });
           } catch (e) {
               console.log(e.stack);
               likeUnlikeData = {};
               defer.reject({});
           }
           return defer.promise;         
       },
       unlikeUpdate:function(unlikeData){
         var defer = $q.defer();
         console.log("---Unlike data START factory", unlikeData)
           try {
                unlike
                   .update({
                    "postid":unlikeData.postid,
                    "likeby":unlikeData.likeby
                   }, function(resp) {
                       unlikeData = resp;
                       defer.resolve(unlikeData);
                   }, function(err) {
                       unlikeData = {};
                       defer.reject(err);
                       console.log(err);
                   });
           } catch (e) {
               console.log(e.stack);
               unlikeData = {};
               defer.reject({});
           }
           return defer.promise;     

       },
       getSinglePost: function(postid) {
           console.log("Logout factory");
           var defer = $q.defer();
           try {
               getPost
                   .update({
                       postid: postid
                   },function(resp) {
                      postData = resp;
                      defer.resolve(resp);
                   },function(err) {
                       postData = {};
                       defer.reject({});
                       console.log(err);
                   });
           } catch (e) {
               console.log(e.stack);
               defer.reject({});
           }
           return defer.promise;
       }  
   }
}]);