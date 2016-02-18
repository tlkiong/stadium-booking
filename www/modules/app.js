(function() {
    'use strict';

    angular.module('app', [
            'Core',
            'Directives',
            'Root',
            'Login',
            'Profile'
        ])
        .config(function($locationProvider, $stateProvider, $urlRouterProvider, $compileProvider) {
            $urlRouterProvider.otherwise('login');
        }).run(function(commonService, firebaseService, $rootScope, $location, $state, sessionService) {
            var sessionSvc = sessionService;
            var fbaseSvc = firebaseService;
            var cmnSvc = commonService;

            /**
             * allStates show all the states that can be accessed and the role who can access
             * Format:
             * allStates: {
             *     state.name: role that can access (if public means all can access without any authorization. Else, need login)
             * }
             * @type Object
             */
            var allStates = sessionSvc.allStates;

            $rootScope.$on('$stateChangeStart', function(evnt, toState, toParams, fromState, fromParams) {
                if (toState.url === '/') {
                    fbaseSvc.isLoggedInToFirebase().then(function(rs){
                        evnt.preventDefault();
                        cmnSvc.goToPage('profile', true);
                    }, function(err){
                        evnt.preventDefault();
                        cmnSvc.goToPage('login', true);
                    });
                } else {
                    if (toState.role === undefined || toState.role === null || toState.role === '') {
                        // Redirect to homepage
                        evnt.preventDefault();
                        cmnSvc.goToPage('login', true);
                    } else if (toState.role != 'public') {
                        if (!sessionSvc.isUserLoggedIn()) {
                            evnt.preventDefault();
                            cmnSvc.goToPage('login', true);
                        } else {
                            if (!(sessionSvc.userData.role === allStates[toState.name]) && allStates[toState.name] != 'any') {
                                alert("You don't have permission to access that page!");
                                evnt.preventDefault();
                                cmnSvc.goToPage('login', true);
                            }
                        }
                    }
                }
            });
        });
})();
