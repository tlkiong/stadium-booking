(function() {

    'use strict';

    angular.module('Core')
        .service('sessionService', sessionService);

    sessionService.$inject = ['dataService', '$state'];

    function sessionService(dataService, $state) {
        var service = this;
        service.resetUserData = resetUserData;
        service.saveSession = saveSession;
        service.clearSession = clearSession;
        service.loadSession = loadSession;

        /* ======================================== Var ==================================================== */
        service.userData = {
            myBookings: [],
            myConfirmBookings: [],
            myBookingListFromFbase: [],
            tokenExpiry: -1,
            uid: '',
            fullName: '',
            role: '',
            emailAdd: '',
            isLoggedIn: false // This is to show / hide DOM element for logged in users only
        };
        service.allStates = {}

        /* ======================================== Services =============================================== */
        var dataSvc = dataService;

        /* ======================================== Public Methods ========================================= */
        function loadSession() {
            service.userData.tokenExpiry = localStorage.getItem('userData.tokenExpiry');
            service.userData.uid = localStorage.getItem('userData.uid');
            service.userData.fullName = localStorage.getItem('userData.fullName');
            service.userData.role = localStorage.getItem('userData.role');
            service.userData.emailAdd = localStorage.getItem('userData.emailAdd');

            if (Math.floor(Date.now() / 1000) < service.userData.tokenExpiry) {
                service.userData.isLoggedIn = true;
            }
        }

        function clearSession() {
            localStorage.removeItem('userData.uid');
            localStorage.removeItem('userData.tokenExpiry');
            localStorage.removeItem('userData.fullName');
            localStorage.removeItem('userData.role');
            localStorage.removeItem('userData.emailAdd');
        }

        function saveSession() {
            localStorage.setItem('userData.uid', service.userData.uid);
            localStorage.setItem('userData.tokenExpiry', service.userData.tokenExpiry);
            localStorage.setItem('userData.fullName', service.userData.fullName);
            localStorage.setItem('userData.role', service.userData.role);
            localStorage.setItem('userData.emailAdd', service.userData.emailAdd);
        }

        function resetUserData() {
            var originalUserData = {
                myBookings: [],
                myConfirmBookings: [],
                myBookingListFromFbase: {},
                tokenExpiry: -1,
                uid: '',
                fullName: '',
                role: '',
                emailAdd: '',
                isLoggedIn: false
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
            loadSession();
        }

        init();
    }

})();
