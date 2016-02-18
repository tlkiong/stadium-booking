(function () {
    'use strict';
    
	angular.module('Profile', [])
		.config(function ($stateProvider) {
			$stateProvider
				.state('root.profile', {
                    url: 'profile',
                    role: 'any', // All role can view but must be logged in
                    views: {
                        'body': {
                            templateUrl: './modules/profile/profile.html',
                            controller: 'profileController',
                            controllerAs: 'vm'
                        }
                    }
                });
		})
})();