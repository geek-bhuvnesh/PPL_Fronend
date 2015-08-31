PPL_Frontend.factory("verifyuser", ["$resource","pplconfig",function($resource,pplconfig) {
    return $resource(pplconfig.url+":3000/verifyuser/:email/:verification_code", {
       email: '@email',
       verification_code: '@verification_code'
   }, {});
}]);


PPL_Frontend.factory("VerifyUserFactory", ["$http", "$q", "verifyuser", function($http, $q, verifyuser) {
   var userData = {};
   var selected;
   return {
       verifyUser: function(verifyUserData) {
           var defer = $q.defer();
           console.log("email in factory:" + verifyUserData.email);
           console.log("verification_code in factory:" + verifyUserData.verification_code);
           try {
               verifyuser
                   .get({
                       email: verifyUserData.email,
                       verification_code: verifyUserData.verification_code
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