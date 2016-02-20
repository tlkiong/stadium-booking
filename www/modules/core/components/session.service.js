(function() {

    'use strict';

    angular.module('Core')
        .service('sessionService', sessionService);

    sessionService.$inject = ['dataService', '$state'];

    function sessionService(dataService, $state) {
        var service = this;
        service.resetUserData = resetUserData;
        service.isLoggedIn = isLoggedIn;
        service.saveSession = saveSession;
        service.clearSession = clearSession;
        service.loadSession = loadSession;

        /* ======================================== Var ==================================================== */
        service.userData = {
            uid: '',
            isLoggedIn: false,
            fullName: '',
            role: '',
            emailAdd: ''
        };
        service.allStates = {}

        /* ======================================== Services =============================================== */
        var dataSvc = dataService;

        /* ======================================== Public Methods ========================================= */
        function loadSession() {
            var sessionUserData = localStorage.getItem('userData');
            if(!(sessionUserData === undefined || sessionUserData === null)) {
                service.userData = sessionUserData;
            }
            
            console.log(service.userData);
        }

        function clearSession() {
            localStorage.removeItem('userData', service.userData);
        }

        function saveSession() {
            localStorage.setItem('userData', service.userData);
        }

        function isLoggedIn() {
            if(service.userData.isLoggedIn) {
                return true;
            } else {
                return false;
            }
        }

        function resetUserData() {
            var originalUserData = {
                uid: '',
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
