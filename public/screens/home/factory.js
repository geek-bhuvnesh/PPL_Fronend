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



PPL_Frontend.factory("HomeDataService", ["$http", "$q", "logout","allCategories","allposts","post", function($http, $q, logout,allCategories,allposts,post) {
   var userData = {};
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
       }    
   }
}]);