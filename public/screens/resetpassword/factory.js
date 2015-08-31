PPL_Frontend.factory("resetPwd", ["$resource","pplconfig", function($resource,pplconfig) {
   return $resource(pplconfig.url +":3000/resetpassword/:email", { 
     email: '@email'
   },{});
}]);


PPL_Frontend.factory("resetPwdData", ["$http", "$q", "resetPwd", function($http, $q, resetPwd) {
   var userData = {};
   var selected;
   return {
        resetPasswordFn: function(data) {
          console.log("resetPasswordFn factory:"+JSON.stringify(data));
           var defer = $q.defer();
           try {
               resetPwd
                   .save({
                       email: data.email,
                       reset_pass_token: data.reset_pass_token,
                       new_password : data.password,
                       confirm_password : data.confirm_password
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