(function() {

    'use strict';

    angular.module('Core')
        .service('sessionService', sessionService);

    sessionService.$inject = ['$state'];

    function sessionService($state) {
        var service = this;
        service.resetUserData = resetUserData;
        service.isLoggedIn = isLoggedIn;

        /* ======================================== Var ==================================================== */
        service.userData = {
            isLoggedIn: false,
            fullName: '',
            role: '',
            emailAdd: ''
        };
        service.allStates = {}

        /* ======================================== Services =============================================== */

        /* ======================================== Public Methods ========================================= */
        function isLoggedIn() {
            if(service.userData.isLoggedIn) {
                return true;
            } else {
                return false;
            }
        }

        function resetUserData() {
            var originalUserData = {
                isLoggedIn: false,
                fullName: '',
                role: '',
                emailAdd: ''
            };

            angular.copy(originalUserData, service.userData);
        }

        /* ======================================== Private Methods ======================================== */
        function getStates() {
            var list = $state.get();

            for (var x in list) {
                if (!(list[x].role === undefined || list[x].role === null || list[x].role === '')) {
                    service.allStates[list[x].name] = list[x].role;
                }
            }
        }

        function init() {
            getStates();
        }

        init();
    }

})();
