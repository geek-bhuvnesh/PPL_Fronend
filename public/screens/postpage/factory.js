PPL_Frontend.factory("addComment",["$resource","pplconfig",function($resource,pplconfig) {
   console.log("pplconfig.url:",pplconfig.url);

    return $resource(pplconfig.url +":3000/addComment", {      
   },{
     save: {method:'POST', withCredentials:true}
   });
}]);


PPL_Frontend.factory("PostDataService", ["$http", "$q", "addComment", function($http, $q, addComment) {
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
       }
   }
}]);