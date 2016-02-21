(function () {
    'use strict';
    
	angular.module('Booking', [])
		.config(function ($stateProvider) {
			$stateProvider
				.state('root.booking', {
                    url: 'booking',
                    role: 'any', // All role can view but must be logged in
                    views: {
                        'body': {
                            templateUrl: './modules/booking/booking.html',
                            controller: 'bookingController',
                            controllerAs: 'vm'
                        }
                    }
                });
		})
})();