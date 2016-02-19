(function() {
    'use strict';
    
    angular.module('Root')
        .controller('rootController', rootController);

    rootController.$inject = ['firebaseService', 'commonService', 'sessionService'];

    function rootController(firebaseService, commonService, sessionService) {
        var vm = this;
        vm.goToPage = goToPage;
        vm.signOut = signOut;
        vm.startListenAuth = startListenAuth;

        /* ======================================== Var ==================================================== */
        vm.misc = {
            isLoggedIn: false
        };

        /* ======================================== Services =============================================== */
        var cmnSvc = commonService;
        var sessionSvc = sessionService;
        var fbaseSvc = firebaseService;

        /* ======================================== Public Methods ========================================= */
        function startListenAuth() {
            fbaseSvc.listenToAuth(watchLoggedInState);
        }

        function signOut() {
            fbaseSvc.logout();
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
                fbaseSvc.stopListenToAuth(function() {});
                vm.misc.isLoggedIn = false;
                sessionSvc.resetUserData();
                cmnSvc.goToPage(undefined, undefined, true);
            }
        }

        function init() {
            fbaseSvc.isLoggedInToFirebase().then(function(rs){
                sessionSvc.loadSession();
            }, function(err){
                sessionSvc.clearSession();
            });
        }

        init();
    }
})();