PPL_Frontend.factory("login",["$resource","pplconfig",function($resource,pplconfig) {
   console.log("pplconfig.url:",pplconfig.url);

    return $resource(pplconfig.url +":3000/login", {      
   },{
     save: {method:'POST', withCredentials:true}
   });
}]);


PPL_Frontend.factory("LoginDataService", ["$http", "$q", "login", function($http, $q, login) {
   var userData = {};
   var selected;
   return {
        fetchLoginData: function(user) {
          console.log("User Login Data Factory:" + JSON.stringify(user));
           var defer = $q.defer();
           try {
               login
                   .save({
                       email: user.email,
                       password: user.password
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