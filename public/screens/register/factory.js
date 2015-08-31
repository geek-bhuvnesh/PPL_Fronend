PPL_Frontend.factory("signup", ["$resource","pplconfig", function($resource,pplconfig) {
   /*return $resource("http://192.168.100.44:5500/signup", {  */
  return $resource(pplconfig.url +":3000/register", { 
   },{});
}]);

PPL_Frontend.factory("SignUpDataFactory", ["$http", "$q", "signup", function($http, $q, signup) {
   var userData = {};
   var selected;
   return {
        registerUser: function(user) {
          console.log("Inside signupdat factory Before call user:" + JSON.stringify(user));
           var defer = $q.defer();
           try {
               signup
                   .save({
                       firstname: user.firstname,
                       lastname : user.lastname,
                       password: user.password,
                       email:user.email,
                       confirm_password:user.confirm_password
                   }, function(resp) {
                       console.log("Signup Factory Response:" ,resp);
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