(function() {
    'use strict';

    angular.module('app', [
            'Core',
            'Directives',
            'Root',
            'Login'
        ])
        .config(function($locationProvider, $stateProvider, $urlRouterProvider, $compileProvider) {
            $urlRouterProvider.otherwise('login');
        }).run(function($rootScope, $location, $state, sessionService) {
            var sessionSvc = sessionService;
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
                // if (toState.url === '/') {
                //     if (sessionSvc.isUserLoggedIn()) {
                //         evnt.preventDefault();
                //         $state.go('root.dashboard');
                //     } else {
                //         evnt.preventDefault();
                //         $state.go('login');
                //     }
                // } else {
                //     if (toState.role === undefined || toState.role === null || toState.role === '') {
                //         // Redirect to homepage
                //         evnt.preventDefault();
                //         $state.go('login');
                //     } else if (toState.role != 'public') {
                //         if (!sessionSvc.isUserLoggedIn()) {
                //             evnt.preventDefault();
                //             $state.go('login');
                //         } else {
                //             if (!(sessionSvc.userData.role === allStates[toState.name])) {
                //                 // Will redirect to a unauthorized page.
                //             }
                //         }
                //     }
                // }
            });
        });
})();
