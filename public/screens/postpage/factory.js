PPL_Frontend.factory("addComment",["$resource","pplconfig",function($resource,pplconfig) {
   console.log("pplconfig.url:",pplconfig.url);

    return $resource(pplconfig.url +":3000/addComment", {      
   },{
     save: {method:'POST', withCredentials:true}
   });
}]);

PPL_Frontend.factory("newcomments", ["$resource","pplconfig",function($resource,pplconfig) {
    return $resource(pplconfig.url+":3000/newComments/:postid/:existCommentsLength/:limit", {
      postid: '@postid',
      existCommentsLength: '@existCommentsLength',
      limit : '@limit'
   }, {});
}]);


PPL_Frontend.factory("PostDataService", ["$http", "$q", "addComment","newcomments", function($http, $q, addComment,newcomments) {
   var commentData = {};
   var selected;
   return {
        addComment: function(commentData) {
          console.log("commentData Factory START:" + JSON.stringify(commentData));
           var defer = $q.defer();
           try {
               addComment
                   .save({
                      "postid": commentData.postid,
                      "commentText" : commentData.commentText,
                      "createdBy" : commentData.createdBy
                   }, function(resp) {
                       console.log(JSON.stringify(resp));
                       commentData = resp;
                       defer.resolve(commentData);
                   }, function(err) {
                       commentData = {};
                       defer.reject(err);
                       console.log(err);
                   });
           } catch (e) {
               console.log(e.stack);
               commentData = {};
               defer.reject({});
           }
           return defer.promise;
       },
        getNewComments: function(postid,existCommentsLength,limit){
         console.log("ALL New Comments factory");
           var defer = $q.defer();
           try {
               newcomments
                   .get({
                    "postid" : postid,
                    "existCommentsLength":existCommentsLength,
                    "limit" : limit,
                   },function(resp) {
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
       } 
   }
}]);