PPL_Frontend.factory("changePwd", ["pplconfig", "$resource", function(pplconfig, $resource) {
   return $resource(pplconfig.url +":3000/changepassword/:userId", {
     userId: '@userId'
   },{
      save: {method:'POST', withCredentials:true}
   });
}]);


PPL_Frontend.factory("changePwdData", ["$http", "$q", "changePwd", function($http, $q, changePwd) {
   var userData = {};
   var selected;
   return {
        changePasswordFn: function(changePasswordData) {
           var defer = $q.defer();
           try {
               changePwd
                   .save({
                       userId:changePasswordData.userId,
                       new_password:changePasswordData.new_password,
                       old_password:changePasswordData.current_password,
                       withCredentials:true
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