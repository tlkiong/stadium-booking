(function() {
    'use strict';
    
    angular.module('Root')
        .controller('rootController', rootController);

    rootController.$inject = ['firebaseService', 'commonService', 'sessionService'];

    function rootController(firebaseService, commonService, sessionService) {
        var vm = this;
        vm.goToPage = goToPage;
        vm.signOut = signOut;

        /* ======================================== Var ==================================================== */
        vm.misc = {
            isLoggedIn: false
        };

        /* ======================================== Services =============================================== */
        var cmnSvc = commonService;
        var sessionSvc = sessionService;
        var fbaseSvc = firebaseService;

        /* ======================================== Public Methods ========================================= */
        function signOut() {
            fbaseSvc.logout().then(function(rs){

            }, function (err){

            });
        }

        function goToPage(pageName) {
            cmnSvc.goToPage(pageName, true);
        }

        /* ======================================== Private Methods ======================================== */
        function watchLoggedInState(authData) {
            if (authData) {
                // console.log("User " + authData.uid + " is logged in with " + authData.provider);
                vm.misc.isLoggedIn = true;
                sessionSvc.userData.isLoggedIn = true;
            } else {
                // console.log("User is logged out");
                vm.misc.isLoggedIn = false;
                sessionSvc.resetUserData();
            }
        }

        function init() {
            fbaseSvc.listenToAuth(watchLoggedInState);
        }

        init();
    }
})();