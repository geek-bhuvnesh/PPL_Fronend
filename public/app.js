var PPL_Frontend = angular.module('PPLFrontend',['ui.router','ngSanitize','ngResource','ngDialog','ngFileUpload','angularFileUpload','angularMoment','infinite-scroll','ngMessages']);

PPL_Frontend.config(function($stateProvider,$urlRouterProvider,$httpProvider){

	$stateProvider.state('home',{
		url:'/home',
		templateUrl:'screens/home/home.html',
		controller:'HomeController'
	}).state('register',{
		url:'/register',
		templateUrl:'screens/register/register.html',
		controller:'RegisterController'
	}).state('verifyloading', {
    url: '/verifyloading',
    templateUrl: 'screens/verify/verifyloading.html'
  }).state('verifyuseremail', {
    url: '/verifyuseremail/:email/:verification_code',
    templateUrl: 'screens/verify/verify-email.html',
    controller: 'VerifyController'
  }).state('login',{
		url:'/login',
		templateUrl:'screens/login/login.html',
		controller:'LoginController'
	}).state('forgetpassword',{
		url:'/forgetpassword',
		templateUrl:'screens/forgetpassword/forget.html',
		controller:'ForgetPasswordController'
	}).state('resetpassword',{
		url:'/resetpassword/:email/:reset_pass_token',
		templateUrl:'screens/resetpassword/reset.html',
		controller:'ResetPasswordController'
	}).state('post',{
		url:'/post',
		templateUrl:'screens/postpage/singal_post.html',
		controller:'PostController'
	}).state('changepassword',{
    url:'/changepassword',
    templateUrl:'screens/changepassword/changepassword.html',
    controller:'ChangePasswordController'
  })

    $httpProvider.defaults.withCredentials = true;
    $urlRouterProvider.otherwise('/home');
});



PPL_Frontend.factory('localstorageFactory', ['$window', function($window) {
  return {
    setVerified: function(key, value) {
      $window.localStorage[key] = value;
    },
    getVerified: function(key) {
      return $window.localStorage[key];
    },
    setUserData: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getUserData: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    },
    removeUser : function(key){
      console.log("key:",key);
      return $window.localStorage.clear();
    },
    setPostData: function(key,value) {
      console.log("key:",key);
      $window.localStorage[key] = JSON.stringify(value);
    },
    getPostData: function(key) {
       return JSON.parse($window.localStorage[key] || '{}');
    },
    setCategoryData: function(key,value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getCategoryData: function(key){
      return JSON.parse($window.localStorage[key] || '{}');
    }

  }
}]);
