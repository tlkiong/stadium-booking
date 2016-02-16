(function() {
    'use strict';
    
    angular.module('Root')
        .controller('rootController', rootController);

    rootController.$inject = ['$state', 'commonService', 'sessionService'];

    function rootController($state, commonService, sessionService) {
        var vm = this;
        vm.goToPage = goToPage;
        /* ======================================== Var ==================================================== */
        vm.misc = {};

        /* ======================================== Services =============================================== */
        var cmnSvc = commonService;
        var sessionSvc = sessionService;

        /* ======================================== Public Methods ========================================= */
        function goToPage(){
            $state.go('root.login');
        }
        /* ======================================== Private Methods ======================================== */
        function init() {
            
        }

        init();
    }
})();