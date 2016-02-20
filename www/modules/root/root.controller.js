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
        vm.misc = sessionService.userData; // AngularJS only watches object and not the final property. Thus, have to be done this way

        /* ======================================== Services =============================================== */
        var cmnSvc = commonService;
        var sessionSvc = sessionService;
        var fbaseSvc = firebaseService;

        /* ======================================== Public Methods ========================================= */
        function signOut() {
            fbaseSvc.logout();
        }

        function goToPage(pageName) {
            cmnSvc.goToPage(pageName, true);
        }

        /* ======================================== Private Methods ======================================== */
        function init() {
            
        }

        init();
    }
})();