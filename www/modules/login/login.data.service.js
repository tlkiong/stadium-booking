(function(){
	'use strict';

	angular.module('Login')
		.service('userDataService', userDataService);

		userDataService.$inject = ['dataService'];
		function userDataService(dataService){
			
			var UserDataService = function(){
				var optionsObj = { 
					indices: ['username'],
					unique: ['username','email']
				};
				dataService.call(this, 'User', optionsObj);
			};

			UserDataService.prototype = Object.create( dataService.prototype );
			var dataService = new UserDataService();

			var facade = {
				saveUser : function(user, uniqueColumn){
					return dataService.saveObj(user, uniqueColumn);
				},
				deleteUser : function(user){
					return dataService.deleteObj(user);
				},
				deleteListOfUser : function(listOfUser){
					return dataService.deleteObjs(listOfUser);
				},
				getUserById : function(userId) {

					var userIdQuery = {};
					userIdQuery.id = userId;
					console.log('userIdQuery:');
					console.log(userIdQuery);
					return dataService.findObj(userIdQuery);
				},
				getUserByUsername : function (username){
					var usernameQuery = {};
					usernameQuery.username = username;
					return dataService.findObj(usernameQuery);
				},
				getUserByEmailAddress: function (emailAddress){
					var emailAddQuery = {};
					emailAddQuery.emailAddress = emailAddress;
					return dataService.findObj(emailAddQuery);
				},
				getAllUser : function(){
					return dataService.getAllObjs();
				},
				saveDatabase: function(callback){
					return dataService.saveDatabase(callback);
				}
			};

			return facade;
		}
})();