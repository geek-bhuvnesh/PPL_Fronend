'use strict';

/**
 * @ngdoc service
 * @name epikkoAdmin.config
 * @description
 * # config
 * Value in the epikkoAdminApp.
 */
PPL_Frontend.factory('pplconfig', function(){
    /*console.log('from service config check ENV variables');

    // BE side
    var url = 'http://192.168.100.44';
    var host = 'http://localhost';
    var port = 3000;
    var path = '/';
    var shortcut = url + ':' + port + path;
    var PublishableStripeKey = 'pk_test_gdu2IJDVOOjUTokNQDm7urqq';

    // FE side
    var FEurl = 'http://localhost';
    var FEhost = 'http://localhost';
    var FEport = 8000;
    var FEpath = '/';
    var FEshortcut = url + ':' + port + path;

    return url;*/

    var url = "";
    return {
         /*url :'http://192.168.100.44'*/
         /* url :'http://myfirstionicapp.com'*/
         //url :'http://10.42.0.1'
         //url : 'http://localhost'
         /*url: '192.168.100.129'*/
         /*url:'http://192.168.100.98'*/
         //url:'ionic.com'
         url:'http://localhost'
    }
});


