(function () {
    'use strict';
    
	angular.module("Root", [])
		.config(function ($stateProvider) {
			$stateProvider
				.state('root', {
                    url: '/',
                    views: {
                        'main': {
                            templateUrl: './modules/root/root.html',
                            controller: 'rootController',
                            controllerAs: 'vm'
                        }
                    }
                });
		})
})();