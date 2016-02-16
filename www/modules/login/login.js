(function () {
    'use strict';
    
	angular.module('Login', [])
		.config(function ($stateProvider) {
			$stateProvider
				.state('root.login', {
                    url: 'login',
                    role: 'public',
                    views: {
                        'body': {
                            templateUrl: './modules/login/login.html',
                            controller: 'loginController',
                            controllerAs: 'vm'
                        }
                    }
                });
		})
})();