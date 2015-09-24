
PPL_Frontend.factory("editProfile",["$resource","pplconfig",function($resource,pplconfig) {
     return $resource(pplconfig.url+":3000/editprofile/:userId",{ userId: "@userId"},
      {
       update: {
           method: "PUT"
       }
   });
}]);

PPL_Frontend.factory("myprofile", ["$resource","pplconfig",function($resource,pplconfig) {
    return $resource(pplconfig.url+":3000/myprofile/:userId", {
      userId: '@userId',
   }, {
     get: {method:'GET', isArray:false}
   });
}]);

PPL_Frontend.factory("editProfileFactory", ["$http", "$q", "editProfile","myprofile", function($http, $q, editProfile,myprofile) {
   var editProfileData = {};
   var selected;
   return {
       editProfileFn: function(editProfileData){
        console.log("ediptProfileData Factory" +JSON.stringify(editProfileData));
         console.log("ediptProfileData contact_no Factory" + typeof editProfileData.contact_no);
         var defer = $q.defer();
           try {
               editProfile
                   .update({
                       userId:editProfileData.userId,
                       username:editProfileData.name,
                       email:editProfileData.email,
                       photo:editProfileData.photo,
                       dob:editProfileData.dob,
                       contact_no:editProfileData.contact_no
                   }, function(resp) {
                       console.log(JSON.stringify(resp));
                       editProfileData = resp;
                       defer.resolve(editProfileData);
                   }, function(err) {
                       editProfileData = {};
                       defer.reject(err);
                       console.log(err);
                   });
           } catch (e) {
               console.log(e.stack);
               editProfileData = {};
               defer.reject({});
           }
           return defer.promise;

       },
        getMyProfileData: function(userId){
         console.log("ALL New Posts factory");
           var defer = $q.defer();
           try {
               myprofile
                   .get({
                    "userId":userId
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