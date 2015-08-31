PPL_Frontend.factory("forgetPwd", ["$resource","pplconfig", function($resource,pplconfig) {
   return $resource(pplconfig.url +":3000/forgotpassword", {      
   },{
     save: {method:'POST', withCredentials:true}
   });

}]);

PPL_Frontend.factory("forgetPwdData", ["$http", "$q", "forgetPwd", function($http, $q, forgetPwd) {
   var userData = {};
   var selected;
   return {
        forgetPasswordFn: function(email) {
           var defer = $q.defer();
           try {
               forgetPwd
                   .save({
                       email: email
                   }, function(resp) {
                       console.log(JSON.stringify(resp));
                       userData = resp;
                       defer.resolve(userData);
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