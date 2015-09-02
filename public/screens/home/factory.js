PPL_Frontend.factory("logout", ["$resource","pplconfig",function($resource,pplconfig) {
    return $resource(pplconfig.url+":3000/logout", {
   }, {});
}]);


PPL_Frontend.factory("HomeDataService", ["$http", "$q", "logout", function($http, $q, logout) {
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
       }
   }
}]);