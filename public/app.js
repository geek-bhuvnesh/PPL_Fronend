var PPL_Frontend = angular.module('PPLFrontend',['ui.router']);

PPL_Frontend.config(function($stateProvider,$urlRouterProvider,$httpProvider){

	$stateProvider.state('home',{
		url:'/home',
		templateUrl:'screens/home/home.html',
		controller:'HomeController'
	}).state('register',{
		url:'/register',
		templateUrl:'screens/register/register.html',
		controller:'RegisterController'
	}).state('login',{
		url:'/login',
		templateUrl:'screens/login/login.html',
		controller:'LoginController'
	}).state('forgetpassword',{
		url:'/forgetpassword',
		templateUrl:'screens/forgetpassword/forget.html',
		controller:'ForgetPasswordController'
	}).state('resetpassword',{
		url:'/resetpassword',
		templateUrl:'screens/resetpassword/reset.html',
		controller:'ResetPasswordController'
	}).state('post',{
		url:'/post',
		templateUrl:'screens/postpage/singal_post.html',
		controller:'PostController'
	})

    $httpProvider.defaults.withCredentials = true;
    $urlRouterProvider.otherwise('/home');
});



/*PPL_Frontend.controller('parentController',['$scope','$http',function($scope,$http){
	console.log("Inside Controller");
	$http.get('http://localhost:8000/home').success(function(data){
        console.log("Data:",data);
	});

}])*/